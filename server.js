const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. Habilitar CORS para permitir que a Vercel envie dados
app.use(cors());

// Substitua a configuração do Cloudinary no seu server.js por esta:

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads_cyber',
    resource_type: 'auto'
  },
});

const upload = multer({ storage: storage });

// 3. ROTA DE UPLOAD - Deve vir ANTES de qualquer arquivo estático
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  console.log("Upload realizado com sucesso!");
  res.json({ url: req.file.path });
});

// 4. Servir arquivos estáticos (Só depois das rotas de API)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Altere apenas o final do seu server.js para isso:
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
