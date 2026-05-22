const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const USERS_PATH = path.join(__dirname, '../../users.json');

const readUsers = () => {
  try {
    if (!fs.existsSync(USERS_PATH)) {
      fs.writeFileSync(USERS_PATH, JSON.stringify([]));
      return [];
    }
    return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
  } catch (err) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(422).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const users = readUsers();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET || 'wallet_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'wallet_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

const getMe = (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};

module.exports = { register, login, getMe };
