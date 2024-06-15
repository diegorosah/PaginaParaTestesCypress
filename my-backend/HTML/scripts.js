document.addEventListener('DOMContentLoaded', function () {
    let saldoElement;
    // Código para a página de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('token', result.token);
                    window.location.href = 'main.html'; // Redirecionar para a página principal após o login
                } else {
                    alert('Login falhou: ' + result.message);
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao fazer login');
            }
        });
    }

    // Código para a página principal

    // Carrega o conteúdo da barra lateral e cabeçalho
    $('#sidebar').load('sidebar.html', async function () {
        const extratoLink = document.getElementById('extrato');
        if (extratoLink) {
            extratoLink.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'extrato.html'; // Redireciona para a página de extrato
            });
        }
    });

    // Carrega os dados do extrato quando o link de extrato for clicado
    $(document).ready(async function () {
        // Carregar extrato quando a página estiver pronta
        const extratoList = document.getElementById('extratoList');
        if (!extratoList) {
            console.error('Elemento extratoList não encontrado');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token de autenticação não encontrado');
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('/api/account/extrato', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar extrato');
            }

            const data = await response.json();
            if (data.success) {
                data.extrato.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${new Date(item.data).toLocaleDateString()}</td>
                        <td>${item.descricao}</td>
                        <td>${item.valor < 0 ? '- R$ ' + (-item.valor).toFixed(2) : 'R$ ' + item.valor.toFixed(2)}</td>
                    `;
                    extratoList.appendChild(tr);
                });
            } else {
                alert('Erro ao buscar extrato: ' + data.message);
            }
        } catch (error) {
            console.error('Erro ao buscar extrato:', error);
            alert('Erro ao buscar extrato. Verifique a conexão com o servidor e tente novamente.');
        }
    });

    $('#pagamentos').load('pagamentos.html', function () {
        // Evento de clique para o botão "Agendar Pagamento"
        const agendarPagamentoBtn = document.getElementById('agendarPagamentoBtn');
        if (agendarPagamentoBtn) {
            agendarPagamentoBtn.addEventListener('click', agendarPagamento);
        }

        // Função para agendar um pagamento
        function agendarPagamento() {
            // Coletar os dados do formulário
            const descricao = document.getElementById('descricao').value;
            const valor = document.getElementById('valor').value;
            const vencimento = document.getElementById('vencimento').value;

            // Obter o token de autenticação do localStorage
            const token = localStorage.getItem('token');

            // Verificar se o token existe
            if (!token) {
                console.error('Token de autenticação não encontrado');
                return;
            }

            // Enviar os dados para a API via fetch com o token de autenticação
            fetch('/api/pagamentos/pagamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token // Adicionar o token ao cabeçalho da requisição
                },
                body: JSON.stringify({ descricao, valor, vencimento })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao agendar pagamento');
                    }
                    return response.json();
                })
                .then(data => {
                    // Fechar o modal
                    $('#agendarPagamentoModal').modal('hide');
                    // Recarregar a página para atualizar a lista de pagamentos
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Erro ao agendar pagamento:', error);
                    alert('Erro ao agendar pagamento. Por favor, tente novamente.');
                });
        }

        // Buscar os pagamentos da API e renderizar na página
        // Capturar o token de autenticação do localStorage
        const token = localStorage.getItem('token');

        // Verificar se o token existe
        if (!token) {
            console.error('Token de autenticação não encontrado');
        } else {
            // Realizar a requisição somente se o token existir
            fetch('/api/pagamentos/pagamentos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token // Adicionar o token ao cabeçalho da requisição
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar pagamentos');
                    }
                    return response.json();
                })
                .then(data => {
                    const pagamentosList = document.getElementById('pagamentosList');

                    // Limpar a lista de pagamentos
                    pagamentosList.innerHTML = '';

                    // Adicionar cada pagamento à lista
                    data.pagamentos.forEach(pagamento => {
                        const li = document.createElement('li');
                        li.className = `list-group-item ${pagamento.pago ? 'bg-success' : (new Date(pagamento.vencimento) < Date.now() ? 'bg-danger' : '')}`;
                        li.innerHTML = `
                ${pagamento.descricao} - R$ ${pagamento.valor.toFixed(2)} (Vencimento: ${formatDate(pagamento.vencimento)})
                ${!pagamento.pago ? `<button class="btn btn-custom mr-2" onclick="pagar('${pagamento._id}')">Pagar</button>` : ''}
            `;
                        pagamentosList.appendChild(li);
                    });
                })
                .catch(error => console.error('Erro ao buscar pagamentos:', error));
        }

        function formatDate(date) {
            // Implemente a lógica de formatação da data aqui
            return new Date(date).toLocaleDateString(); // Exemplo simples de formatação para data
        }

        window.pagar = function (id, valor) {
            $('#confirmarPagamentoModal').modal('show');
            document.getElementById('confirmarPagamentoBtn').onclick = function () {
                confirmarPagamento(id, valor);
            };
        };

        function confirmarPagamento(id) {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token de autenticação não encontrado');
                return;
            }

            fetch(`/api/pagamentos/pagamentos/${id}/pagar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(error => {
                            throw new Error(error.message);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    $('#confirmarPagamentoModal').modal('hide');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Erro ao realizar pagamento:', error);
                    alert('Erro ao realizar pagamento. Por favor, tente novamente.');
                });
        }

    });

    $('#header').load('header.html', function () {
        // Após o carregamento do cabeçalho, busca o elemento saldo e atualiza
        saldoElement = document.querySelector('#saldo');
        if (saldoElement) {
            fetchSaldo(); // Chama a função para atualizar o saldo
            const toggleBalanceBtn = document.getElementById('toggleBalanceBtn');
            if (toggleBalanceBtn) {
                toggleBalanceBtn.addEventListener('click', function () {
                    const balance = document.querySelector('#saldo');
                    const btnIcon = document.querySelector('.account-info button i');

                    if (!balance) {
                        console.error('Elemento saldo não encontrado');
                        return;
                    }

                    if (balance.style.display === 'none') {
                        balance.style.display = 'block';
                        btnIcon.classList.remove('fa-eye');
                        btnIcon.classList.add('fa-eye-slash');
                        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                    } else {
                        balance.style.display = 'none';
                        btnIcon.classList.remove('fa-eye-slash');
                        btnIcon.classList.add('fa-eye');
                        this.innerHTML = '<i class="fas fa-eye"></i>';
                    }
                });
            }
        } else {
            console.error('Elemento saldo não encontrado');
        }
    });

    // Função para atualizar o saldo
    async function fetchSaldo() {
        try {
            const response = await fetch(`http://localhost:3000/api/account/saldo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            const result = await response.json();
            if (result.success) {
                saldoElement.textContent = `R$ ${result.saldo.toFixed(2)}`;
            } else {
                console.error('Erro ao obter saldo:', result.message);
                alert('Erro ao obter saldo: ' + result.message);
            }
        } catch (error) {
            console.error('Erro ao obter saldo:', error);
            alert('Erro ao obter saldo. Verifique a conexão com a internet e tente novamente.');
        }
    }

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


    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }

});
