const express = require('express');
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const statRoutes = require('./routes/statRoutes');
const orderRoutes = require('./routes/orderRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const { ensureBucket, minioClient } = require('./utils/minio');
const { getImageInfo } = require('./services/minioService');
const { initSocket } = require('./utils/socket');


const app = express();
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3000;
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60,
    }, // 1 hour
  })
);

(async () => {
    await ensureBucket(process.env.MINIO_BUCKET || 'images');
})();


app.use(errorHandler)
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/statistics', statRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/staffs', userRoutes);
app.get('/images/:filename', async (req, res) => {
    const filename = req.params.filename;
    const bucketName = process.env.MINIO_BUCKET || 'images';

    try {
        // Get image info first
        const imageInfo = await getImageInfo(filename);
        if (!imageInfo) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Conditional request
        const clientETag = req.headers['if-none-match'];
        if (clientETag && clientETag === imageInfo.etag) {
            return res.status(304).end();
        }

        // Set headers
        res.setHeader('Content-Type', imageInfo.metaData['content-type'] || 'application/octet-stream');
        res.setHeader('Content-Length', imageInfo.size);
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
        res.setHeader('ETag', imageInfo.etag);

        // Get the object as a stream (callback style for older SDKs)
        minioClient.getObject(bucketName, filename, (err, dataStream) => {
            if (err) {
                console.error('MinIO getObject error:', err);
                return res.status(404).json({ error: 'Image not found' });
            }

            dataStream.on('error', (streamErr) => {
                console.error('Stream error:', streamErr);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error streaming image' });
                }
            });

            dataStream.pipe(res);
        });
    } catch (err) {
        console.error('Error serving image:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
