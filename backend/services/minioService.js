const { minioClient, ensureBucket } = require('../utils/minio');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function uploadImage(fileBuffer, originalName, mimeType) {
    const bucketName = process.env.MINIO_BUCKET || 'images';
    await ensureBucket(bucketName);

    const extension = path.extname(originalName);
    const fileName = `${uuidv4()}${extension}`;

    const metaData = {
        'Content-Type': mimeType,
        'Content-Length': fileBuffer.length
    };

    await minioClient.putObject(bucketName, fileName, fileBuffer, metaData);

    // Return your server's URL instead of MinIO's direct URL
    return {
        filename: fileName,
        url: `/images/${fileName}`,
        size: fileBuffer.length,
        mimeType
    };
}

async function deleteImage(filename) {
    const bucketName = process.env.MINIO_BUCKET || 'images';
    try {
        await minioClient.removeObject(bucketName, filename);
        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}

async function getImageInfo(filename) {
    const bucketName = process.env.MINIO_BUCKET || 'images';
    try {
        const stat = await minioClient.statObject(bucketName, filename);
        return stat;
    } catch (error) {
        console.error('Error getting image info:', error);
        return null;
    }
}

module.exports = { uploadImage, deleteImage, getImageInfo };
