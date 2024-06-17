$(document).ready(function () {
    $('#ofertas').load('ofertas.html', function () {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            alert('Faça login para continuar');
            return;
        }
        recalcularOfertas(token); // Recalcular ofertas antes de carregar
    });
});

// Função para recalcular as ofertas
function recalcularOfertas(token) {
    $.ajax({
        url: '/api/oferta/calcular-oferta',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (data) {
            if (data.success) {
                carregarOfertas(token); // Carregar as ofertas após recalcular
            } else {
                console.error('Erro ao recalcular ofertas:', data.message);
                alert('Erro ao recalcular ofertas');
            }
        },
        error: function (xhr, status, error) {
            console.error('Erro ao recalcular ofertas:', error);
            alert('Erro ao recalcular ofertas');
        }
    });
}

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
                        // Limitar o número de caracteres para os textos
                        var tipoProduto = oferta.tipoProduto.length > 20 ? oferta.tipoProduto.substring(0, 20) + '...' : oferta.tipoProduto;
                        var ofertaHTML = `
                            <div class="card">
                                <div class="card-body"> 
                                    <h5 class="card-title">OFERTA</h5>
                                    <p class="card-text"><span class="card-text-strong">Tipo de Produto:</span> ${tipoProduto}</p>
                                    <p class="card-text"><span class="card-text-strong">Valor Mínimo de Entrada:</span> R$ ${oferta.valorMinimoEntrada.toFixed(2)}</p>
                                    <p class="card-text"><span class="card-text-strong">Valor Total Permitido:</span> R$ ${oferta.valorTotalPermitido.toFixed(2)}</p>
                                    <p class="card-text"><span class="card-text-strong">Quantidade de Parcelas:</span> ${oferta.qtdParcelas}</p>
                                    <p class="card-text"><span class="card-text-strong">Valor da Parcela:</span> R$ ${oferta.valorParcela.toFixed(2)}</p>
                                    <p class="card-text"><span class="card-text-strong">Taxa de Juros:</span> ${oferta.txJuros}%</p>
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
                        infinite: false,
                        slidesToScroll: 1,
                        autoplay: false,
                        responsive: [
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 2
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 1
                                }
                            }
                        ]
                    });

                    // Adicionar botões customizados "Anterior" e "Próximo"
                    $('#ofertas-carousel').append('<button id="previous" class="btn-custom-slick"><</button>');
                    $('#ofertas-carousel').append('<button id="next" class="btn-custom-slick">></button>');

                    // Gerenciar a visibilidade dos botões "Anterior" e "Próximo"
                    $('#ofertas-carousel').on('afterChange', function (event, slick, currentSlide) {
                        $('#previous').toggle(currentSlide !== 0);
                        $('#next').toggle(currentSlide + slick.options.slidesToShow < slick.slideCount);
                    });

                    $('#previous').toggle(false); // Esconder o botão "Anterior" inicialmente

                    $('#previous').on('click', function () {
                        $('#ofertas-carousel').slick('slickPrev');
                    });

                    $('#next').on('click', function () {
                        $('#ofertas-carousel').slick('slickNext');
                    });
                } else {
                    $('#ofertas-carousel').html('<p>Sem ofertas disponíveis.</p>');
                }
            } else {
                console.error('Erro ao buscar ofertas:', data.message);
                alert('Erro ao buscar ofertas');
            }
        },
        error: function (xhr, status, error) {
            console.error('Erro ao buscar ofertas:', error);
            alert('Erro ao buscar ofertas');
        }
    });
}

// Recalcular o número de slides ao redimensionar a janela
$(window).on('resize', function () {
    var slidesToShow = 3;
    if ($(window).width() < 768) {
        slidesToShow = 1;
    } else if ($(window).width() < 992) {
        slidesToShow = 2;
    }

    $('#ofertas-carousel').slick('slickSetOption', 'slidesToShow', slidesToShow, true);
});
