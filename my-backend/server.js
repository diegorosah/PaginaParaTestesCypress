const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const authMiddleware = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/Exemplo');

// Middleware para permitir CORS
app.use(cors());

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/protected', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});
app.use('/api/account', authMiddleware, accountRoutes); // Use as rotas da conta protegidas pelo middleware de autenticação

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
