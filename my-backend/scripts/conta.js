$('#conta').load('conta.html', function () {
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
                    alert('Saldo adicionado com sucesso!');
                    saldoElement.textContent = `R$ ${(parseFloat(saldoElement.textContent.replace('R$', '').replace(',', '.')) + valor).toFixed(2)}`;
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
                    const saldoElement = document.querySelector('#saldo');
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
})
