// File: backend-package.js

const express = require('express');

class BackendPackage {
  constructor() {
    this.app = express();
    this.users = [
      { username: 'admin', password: 'admin', role: 'admin' },
      { username: 'user', password: 'user', role: 'user' }
    ];
  }

  authenticate(req, res, next) {
    const { username, password } = req.headers;
    const user = this.users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  }

  authorize(role) {
    return (req, res, next) => {
      if (!req.user || req.user.role !== role) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  }

  startServer(port) {
    this.app.use(express.json());

    // Middleware for authentication
    this.app.use(this.authenticate.bind(this));

    // Protected route
    this.app.get('/admin', this.authorize('admin'), (req, res) => {
      res.json({ message: 'Admin area' });
    });

    // Unprotected route
    this.app.get('/public', (req, res) => {
      res.json({ message: 'Public area' });
    });

    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

module.exports = BackendPackage;
