const Minio = require('minio');

// Create MinIO client
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'minio',
    port: parseInt(process.env.MINIO_PORT, 10) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});

// Ensure bucket exists
async function ensureBucket(bucketName) {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`MinIO bucket "${bucketName}" created.`);
        } else {
            console.log(`MinIO bucket "${bucketName}" already exists.`);
        }
    } catch (err) {
        console.error('Error ensuring MinIO bucket:', err);
        throw new Error(`Failed to ensure bucket: ${err.message}`);
    }
}

module.exports = { minioClient, ensureBucket };
