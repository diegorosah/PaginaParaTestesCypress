const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const paymentRoutes = require('./routes/pagamentos');
const userRoutes = require('./routes/user');
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

// Rotas para autenticação e contas
app.use('/api', authRoutes);
app.use('/api/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});
//usuarios e dados dos usuarios
app.use('/api/account', authMiddleware, accountRoutes);
app.use('/api/pagamentos', authMiddleware, paymentRoutes);
app.use('/api/usuarios', authMiddleware, userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
