let saldoElement;

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