import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import getPresignedUrl from "../helper/presignedUrl.js";
import GalleryModel from "../model/GalleryModel.js";
import GalleryMetaModel from "../model/GalleryMetaModel.js";
import s3Client from "../../../config/s3Config.js";
import db from "../../../config/db.js";
import redis from "redis";

// Redis client creation
const client = redis.createClient();

client.on('error', (err) => {
  console.log('Redis Client Error', err);
});

// Connect to Redis (Ensure this connection happens before using the client)
(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Could not connect to Redis:", err);
  }
})();

const bucketName = process.env.BUCKET_NAME;

const fetchPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Generate a unique cache key based on pagination parameters
    const cacheKey = `posts:page:${page}:limit:${limit}`;

    // Check if posts are in the Redis cache
    const cachedPosts = await client.get(cacheKey);
    if (cachedPosts) {
      // Parse the cached posts
      const cachedData = JSON.parse(cachedPosts);
      return res.status(200).json({
        status: 200,
        data: cachedData,
        source: "cache", // Indicate that the response is from the cache
      });
    }

    // Fetch paginated data from the database
    const { rows: data, count: totalItems } = await GalleryModel.findAndCountAll({
      include: [{ model: GalleryMetaModel, as: "meta" }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    // Generate presigned URLs for each image
    const updatedData = await Promise.all(
      data.map(async (item) => {
        const presignedUrl = await getPresignedUrl(process.env.BUCKET_NAME, item.s3_key);
        return {
          ...item.toJSON(),
          presignedUrl,
        };
      })
    );

    // Cache the updated data for 24 hours using set with EX option
    await client.set(cacheKey, JSON.stringify(updatedData), { EX: 86400 }); // 86400 seconds = 24 hours

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

    // Delete the file from S3
    if (fileKey) {
      const params = {
        Bucket: bucketName,
        Key: fileKey,
      };

      const deleteCommand = new DeleteObjectCommand(params);
      await s3Client.send(deleteCommand);
    }

    // Delete the item from the database
    await GalleryModel.destroy({ where: { id }, transaction });
    
    // Invalidate the cache for this item
    const cacheKeyPattern = `posts:*`; // Invalidate all post caches
    const keys = await client.keys(cacheKeyPattern);
    for (const key of keys) {
      await client.del(key);
    }

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

export default { fetchPosts, deletePost };
