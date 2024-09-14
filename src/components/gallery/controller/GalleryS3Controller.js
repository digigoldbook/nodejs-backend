import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import getPresignedUrl from "../helper/presignedUrl.js";

import s3Client from "../../../config/s3Config.js";

const bucketName = process.env.BUCKET_NAME;

const listImages = async (req, res) => {
  try {
    const { perPage = 10, page = 1 } = req.query;

    const params = {
      Bucket: bucketName,
      MaxKeys: perPage,
      ContinuationToken: page > 1 ? req.query.token : undefined,
    };

    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);

    data.Contents.sort(
      (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
    );

    const items = await Promise.all(
      data.Contents.map(async (item) => {
        const url = await getPresignedUrl(bucketName, item.Key);
        return {
          Key: item.Key,
          URL: url,
          LastModified: item.LastModified,
        };
      })
    );

    return res.status(200).json({
      status: 200,
      data: items,
      pagination: {
        limit: parseInt(perPage, 10),
        page: parseInt(page, 10),
        isTruncated: data.IsTruncated,
        nextPageToken: data.NextContinuationToken,
      },
    });
  } catch (error) {
    return res.status(500).send(`Error listing objects: ${error.message}`);
  }
};

export default {listImages};
