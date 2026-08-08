require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const cloudConfigured =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET);

if (cloudConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    cloudinary: cloudConfigured,
  });
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }

    if (cloudConfigured) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'closet-matcher',
            resource_type: 'image',
            transformation: [{ width: 800, height: 800, crop: 'limit' }],
          },
          (error, uploaded) => {
            if (error) reject(error);
            else resolve(uploaded);
          }
        );
        stream.end(req.file.buffer);
      });

      return res.json({
        url: result.secure_url,
        publicId: result.public_id,
        provider: 'cloudinary',
      });
    }

    const base64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
    return res.json({
      url: dataUrl,
      publicId: null,
      provider: 'local',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

app.listen(PORT, () => {
  console.log(`Closet Matcher API en http://localhost:${PORT}`);
  console.log(
    cloudConfigured
      ? 'Cloudinary: activo'
      : 'Cloudinary: no configurado (fallback a data URL)'
  );
});
