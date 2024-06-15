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
    });

    // Atualiza a variável para indicar que o sidebar já foi carregado
    sidebarCarregado = true;
}
