$('#dividas').load('dividas.html', function () {
    // Vincula o evento de submissão após o carregamento do HTML
    $('#dividaForm').submit(async function (event) {
        event.preventDefault();

        // Obtém o token de autenticação do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            alert('Faça login para continuar');
            return;
        }

        const formData = $(this).serialize();

        try {
            const response = await fetch('/api/divida/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + token // Inclui o token de autenticação
                },
                body: formData
            });
            if (!response.ok) {
                throw new Error('Erro ao inserir dívida: ' + response.statusText);
            }
            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error('Erro ao inserir dívida:', error);
            alert('Erro ao inserir dívida');
        }
    });
});