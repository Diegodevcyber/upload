const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path');

const app = express();

// Libera o acesso para o seu site na Vercel não ser bloqueado
app.use(cors());
app.use(express.static(__dirname));

// Configuração Cloudinary (Pegando das Environment Variables do Render)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads_cyber',
    resource_type: 'auto' // Permite PDF e Imagens
  },
});

const upload = multer({ storage: storage });

// Rota principal: Serve seu HTML se você abrir o link do Render
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de Upload: É para onde o site envia o arquivo
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  res.json({ url: req.file.path });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Necessário para a Vercel caso use como backend lá também
module.exports = app;