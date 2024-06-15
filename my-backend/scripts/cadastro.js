$(document).ready(function () {
    $('#cep').on('blur', function () {
        const cep = $(this).val();
        if (cep) {
            // Chamada AJAX para buscar informações de endereço com base no CEP
            $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function (data) {
                if (!data.erro) {
                    $('#endereco').val(data.logradouro);
                    $('#cidade').val(data.localidade);
                    $('#estado').val(data.uf);
                    $('#pais').val('Brasil'); // Definindo o país como Brasil
                }
            });
        }
    });

    $('#estadoCivil').on('change', function () {
        const estadoCivil = $(this).val();
        if (estadoCivil === 'Casado') {
            $('#conjugeFields').show();
        } else {
            $('#conjugeFields').hide();
        }
    });

    $('#tipoPessoa').on('change', function () {
        const tipoPessoa = $(this).val();
        if (tipoPessoa === 'Juridica') {
            $('#juridicaFields').show();
        } else {
            $('#juridicaFields').hide();
        }
    });

    $('#cadastroForm').on('submit', function (e) {
        e.preventDefault();

        const formData = {
            tipoPessoa: $('#tipoPessoa').val(),
            nome: $('#nome').val(),
            dataNascimento: $('#dataNascimento').val(),
            cpf: $('#cpf').val(),
            endereco: {
                cep: $('#cep').val(),
                endereco: $('#endereco').val(),
                numero: $('#numero').val(),
                complemento: $('#complemento').val(),
                cidade: $('#cidade').val(),
                estado: $('#estado').val(),
                pais: $('#pais').val()
            },
            telefone: $('#telefone').val(),
            email: $('#email').val(),
            estadoCivil: $('#estadoCivil').val(),
            nomeConjuge: $('#nomeConjuge').val(),
            cpfConjuge: $('#cpfConjuge').val(),
            ocupacao: $('#ocupacao').val(),
            renda: $('#renda').val(),
            escolaridade: $('#escolaridade').val(),
            numeroConta: $('#numeroConta').val(),
            preferenciasContato: $('#preferenciasContato').val(),
            preferenciasProdutos: $('input[name="preferenciasProdutos"]:checked').map(function () {
                return this.value;
            }).get(),
            cnpj: $('#cnpj').val(),
            nomeEmpresa: $('#nomeEmpresa').val(),
            setorAtuacao: $('#setorAtuacao').val()
        };

        // Chamada AJAX para enviar os dados do formulário
        $.ajax({
            url: '/api/usuarios/cadastrar',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                alert(response.message);
            },
            error: function (response) {
                alert('Erro ao cadastrar dados do usuário. Por favor, tente novamente.');
            }
        });
    });

    // Função para buscar os dados do usuário e preencher o formulário
    function preencherDadosUsuario() {
        // Obter token de autenticação do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }

        // Fazer uma requisição AJAX para obter os dados do usuário
        $.ajax({
            url: '/api/usuarios/dados',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                const usuario = response.usuario;
                // Preencher os campos do formulário com os dados do usuário
                $('#nome').val(usuario.nome);
                $('#email').val(usuario.email);
                $('#cpf').val(usuario.cpf);
                $('#telefone').val(usuario.telefone);
                $('#endereco').val(usuario.endereco);
                $('#numero').val(usuario.numero);
                $('#complemento').val(usuario.complemento);
                $('#cidade').val(usuario.cidade);
                $('#estado').val(usuario.estado);
                $('#pais').val(usuario.pais);
                $('#cep').val(usuario.cep);
                $('#estadoCivil').val(usuario.estadoCivil);
                // Restante dos campos do formulário...

                // Se o estado civil for "Casado", mostrar os campos adicionais
                if (usuario.estadoCivil === 'Casado') {
                    $('#conjuge').show();
                    $('#cpfConjuge').show();
                }

                // Alterar o botão para "Atualizar"
                $('#cadastrarBtn').text('Atualizar');
                $('#cadastrarBtn').removeClass('btn-primary').addClass('btn-success');
                $('#cadastrarBtn').off('click').on('click', atualizarUsuario); // Adicionar evento de clique para atualizar
            },
            error: function (err) {
                console.error('Erro ao obter dados do usuário:', err);
            }
        });
    }

    // Chamar a função para preencher os dados do usuário ao carregar a página
    preencherDadosUsuario();

    // Função para atualizar os dados do usuário
    function atualizarUsuario() {
        // Obter os dados do formulário
        const dadosUsuario = {
            nome: $('#nome').val(),
            email: $('#email').val(),
            cpf: $('#cpf').val(),
            telefone: $('#telefone').val(),
            endereco: $('#endereco').val(),
            numero: $('#numero').val(),
            complemento: $('#complemento').val(),
            cidade: $('#cidade').val(),
            estado: $('#estado').val(),
            pais: $('#pais').val(),
            cep: $('#cep').val(),
            estadoCivil: $('#estadoCivil').val()
            // Restante dos campos do formulário...
        };

        // Obter token de autenticação do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }

        // Fazer uma requisição AJAX para atualizar os dados do usuário
        $.ajax({
            url: '/api/usuarios/atualizar',
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(dadosUsuario),
            success: function (response) {
                console.log('Dados do usuário atualizados com sucesso:', response);
                alert('Dados atualizados com sucesso!');
                // Redirecionar para outra página, por exemplo...
            },
            error: function (err) {
                console.error('Erro ao atualizar dados do usuário:', err);
                alert('Erro ao atualizar dados do usuário. Por favor, tente novamente.');
            }
        });
    }
});
