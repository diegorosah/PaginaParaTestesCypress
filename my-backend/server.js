const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const paymentRoutes = require('./routes/pagamentos');
const cadastroRoutes = require('./routes/cadastro');
const dividaRoutes = require('./routes/dividas');
const historicoRoutes = require('./routes/historicoBancario');
const ofertaRouter = require('./routes/ofertas');
const authMiddleware = require('./middleware/auth');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/Exemplo');

// Middleware para permitir CORS
app.use(cors());

// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define o diretório onde os arquivos estáticos serão servidos
app.use(express.static(path.join(__dirname, 'HTML')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts'))); // Adicione esta linha

// Rota para servir a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'login.html'));
});

// Adicionando rotas para divida e historico
app.use('/api/divida', dividaRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/oferta', ofertaRouter);

// Rotas de autenticação e protegidas
app.use('/api', authRoutes);
app.use('/api/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});

// Rotas de conta, pagamentos e cadastro
app.use('/api/account', authMiddleware, accountRoutes);
app.use('/api/pagamentos', authMiddleware, paymentRoutes);
app.use('/api/cadastro', authMiddleware, cadastroRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
