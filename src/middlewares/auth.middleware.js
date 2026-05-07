const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
const token=req.cookies.token || req.headers.authorization?.split(' ')[1];

if (!token) {
return res.status(401).json({ message: 'Access denied. No token provided.' });
}

try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await userModel.findById(decoded.id);
req.user = user;
next();
} catch (error) {
return res.status(400).json({ message: 'Invalid token.' });
}
}


async function authSystemUserMiddleware(req, res, next) {
const token=req.cookies.token || req.headers.authorization?.split(' ')[1];

if (!token) {
return res.status(401).json({ message: 'Access denied. No token provided.' });
}
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await userModel.findById(decoded.id);

if(!user.systemUser) {
return res.status(403).json({ message: 'Access denied. System users only.' });
}
req.user = user;
next();
}

module.exports = {authMiddleware,authSystemUserMiddleware};