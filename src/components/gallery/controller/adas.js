import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import redis from "redis";
import getPresignedUrl from "../helper/presignedUrl.js";
import GalleryModel from "../model/GalleryModel.js";
import GalleryMetaModel from "../model/GalleryMetaModel.js";
import s3Client from "../../../config/s3Config.js";
import db from "../../../config/db.js";

// Initialize Redis client
const client = redis.createClient();

client.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

// Connect to Redis
await client.connect();

const bucketName = process.env.BUCKET_NAME;

// Function to cache and retrieve presigned URLs from Redis
const getCachedPresignedUrls = async (objectKeys) => {
  try {
    const cachedUrls = await client.mGet(objectKeys);
    return Promise.all(objectKeys.map(async (objectKey, index) => {
      const cachedUrl = cachedUrls[index];
      if (cachedUrl) {
        console.info('Cache hit for:', objectKey);
        return cachedUrl; // Return cached URL
      } else {
        try {
          const presignedUrl = await getPresignedUrl(bucketName, objectKey);
          await client.setEx(objectKey, 86400, presignedUrl); // Cache the new URL
          console.info('Cache miss: Generating and caching new URL');
          return presignedUrl;
        } catch (error) {
          console.error(`Error generating presigned URL for ${objectKey}:`, error);
          throw error; // Handle error in generating pre-signed URL
        }
      }
    }));
  } catch (error) {
    console.error('Redis mGet error:', error);
    throw error; // Handle error in Redis
  }
};

// Fetch posts with pagination
const fetchPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Validate pagination parameters
    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.max(1, parseInt(limit));

    const { rows: data, count: totalItems } = await GalleryModel.findAndCountAll({
      include: [{ model: GalleryMetaModel, as: "meta" }],
      limit: parsedLimit,
      offset: (parsedPage - 1) * parsedLimit,
      order: [["createdAt", "DESC"]],
    });

    const objectKeys = data.map(item => item.image_url.split("/").pop());
    const presignedUrls = await getCachedPresignedUrls(objectKeys);

    const updatedData = data.map((item, index) => ({
      ...item.toJSON(),
      presignedUrl: presignedUrls[index],
    }));

    const totalPages = Math.ceil(totalItems / parsedLimit);

    return res.status(200).json({
      status: 200,
      data: updatedData,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parsedPage,
        itemsPerPage: parsedLimit,
      },
    });
  } catch (error) {
    logger.error('Error fetching posts:', error);
    return res.status(500).send(`Error fetching posts: ${error.message}`);
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.query;

    const galleryItem = await GalleryModel.findOne({ where: { id } });

    if (!galleryItem) {
      return res.status(404).json({
        status: 404,
        message: "Item not found",
      });
    }

    const fileKey = galleryItem.s3_key;

    if (fileKey) {
      const params = {
        Bucket: bucketName,
        Key: fileKey,
      };

      const deleteCommand = new DeleteObjectCommand(params);
      await s3Client.send(deleteCommand);
    }

    await GalleryModel.destroy({ where: { id }, transaction });

    await transaction.commit();

    return res.status(200).json({
      status: 200,
      message: "Item deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error deleting post:', error);
    return res.status(500).json({
      status: 500,
      error: `Server error: ${error.message}`,
    });
  }
};

export default { fetchPosts, deletePost };
