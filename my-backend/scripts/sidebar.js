// Se a variável sidebarCarregado ainda não foi definida, então define como false
if (typeof sidebarCarregado === 'undefined') {
    var sidebarCarregado = false;
}

// Carrega o conteúdo da barra lateral
if (!sidebarCarregado) {
    $('#sidebar').load('../sidebar.html', async function () {
        const extratoLink = document.getElementById('extrato');
        if (extratoLink) {
            extratoLink.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'extrato.html'; // Redireciona para a página de extrato
            });
        }

        // Adiciona o evento de logout ao botão #logoutBtn
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                logout();
            });
        }
    });

    // Atualiza a variável para indicar que o sidebar já foi carregado
    sidebarCarregado = true;
}

// Função de logout
function logout() {
    // Aqui você pode adicionar o código para realizar o logout, como limpar o token de autenticação
    localStorage.removeItem('token'); // Exemplo de remoção de um token de autenticação do localStorage

    // Redireciona para a página de login
    window.location.href = 'login.html';
}
