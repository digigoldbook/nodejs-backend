import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../../config/s3Config.js";
import path from "path";
import slugs from "slugs";

import GalleryMetaModel from "../model/GalleryMetaModel.js";
import GalleryModel from "../model/GalleryModel.js";
import getPresignedUrl from "../helper/presignedUrl.js"; 
import redis from "redis";

// Redis client creation
const client = redis.createClient();

client.on('error', (err) => {
  console.log('Redis Client Error', err);
});

await client.connect(); // Ensure this is connected

// Helper function to generate unique file names
const generateUniqueFileName = (originalName) => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  return `${name}-${Date.now()}${ext}`;
};

const uploadFileAndCreatePost = async (req, res) => {
  const { post_title, stock, description, folderName, user_id } = req.body;

  let post_slug = slugs(post_title);

  if (!req.file) {
    return res.status(400).json({
      status: 400,
      error: "No file provided",
    });
  }

  const fileName = generateUniqueFileName(req.file.originalname);
  const fileKey = folderName ? `${folderName}/${fileName}` : fileName;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    // Upload file to S3
    await s3Client.send(new PutObjectCommand(params));

    // Generate the presigned URL for the uploaded file
    const presignedUrl = await getPresignedUrl(process.env.BUCKET_NAME, fileKey);

    // Store the post in the database
    const newPost = await GalleryModel.create({
      post_title,
      post_slug,
      stock,
      s3_key: fileKey,
      image_url: presignedUrl, 
      description,
    });

    // Prepare metadata entries
    const metaEntries = [
      {
        gallery_id: newPost.id,  // Use the ID of the newly created gallery
        meta_key: "user_id",      // Set the meta key
        meta_value: user_id,      // Set the meta value to the user_id
      }
    ];

    // Store metadata in GalleryMetaModel
    await GalleryMetaModel.bulkCreate(metaEntries);

    // Invalidate the cache for posts
    await client.del('posts:*'); // Clear all post caches (or specify more targeted keys if needed)

    return res.status(200).json({
      status: 200,
      message: "File uploaded and post created successfully",
      post: newPost,
      presignedUrl, // Include the presigned URL in the response
    });
  } catch (error) {
    console.error(`Error during post creation: ${error.message}`, error);

    // If there was an error, attempt to delete the uploaded file
    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
      }));
    } catch (deleteError) {
      console.error(`Failed to delete file from S3: ${deleteError.message}`);
    }

    return res.status(500).json({
      status: 500,
      error: `Error occurred: ${error.message}`,
    });
  }
};

export default uploadFileAndCreatePost;
