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