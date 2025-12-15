// script.js

const form = document.getElementById('uploadForm');
const statusDiv = document.getElementById('status');
const arquivoInput = document.getElementById('arquivoInput');

// 1. Feedback ao selecionar o arquivo
arquivoInput.addEventListener('change', function() {
    if (this.files.length) {
        statusDiv.innerHTML = `**Arquivo selecionado:** ${this.files[0].name}`;
    } else {
        statusDiv.innerHTML = 'Aguardando seleção de arquivo...';
    }
});

// 2. Feedback ao iniciar o envio
form.addEventListener('submit', function(e) {
    
    // Verifica se há um arquivo para upload
    if (!arquivoInput.files.length) {
        statusDiv.innerHTML = '<span style="color: red;">⚠️ Por favor, selecione um arquivo.</span>';
        e.preventDefault(); 
        return;
    }

    // Altera o status ANTES do envio real para dar feedback
    statusDiv.innerHTML = '⌛ **Enviando... Não feche a página!**';
    
    // O navegador continuará o processo de envio POST, 
    // e o Netlify Forms cuidará do resto e do redirecionamento para /success.
});