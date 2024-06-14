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
    const extratoLink = document.getElementById('extrato');
    if (extratoLink) {
        extratoLink.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'extrato.html'; // Redireciona para a página de extrato
        });
    }

    // Carrega o conteúdo da barra lateral e cabeçalho
    $('#sidebar').load('sidebar.html');
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
