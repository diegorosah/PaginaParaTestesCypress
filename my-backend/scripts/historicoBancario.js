$(document).ready(function () {
    $('#historicoBancario').load('historicoBancario.html', function () {

        // Vincula o evento de clique ao botão de inserção
        $('#inserirHistoricoBtn').click(async function () {

            // Obtém o token de autenticação do localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token de autenticação não encontrado');
                alert('Faça login para continuar');
                return;
            }

            // Obtém os valores dos campos
            const tipo = $('#tipo').val();
            const periodo = $('#periodo').val();
            const frequencia = $('#frequencia').val();
            const valor = $('#valor').val();
            const dataInicio = $('#dataInicio').val();

            // Monta o objeto com os dados
            const dados = {
                tipo: tipo,
                periodo: periodo,
                frequencia: frequencia,
                valor: valor,
                dataInicio: dataInicio
            };

            try {
                const response = await fetch('/api/historico/adicionar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token // Inclui o token de autenticação
                    },
                    body: JSON.stringify(dados)
                });

                if (!response.ok) {
                    throw new Error('Erro ao inserir histórico bancário: ' + response.statusText);
                }

                const result = await response.json();
                alert(result.message);
            } catch (error) {
                console.error('Erro ao inserir histórico bancário:', error);
                alert('Erro ao inserir histórico bancário');
            }
        });
    });
});
