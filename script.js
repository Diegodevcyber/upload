function processarUpload() {
    const inputElement = document.getElementById('arquivoInput');
    const statusDiv = document.getElementById('status');
    const arquivo = inputElement.files[0]; 
    
    if (!arquivo) {
        statusDiv.innerHTML = '<span style="color: red;">⚠️ Por favor, selecione um arquivo.</span>';
        return;
    }

    statusDiv.innerHTML = '⌛ **Enviando arquivo para o servidor...**';

    // Cria o objeto que enviará o arquivo
    const formData = new FormData();
    // 'uploadedFile' deve ser o nome que o seu backend espera
    formData.append('uploadedFile', arquivo); 

    // CHAMA O ENDPOINT DO BACKEND NO VERCEL
    fetch('/api/upload', {
        method: 'POST',
        body: formData // Envia o arquivo
    })
    .then(response => {
        // Verifica se a resposta do servidor foi 200 (OK)
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // O servidor respondeu com sucesso!
        statusDiv.innerHTML = `<span style="color: green;">✅ Sucesso! Arquivo Salvo Permanentemente.</span><br>
                               **URL do Arquivo:** ${data.url}`;
    })
    .catch(error => {
        // Ocorreu um erro (rede, ou erro 500 do servidor)
        statusDiv.innerHTML = `<span style="color: red;">❌ Erro ao Enviar:</span> ${error.message}`;
        console.error('Erro de Upload:', error);
    });
}