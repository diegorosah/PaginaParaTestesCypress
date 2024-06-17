$(document).ready(function () {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Usuário não autenticado');
        return;
    }

    $.ajax({
        url: '/api/cadastro/dados',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            if (response.success && response.usuario) {
                const usuario = response.usuario;

                $('#usuario-tipoPessoa').text(usuario.tipoPessoa || 'Não disponível');
                $('#usuario-nome').text(usuario.nome || 'Não disponível');
                $('#usuario-dataNascimento').text(new Date(usuario.dataNascimento).toLocaleDateString() || 'Não disponível');
                $('#usuario-cpf').text(usuario.cpf || 'Não disponível');
                $('#usuario-cep').text(usuario.endereco.cep || 'Não disponível');
                $('#usuario-endereco').text(usuario.endereco.endereco || 'Não disponível');
                $('#usuario-numero').text(usuario.endereco.numero || 'Não disponível');
                $('#usuario-complemento').text(usuario.endereco.complemento || 'Não disponível');
                $('#usuario-cidade').text(usuario.endereco.cidade || 'Não disponível');
                $('#usuario-estado').text(usuario.endereco.estado || 'Não disponível');
                $('#usuario-pais').text(usuario.endereco.pais || 'Não disponível');
                $('#usuario-telefone').text(usuario.telefone || 'Não disponível');
                $('#usuario-email').text(usuario.email || 'Não disponível');
                $('#usuario-estadoCivil').text(usuario.estadoCivil || 'Não disponível');
                $('#usuario-nomeConjuge').text(usuario.nomeConjuge || 'Não disponível');
                $('#usuario-cpfConjuge').text(usuario.cpfConjuge || 'Não disponível');
                $('#usuario-ocupacao').text(usuario.ocupacao || 'Não disponível');
                $('#usuario-renda').text(usuario.renda || 'Não disponível');
                $('#usuario-escolaridade').text(usuario.escolaridade || 'Não disponível');
                $('#usuario-numeroConta').text(usuario.numeroConta || 'Não disponível');
                $('#usuario-preferenciasContato').text(usuario.preferenciasContato || 'Não disponível');

                // Preferências de Produtos
                $('#usuario-preferenciasProdutos').text(usuario.preferenciasProdutos ? usuario.preferenciasProdutos.join(', ') : 'Não disponível');
                $('#usuario-cnpj').text(usuario.preferenciasProdutos.cnpj || 'Não disponível');
                $('#usuario-nomeEmpresa').text(usuario.preferenciasProdutos.nomeEmpresa || 'Não disponível');
                $('#usuario-setorAtuacao').text(usuario.preferenciasProdutos.setorAtuacao || 'Não disponível');

            } else {
                $('#usuario-dados').html('<p>Dados do usuário não encontrados.</p>');
            }
        },
        error: function (xhr, status, error) {
            console.error('Erro ao obter dados do usuário:', error);
            $('#usuario-dados').html('<p>Erro ao obter dados do usuário.</p>');
        }
    });
});
