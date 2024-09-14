import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import slugs from "slugs";

import getPresignedUrl from "../helper/presignedUrl.js";
import GalleryModel from "../model/GalleryModel.js";
import GalleryMetaModel from "../model/GalleryMetaModel.js";
import s3Client from "../../../config/s3Config.js";
import db from "../../../config/db.js";

const bucketName = process.env.BUCKET_NAME;

const fetchPosts = async (req, res) => {
  try {
    // Get pagination parameters from the request query
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Fetch paginated data from the database
    const { rows: data, count: totalItems } = await GalleryModel.findAndCountAll({
      include: [{ model: GalleryMetaModel, as: "meta" }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    // Generate presigned URLs for each image
    const updatedData = await Promise.all(
      data.map(async (item) => {
        const presignedUrl = await getPresignedUrl(bucketName, item.image_url.split('/').pop());
        return {
          ...item.toJSON(), 
          presignedUrl,
        };
      })
    );

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      status: 200,
      data: updatedData,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    return res.status(500).send(`Error listing objects: ${error.message}`);
  }
};

const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: bucketName,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
};

const saveImagedata = async (data, transaction) => {
  const { post_title, image_url, post_slug, stock, description } = data;

  return await GalleryModel.create(
    {
      post_title,
      post_slug,
      image_url,
      stock,
      description,
    },
    { transaction }
  );
};

const uploadImage = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { post_title, stock, description } = req.body;
    const file = req.file;
    let post_slug = slugs(post_title);

    if (!file) {
      return res.status(400).json({
        status: 400,
        message: "No file uploaded.",
      });
    }

    if (!post_title || !stock || !description) {
      return res.status(400).json({
        status: 400,
        message: "Title, slug, stock, and description are required.",
      });
    }

    const image_url = await uploadFileToS3(file);

    // Save the image metadata and commit the transaction
    await saveImagedata(
      { post_title, post_slug, image_url, stock, description },
      transaction
    );

    await transaction.commit();

    return res.status(200).json({
      status: 200,
      message: "File uploaded successfully",
      image_url,
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      status: 500,
      error: `Server error: ${error.message}`,
    });
  }
};

const deletePost = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.query;

    // Fetch the item from the database
    const galleryItem = await GalleryModel.findOne({ where: { id } });

    if (!galleryItem) {
      return res.status(404).json({
        status: 404,
        message: "Item not found",
      });
    }

    // Extract the file key from the URL
    const fileKey = galleryItem.image_url.split('/').pop();

    // Delete the file from the S3 bucket
    const params = {
      Bucket: bucketName,
      Key: fileKey,
    };
    
    const deleteCommand = new DeleteObjectCommand(params);
    await s3Client.send(deleteCommand);

    // Delete the record from the database
    await GalleryModel.destroy({ where: { id }, transaction });

    await transaction.commit();

    return res.status(200).json({
      status: 200,
      message: "Item deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      status: 500,
      error: `Server error: ${error.message}`,
    });
  }
};

export default { fetchPosts, uploadImage, deletePost };
