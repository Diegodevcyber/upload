const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const path = require('path'); // Adicionado para lidar com caminhos

const app = express();
app.use(cors());

// Serve os arquivos estáticos (seu index.html)
app.use(express.static(path.join(__code, './')));

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

// Rota principal: Agora ela vai carregar o seu index.html em vez de apenas texto
app.get('/', (req, res) => {
  res.sendFile(path.join(__code, 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  res.json({ url: req.file.path });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));