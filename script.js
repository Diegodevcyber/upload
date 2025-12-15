// script.js

function processarUpload() {
    const inputElement = document.getElementById('arquivoInput');
    const statusDiv = document.getElementById('status');
    const arquivo = inputElement.files[0]; 
    
    if (!arquivo) {
        statusDiv.innerHTML = '<span style="color: red;">⚠️ Por favor, selecione um arquivo primeiro.</span>';
        return;
    }

    statusDiv.innerHTML = '⌛ **Iniciando o Upload para o Servidor...**';

    // Cria o objeto que enviará o arquivo
    const formData = new FormData();
    // O nome da chave 'uploadedFile' deve ser o mesmo usado no backend (api/upload.js)
    formData.append('uploadedFile', arquivo); 

    // CHAMA A SERVERLESS FUNCTION NO VERCEL
    fetch('/api/upload', {
        method: 'POST',
        body: formData // Envia o arquivo
    })
    .then(response => {
        // Verifica se a resposta do servidor foi 2xx
        if (!response.ok) {
            // Se o servidor retornar 400 ou 500, lança um erro
            return response.text().then(text => { 
                throw new Error(`Erro ${response.status}: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        // O servidor respondeu com sucesso!
        statusDiv.innerHTML = `<span style="color: lightgreen;">✅ Sucesso! Arquivo Salvo Permanentemente no Firebase!</span><br>
                               **Nome:** ${arquivo.name}<br>
                               **URL para Acesso:** <a href="${data.url}" target="_blank" style="color: #66b3ff;">Clique para Abrir</a>`;
    })
    .catch(error => {
        // Ocorreu um erro (rede, ou erro 400/500 do servidor)
        statusDiv.innerHTML = `<span style="color: red;">❌ Erro no Upload:</span><br>${error.message}`;
        console.error('Erro de Upload:', error);
    });
}