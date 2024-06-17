// Verifica se o script já foi carregado para evitar duplicação
if (!window.headerLoaded) {
    window.headerLoaded = true; // Define uma flag para indicar que o script foi carregado

    let saldoElement;

    $('#header').load('header.html', function () {
        // Após o carregamento do cabeçalho, busca o elemento saldo e atualiza
        saldoElement = document.querySelector('#saldo');
        if (saldoElement) {
            fetchSaldo(); // Chama a função para atualizar o saldo

            const toggleBalanceBtn = document.getElementById('toggleBalanceBtn');
            if (toggleBalanceBtn) {
                toggleBalanceBtn.addEventListener('click', function () {
                    toggleBalance();
                });
            }

            // Busca o elemento do nome do cliente e atualiza com o nome do usuário
            const nomeUsuarioElement = document.querySelector('#nomeUsuario');
            if (nomeUsuarioElement) {
                fetchNomeUsuario(); // Chama a função para obter o nome do usuário
                nomeUsuarioElement.addEventListener('click', function () {
                    window.location.href = 'infoUsuario.html';
                });
            }
        } else {
            console.error('Elemento saldo não encontrado');
        }
    });
    // Função para atualizar o saldo
    async function fetchSaldo() {
        try {
            const response = await fetch(`/api/account/saldo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao obter saldo: ' + response.statusText);
            }

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

    // Função para buscar e exibir o nome do usuário
    async function fetchNomeUsuario() {
        try {
            const response = await fetch(`/api/cadastro/dados`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao obter dados do usuário: ' + response.statusText);
            }

            const result = await response.json();
            if (result.success && result.usuario) {
                const usuario = result.usuario;
                const nomeCompleto = `${usuario.nome} ${usuario.sobrenome || ''}`;
                document.querySelector('#nomeUsuario').textContent = nomeCompleto;
            } else {
                console.error('Erro ao obter nome do usuário:', result.message);
            }
        } catch (error) {
            console.error('Erro ao obter nome do usuário:', error);
        }
    }

    // Função para alternar a exibição do saldo
    function toggleBalance() {
        const btnIcon = document.querySelector('.account-info button i');

        if (!saldoElement) {
            console.error('Elemento saldo não encontrado');
            return;
        }

        if (saldoElement.style.display === 'none') {
            saldoElement.style.display = 'block';
            btnIcon.classList.remove('fa-eye');
            btnIcon.classList.add('fa-eye-slash');
        } else {
            saldoElement.style.display = 'none';
            btnIcon.classList.remove('fa-eye-slash');
            btnIcon.classList.add('fa-eye');
        }
    }
}
