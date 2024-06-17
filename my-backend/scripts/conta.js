let saldoElement; // Definindo saldoElement fora do escopo da função load

// Função para buscar o saldo atualizado
function atualizarSaldo() {
    // Busca o elemento saldo
    saldoElement = document.querySelector('#saldo');
    if (saldoElement) {
        // Requisição para obter o saldo atualizado
        fetch('/api/account/saldo', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter saldo: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                saldoElement.textContent = `R$ ${data.saldo.toFixed(2)}`;
            })
            .catch(error => {
                console.error('Erro ao obter saldo:', error);
                alert('Erro ao obter saldo. Verifique a conexão com o servidor e tente novamente.');
            });
    } else {
        console.error('Elemento de saldo não encontrado.');
    }
}

$(document).ready(function () {
    // Carrega o cabeçalho e busca o elemento saldo
    $('#header').load('header.html', atualizarSaldo);
});

$('#conta').load('conta.html', function () {
    // Adicionando os listeners após o carregamento completo da página
    const addSaldoBtn = document.getElementById('addSaldoBtn');
    if (addSaldoBtn) {
        addSaldoBtn.addEventListener('click', async function () {
            const valor = parseFloat(document.getElementById('valorDeposito').value);
            if (isNaN(valor) || valor <= 0) {
                alert('Por favor, insira um valor válido para depósito.');
                return;
            }

            try {
                const response = await fetch('/api/account/add-saldo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ valor })
                });

                if (!response.ok) {
                    throw new Error('Erro ao adicionar saldo: ' + response.statusText);
                }

                const result = await response.json();
                if (result.success) {
                    // Verifica se saldoElement está definido e não é nulo
                    if (saldoElement) {
                        saldoElement.textContent = `R$ ${(parseFloat(saldoElement.textContent.replace('R$', '').replace(',', '.')) + valor).toFixed(2)}`;
                    } else {
                        console.error('Elemento de saldo não encontrado.');
                    }
                    alert('Saldo adicionado com sucesso!');
                } else {
                    alert('Erro ao adicionar saldo: ' + result.message);
                }
            } catch (error) {
                console.error('Erro ao adicionar saldo:', error);
                alert('Erro ao adicionar saldo. Verifique a conexão com o servidor e tente novamente.');
            }
        });
    }

    const cobrarContaBtn = document.getElementById('cobrarContaBtn');
    if (cobrarContaBtn) {
        cobrarContaBtn.addEventListener('click', async function () {
            const valor = parseFloat(document.getElementById('valorCobranca').value);
            const descricao = document.getElementById('descCobranca').value.trim();
            if (isNaN(valor) || valor <= 0 || descricao === '') {
                alert('Por favor, insira um valor e uma descrição válidos para a cobrança.');
                return;
            }

            try {
                const response = await fetch('/api/account/cobrar-conta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ valor, descricao })
                });

                if (!response.ok) {
                    throw new Error('Erro ao cobrar conta: ' + response.statusText);
                }

                const result = await response.json();
                if (result.success) {
                    // Atualiza o saldo na tela
                    if (saldoElement) {
                        saldoElement.textContent = `R$ ${(parseFloat(saldoElement.textContent.replace('R$', '').replace(',', '.')) - valor).toFixed(2)}`;
                    }
                    alert('Conta cobrada com sucesso!');
                } else {
                    alert('Erro ao cobrar conta: ' + result.message);
                }
            } catch (error) {
                console.error('Erro ao cobrar conta:', error);
                alert('Erro ao cobrar conta. Verifique a conexão com o servidor e tente novamente.');
            }
        });
    }
});

// Chama a função para buscar o saldo assim que o documento estiver pronto
$(document).ready(atualizarSaldo);
