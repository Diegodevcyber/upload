// script.js

const form = document.getElementById('uploadForm');
const statusDiv = document.getElementById('status');
const arquivoInput = document.getElementById('arquivoInput');

// Adiciona um listener para o evento de envio do formulário
form.addEventListener('submit', function(e) {
    
    // Verifica se um arquivo foi selecionado
    if (!arquivoInput.files.length) {
        statusDiv.innerHTML = '<span style="color: red;">⚠️ Por favor, selecione um arquivo.</span>';
        e.preventDefault(); // Impede o envio se não houver arquivo
        return;
    }

    // Altera o status para informar o usuário que o envio começou
    // O envio real acontece agora, e o Netlify irá redirecionar após o sucesso.
    statusDiv.innerHTML = '⌛ **Enviando... Não feche a página!**';
    
    // O Netlify irá agora processar o formulário. 
    // Após o sucesso, ele redirecionará o usuário para a página definida no atributo 'action' (no nosso caso, "/success").
});

// Opcional: Atualiza o status quando um arquivo é escolhido
arquivoInput.addEventListener('change', function() {
    if (this.files.length) {
        statusDiv.innerHTML = `**Arquivo selecionado:** ${this.files[0].name}`;
    } else {
        statusDiv.innerHTML = 'Aguardando seleção de arquivo...';
    }
});