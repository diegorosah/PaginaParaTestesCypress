// Certifique-se de que o jQuery está carregado corretamente antes de usar
$(document).ready(function () {
    const apiKey = 'D8QYQEK7RLTHPTFT'; // Sua chave de API

    // Função para carregar dados das ações selecionadas
    async function loadStockData(symbols) {
        try {
            const promises = symbols.map(symbol => fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`).then(res => res.json()));
            const results = await Promise.all(promises);

            results.forEach((data, index) => {
                const symbol = symbols[index];
                const timeSeries = data["Time Series (1min)"];
                const times = Object.keys(timeSeries).reverse(); // Reverter a ordem para cronológica
                const prices = times.map(time => timeSeries[time]["1. open"]);

                createChart(symbol, times, prices);
            });
        } catch (error) {
            console.error('Erro ao carregar dados das ações:', error);
        }
    }

    // Função para criar gráfico para uma ação
    function createChart(symbol, labels, data) {
        const ctx = $('<canvas>').attr('id', `chart-${symbol}`)[0];
        $('#chartsContainer').append(ctx);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Preço de ${symbol}`,
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        }
                    },
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }

    // Evento para carregar ações ao clicar no botão
    $('#loadStocks').click(async function () {
        const symbols = $('#stockSelector').val().split(',').map(s => s.trim().toUpperCase());
        $('#chartsContainer').empty(); // Limpa os gráficos anteriores
        await loadStockData(symbols);
    });

    // Evento para simular compra de ações
    $('#buyButton').click(function () {
        const amount = parseFloat($('#buyAmount').val());
        if (!isNaN(amount) && amount > 0) {
            alert(`Você comprou ações no valor de $${amount.toFixed(2)}`);
        } else {
            alert('Por favor, insira um valor válido.');
        }
    });

    // Função para verificar status do mercado
    async function checkMarketStatus() {
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=${apiKey}`);
            const data = await response.json();
            // Verifique se "Meta Data" e "3. Last Refreshed" estão definidos antes de acessá-los
            if (data && data["Meta Data"] && data["Meta Data"]["3. Last Refreshed"]) {
                const lastRefreshed = data["Meta Data"]["3. Last Refreshed"];
                const marketStatus = new Date().toISOString().split('T')[0] === lastRefreshed.split(' ')[0] ? 'Mercado Aberto' : 'Mercado Fechado';
                $('#marketStatus').text(marketStatus);
            } else {
                console.error('Dados inválidos recebidos:', data);
                $('#marketStatus').text('Status do mercado indisponível');
            }
        } catch (error) {
            console.error('Erro ao verificar status do mercado:', error);
            $('#marketStatus').text('Erro ao verificar status do mercado');
        }
    }


    // Verificar status do mercado ao carregar a página
    checkMarketStatus();
});
