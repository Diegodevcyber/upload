const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');

const app = express();
app.use(cors());

// Configuração usando as Variáveis de Ambiente do Render
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads_cyber',
    resource_type: 'auto' // Aceita PDF e Imagens
  },
});

const upload = multer({ storage: storage });

// Rota que recebe o arquivo do seu HTML
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  // Retorna o link seguro gerado pelo Cloudinary
  res.json({ url: req.file.path });
});

// Rota de teste
app.get('/', (req, res) => res.send('Servidor de Upload Online! ✅'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));