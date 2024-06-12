const jwt = require('jsonwebtoken');

const jwtSecret = 'S3gr3d0JW7!par4Pr07ege3rT0k3ns';

const auth = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), jwtSecret);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        return res.status(403).json({ success: false, message: 'Token inválido' });
    }
};

module.exports = auth;
