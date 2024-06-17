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
                    li.className = `list-group-item d-flex justify-content-between align-items-center ${pagamento.pago ? 'bg-success' : (new Date(pagamento.vencimento) < Date.now() ? 'bg-danger' : '')}`;

                    const isVencido = !pagamento.pago && new Date(pagamento.vencimento) < Date.now();

                    li.innerHTML = `
                        <div class="d-flex flex-column">
                            <span>${pagamento.descricao}</span>
                            <small>R$ ${pagamento.valor.toFixed(2)} (Vencimento: ${formatDate(pagamento.vencimento)})</small>
                        </div>
                        ${!pagamento.pago ? `<button class="btn ${isVencido ? 'btn-vencido' : 'btn-custom'} ml-3" onclick="pagar('${pagamento._id}')">Pagar</button>` : ''}
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
