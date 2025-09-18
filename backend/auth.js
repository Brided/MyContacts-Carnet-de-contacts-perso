const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectDB } = require('./db');

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).send('Missing email or password');
	try {
		const db = await connectDB();
		const existing = await db.collection('users').findOne({ email });
		if (existing) return res.status(409).send('User already exists');
		const hash = await bcrypt.hash(password, 10);
		await db.collection('users').insertOne({
			email,
			password: hash,
			createdAt: new Date()
		});
		res.send('User registered');
	} catch (err) {
		res.status(500).send('Registration error');
	}
});

// Login route
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).send('Missing email or password');
	try {
		const db = await connectDB();
		const user = await db.collection('users').findOne({ email });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).send('Invalid credentials');
		}
		const token = jwt.sign({ email }, process.env.JWT_SECRET || 'changeme', { expiresIn: '1h' });
		res.json({ token });
	} catch (err) {
		res.status(500).send('Login error');
	}
});

// Middleware for protected routes
function requireAuth(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).send('No token provided');
	const token = authHeader.split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
		req.user = decoded;
		next();
	} catch {
		res.status(401).send('Invalid token');
	}
}

// Example protected route
router.get('/protected', requireAuth, (req, res) => {
	res.send(`Hello ${req.user.email}, this is a protected route.`);
});

module.exports = router;