const express = require('express');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cors = require('cors');

const app = express();

// 1. Aumentar o limite de leitura do Express para arquivos grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// 2. Configuração do Cloudinary (Usando seus dados confirmados)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmy2iazgs',
  api_key: process.env.CLOUDINARY_API_KEY || '989796475711838',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mrMV9-M7yXqBeEKreBNZbVorA9Y'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads_cyber',
    resource_type: 'auto', // Permite PDFs e imagens
  },
});

// 3. Configurar Multer com limite de 50MB
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } 
});

// 4. Rota de Upload
app.post('/upload', (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error("Erro no Cloudinary:", err);
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
    res.json({ url: req.file.path });
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});