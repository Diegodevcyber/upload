// api/upload.js

import admin from 'firebase-admin';
import multer from 'multer';
import { promisify } from 'util';
import path from 'path';

// --- 1. Inicializa o Firebase Admin SDK ---

// Use a variável de ambiente VERCEL_FIREBASE_SERVICE_ACCOUNT
// (Que contém o JSON da sua Service Account key, veja as instruções abaixo)
const serviceAccountKey = JSON.parse(process.env.VERCEL_FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        // SUBSTITUA pelo URL do seu bucket do Firebase Storage (ex: 'gs://nome-do-seu-projeto.appspot.com')
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET_URL 
    });
}

const bucket = admin.storage().bucket();

// --- 2. Configuração do Multer (Middleware para processar arquivos) ---

// Multer armazena o arquivo em buffer, ideal para Serverless Functions
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ 
    storage: storage,
    // Limite de 5MB por arquivo (você pode ajustar)
    limits: { fileSize: 5 * 1024 * 1024 } 
}).single('uploadedFile'); // 'uploadedFile' deve coincidir com o .append('uploadedFile', arquivo) do frontend

const upload = promisify(uploadMiddleware);

// --- 3. Função Handler Principal do Vercel ---

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).send('Método não permitido');
    }

    try {
        // Processa o upload do arquivo usando o Multer
        await upload(request, response);

        const file = request.file;

        if (!file) {
            return response.status(400).json({ message: 'Nenhum arquivo enviado.' });
        }

        // --- 4. Upload para o Firebase Storage ---

        const timestamp = Date.now();
        const originalName = path.parse(file.originalname).name;
        const fileExtension = path.extname(file.originalname);
        
        // Define o caminho no Storage: uploads/nome_timestamp.extensao
        const filePath = `uploads/${originalName}-${timestamp}${fileExtension}`;
        const fileUpload = bucket.file(filePath);

        // Cria um stream para o upload
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        // Lida com erros durante o stream
        blobStream.on('error', (error) => {
            console.error('Erro no upload do Firebase:', error);
            response.status(500).json({ message: 'Falha ao salvar o arquivo no Storage.' });
        });

        // Lida com o sucesso do stream
        blobStream.on('finish', async () => {
            // Torna o arquivo publicamente acessível para o link
            await fileUpload.makePublic(); 
            
            // Retorna o link direto
            const publicUrl = fileUpload.publicUrl();

            response.status(200).json({ 
                message: 'Upload realizado com sucesso!', 
                url: publicUrl 
            });
        });

        // Finaliza o stream e envia o buffer do arquivo
        blobStream.end(file.buffer);

    } catch (error) {
        if (error.code === 'LIMIT_FILE_SIZE') {
             return response.status(413).json({ message: 'O arquivo é muito grande (Máximo 5MB).'});
        }
        console.error('Erro de Servidor:', error);
        response.status(500).json({ message: `Erro interno no servidor: ${error.message}` });
    }
}

// Para usar o Multer em Serverless Functions, você deve desativar o body-parser padrão do Vercel/Next.js.
export const config = {
    api: {
        bodyParser: false,
    },
};