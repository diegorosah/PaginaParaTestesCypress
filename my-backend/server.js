// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const paymentRoutes = require('./routes/pagamentos'); // Adicione a referência aqui
const authMiddleware = require('./middleware/auth');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

mongoose.connect('mongodb://localhost:27017/Exemplo');

// Middleware para permitir CORS
app.use(cors());

// Middleware para analisar o corpo das requisições como JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define o diretório onde os arquivos estáticos serão servidos
app.use(express.static(path.join(__dirname, 'HTML')));

// Rota para servir a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'login.html'));
});

// Rotas para autenticação e contas
app.use('/api', authRoutes);
app.use('/api/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});
app.use('/api/account', authMiddleware, accountRoutes); // Use as rotas da conta protegidas pelo middleware de autenticação
app.use('/api/pagamentos', authMiddleware, paymentRoutes); // Adicione as rotas de pagamentos aqui

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
