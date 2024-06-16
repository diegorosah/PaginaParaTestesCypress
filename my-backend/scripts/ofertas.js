$('#ofertas').load('ofertas.html', function () {
    $(document).ready(function () {
        const token = localStorage.getItem('token');
        carregarOfertas(token); // Chamando a função para carregar as ofertas
    });
});

// Função para abrir o modal
function abrirModalSimulacao(index) {
    console.log('Abrindo modal para oferta', index);
    $('#confirmModal').modal('show');
    $('#confirmSimulation').off('click').on('click', function () {
        console.log('Confirmação de simulação clicada');
        $('#confirmModal').modal('hide');
        window.location.href = `simular-oferta.html?index=${index}`;
    });
}


function carregarOfertas(token) {
    $.ajax({
        url: '/api/oferta/ofertas',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            $('#ofertas-carousel').empty();

            if (data.success) {
                if (data.ofertas && data.ofertas.length > 0) {
                    data.ofertas.forEach(function (oferta, index) {
                        var ofertaHTML = `
                            <div class="card">
                                <div class="card-body"> 
                                    <h5 class="card-title">OFERTA</h5>
                                    <label><label class="card-text-strong">Tipo de Produto:</label> <label class="card-text">${oferta.tipoProduto}</label></label>
                                    <label><label class="card-text-strong">Valor Mínimo de Entrada: </label> <label class="card-text"> R$ ${oferta.valorMinimoEntrada.toFixed(2)}</label></label>
                                    <label><label class="card-text-strong">Valor Total Permitido: </label> <label class="card-text"> R$ ${oferta.valorTotalPermitido.toFixed(2)}</label></label>
                                    <label><label class="card-text-strong">Quantidade de Parcelas: </label> <label class="card-text"> ${oferta.qtdParcelas}</label></label>
                                    <label><label class="card-text-strong">Valor da Parcela: </label> <label class="card-text">R$ ${oferta.valorParcela.toFixed(2)}</label></label>
                                    <label><label class="card-text-strong">Taxa de Juros: </label> <label class="card-text"> ${oferta.txJuros}%</label></label>
                                </div>
                                <div class="card-button-container">
                                    <button class="btn-custom abrir-modal" data-index="${index}">Ver oferta</button>
                                </div>
                            </div>`;
                        $('#ofertas-carousel').append(ofertaHTML);
                    });

                    // Adicionando evento de clique aos botões "Ver oferta"
                    $('.abrir-modal').on('click', function () {
                        var index = $(this).data('index');
                        abrirModalSimulacao(index);
                    });

                    // Inicializar o slick carousel após adicionar os elementos
                    $('#ofertas-carousel').slick({
                        slidesToShow: 3,
                        arrows: true,
                        focusOnSelect: true,
                        pauseOnFocus: true,
                        Infinity: false,
                        slidesToScroll: 1,
                        autoplay: false,
                    });
                } else {
                    $('#ofertas-carousel').html('<p>Sem ofertas disponíveis.</p>');
                }
            } else {
                console.error('Erro ao buscar ofertas:', data.message);
            }
        },
        error: function (xhr, status, error) {
            console.error('Erro ao buscar ofertas:', error);
        }
    });
}
