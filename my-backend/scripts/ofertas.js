$('#ofertas').load('ofertas.html', function () {
    $(document).ready(function () {
        const token = localStorage.getItem('token');
        calcularOferta(token); // Chamando a função para calcular a oferta
    });
});

// Função para abrir o modal
function abrirModalSimulacao(index) {
    $('#confirmModal').modal('show');
    $('#confirmSimulation').off('click').on('click', function () {
        $('#confirmModal').modal('hide');
        window.location.href = `simular-oferta.html?index=${index}`;
    });
}
function calcularOferta(token, tipoProduto) {
    console.log('Calculando oferta...');
    $.ajax({
        url: '/api/oferta/calcular-oferta',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'tipoProduto': tipoProduto
        },
        success: function (data) {
            console.log('Oferta calculada com sucesso');
            carregarOfertas(token);
        },
        error: function (xhr, status, error) {
            console.error('Erro ao calcular oferta:', error);
        }
    });
}

function carregarOfertas(token) {
    console.log('Carregando ofertas...');
    $.ajax({
        url: '/api/oferta/ofertas',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            console.log('Resposta da API:', data);
            $('#ofertas-carousel').empty();

            if (data.success) {
                if (data.ofertas && data.ofertas.length > 0) {
                    console.log('Oferta(s) disponível(eis):', data.ofertas);
                    data.ofertas.forEach(function (oferta, index) {
                        var ofertaHTML = `
                        <card class="card" data-index="${index}">
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
                                    <button class="btn-custom">Ver oferta</button>
                                </div>
                        </card>`;
                        $('#ofertas-carousel').append(ofertaHTML);
                    });

                    $('.card').addClass('carousel-item');

                    $('#ofertas-carousel').slick({
                        slidesToShow: 3,
                        arrows: true,
                        focusOnSelect: true,
                        pauseOnFocus: true,
                        Infinity: false,
                        slidesToScroll: 1,
                        autoplay: false,
                    });

                    $('#ofertas-carousel').append('<button id="previous" class="btn-custom-slick"><</button>');
                    $('#ofertas-carousel').append('<button id="next" class="btn-custom-slick">></button>');

                    $('#ofertas-carousel').on('afterChange', function (event, slick, currentSlide, nextSlide) {
                        $('#previous').toggle(currentSlide !== 0);
                        $('#next').toggle(currentSlide !== slick.slideCount - 1);
                    });

                    $('#previous').toggle(false);

                    $('#previous').on('click', function () {
                        $('#ofertas-carousel').slick('slickPrev');
                    });

                    $('#next').on('click', function () {
                        $('#ofertas-carousel').slick('slickNext');
                    });

                    $('.card').on('click', function (e) {
                        e.stopPropagation();
                        $('.card').removeClass('selected');
                        $(this).addClass('selected');
                        $('#ofertas-carousel').slick('slickPause');
                    });
                } else {
                    console.log('Nenhuma oferta disponível.');
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
