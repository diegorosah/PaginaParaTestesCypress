if (typeof sidebarCarregado === 'undefined') {
    var sidebarCarregado = false;
}

if (!sidebarCarregado) {
    $('#sidebar').load('../sidebar.html', function () {
        const extratoLink = document.getElementById('extrato');
        if (extratoLink) {
            extratoLink.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = 'extrato.html';
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                // Aqui você pode adicionar o código para realizar o logout, como limpar o token de autenticação
                localStorage.removeItem('token'); // Exemplo de remoção de um token de autenticação do localStorage
                window.location.href = 'login.html';
            });
        }
    });

    sidebarCarregado = true;
}
