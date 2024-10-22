const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const upload = require('./middleware/multer');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const path = require('path');  // Added to handle path resolution
const User = require('./models/Submission');
const Admin = require('./models/Admin');

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Route for serving the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Route for user submission with validation
app.post('/submit', [
    check('name', 'Name is required').notEmpty(),
    check('socialMediaHandle', 'Social media handle is required').notEmpty(),
], upload.array('images', 10), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = new User({
            name: req.body.name,
            socialMediaHandle: req.body.socialMediaHandle,
            images: req.files.map(file => file.path),
        });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route for admin registration with validation
app.post('/admin/register', [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const admin = new Admin({ username: req.body.username, password: hashedPassword });
        await admin.save();
        res.status(201).json({ message: 'Admin registered' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/admin/login', [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (admin && await bcrypt.compare(req.body.password, admin.password)) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
            res.cookie('jwt', token, { httpOnly: true });
            res.json({ message: 'Login successful' });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const authenticate = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.sendStatus(403);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/users', authenticate, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.get('/isLogged', (req, res) => {
    const token = req.cookies.jwt;
    if (!token) return res.json({ isLogged: false });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.json({ isLogged: false });
        res.json({ isLogged: true });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
