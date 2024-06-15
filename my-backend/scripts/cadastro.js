$(document).ready(function () {
    $('#cadastroForm').on('submit', function (e) {
        e.preventDefault();
        const formData = {
            nome: $('#nome').val(),
            email: $('#email').val(),
            cpf: $('#cpf').val(),
            dataNascimento: $('#dataNascimento').val(),
            telefone: $('#telefone').val(),
            estadoCivil: $('#estadoCivil').val(),
            nomeConjuge: $('#nomeConjuge').val(),
            cpfConjuge: $('#cpfConjuge').val(),
            ocupacao: $('#ocupacao').val(),
            renda: $('#renda').val(),
            escolaridade: $('#escolaridade').val(),
            numeroConta: $('#numeroConta').val(),
            preferenciasContato: $('#preferenciasContato').val(),
            preferenciasProdutos: $("input[name='preferenciasProdutos']:checked").map(function () {
                return $(this).val();
            }).get(),
            tipoPessoa: $('#tipoPessoa').val(),
            cnpj: $('#cnpj').val(),
            nomeEmpresa: $('#nomeEmpresa').val(),
            setorAtuacao: $('#setorAtuacao').val(),
            endereco: {
                pais: $('#pais').val(),
                estado: $('#estado').val(),
                cidade: $('#cidade').val(),
                numero: $('#numero').val(),
                endereco: $('#endereco').val(),
                cep: $('#cep').val()
            }
        };

        // Verificar se todos os campos obrigatórios foram preenchidos
        if (!validarCamposObrigatorios(formData)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Obter token de autenticação
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token de autenticação não encontrado');
            return;
        }

        // Verificar se o usuário já possui dados cadastrados
        $.ajax({
            url: '/api/cadastro/dados',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (response) {
                const usuario = response.usuario;
                if (usuario) {
                    // Se o usuário já existir, atualizar os dados
                    atualizarUsuario(formData, token, usuario._id);
                } else {
                    // Se não houver dados cadastrados, realizar o cadastro
                    cadastrarUsuario(formData, token);
                }
            },
            error: function (err) {
                console.error('Erro ao verificar dados do usuário:', err);
                alert('Erro ao verificar dados do usuário. Por favor, tente novamente.');
            }
        });
    });

    function validarCamposObrigatorios(formData) {
        return (
            formData.nome &&
            formData.email &&
            formData.cpf &&
            formData.dataNascimento &&
            formData.estadoCivil &&
            formData.ocupacao &&
            formData.renda &&
            formData.escolaridade &&
            formData.numeroConta &&
            formData.preferenciasContato &&
            formData.tipoPessoa &&
            (formData.tipoPessoa === 'Fisica' || (formData.tipoPessoa === 'Juridica' && formData.cnpj))
        );
    }

    function cadastrarUsuario(formData, token) {
        $.ajax({
            url: '/api/cadastro/cadastrar',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(formData),
            success: function (response) {
                alert('Usuário cadastrado com sucesso!');
            },
            error: function (err) {
                console.error('Erro ao cadastrar usuário:', err);
                alert('Erro ao cadastrar usuário. Por favor, tente novamente.');
            }
        });
    }

    function atualizarUsuario(formData, token, userId) {
        $.ajax({
            url: '/api/cadastro/atualizar',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ ...formData, userId }),
            success: function (response) {
                alert('Usuário atualizado com sucesso!');
            },
            error: function (err) {
                console.error('Erro ao atualizar usuário:', err);
                alert('Erro ao atualizar usuário. Por favor, tente novamente.');
            }
        });
    }

    // Mostrar campos do cônjuge se o estado civil for "Casado"
    $('#estadoCivil').on('change', function () {
        if (this.value === 'Casado') {
            $('#conjugeFields').show();
        } else {
            $('#conjugeFields').hide();
            $('#nomeConjuge').val('');
            $('#cpfConjuge').val('');
        }
    });

    // Mostrar campos de pessoa jurídica se o tipo de pessoa for "Juridica"
    $('#tipoPessoa').on('change', function () {
        if (this.value === 'Juridica') {
            $('#juridicaFields').show();
        } else {
            $('#juridicaFields').hide();
            $('#cnpj').val('');
            $('#nomeEmpresa').val('');
            $('#setorAtuacao').val('');
        }
    });
});
