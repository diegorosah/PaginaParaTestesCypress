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