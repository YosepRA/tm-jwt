require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const parseBearerToken = require('parse-bearer-token').default;

const app = express();

let jwtSecret = process.env.JWT_SECRET;
if (jwtSecret === undefined) {
  console.log(
    'You are using an UNSAFE JWT secret. Create your own secret key and provide it through environment.',
  );
  jwtSecret = 'unsafe_jwt_secret';
}

/* ========== Helpers ========== */

function verifyToken(req, res, next) {
  const token = parseBearerToken(req);

  if (!token) {
    return res.sendStatus(403);
  }

  req.token = token;
  next();

  return undefined;
}

/* ========== Routes ========== */

app.post('/api/posts', verifyToken, (req, res) => {
  const { token } = req;

  jwt.verify(token, jwtSecret, (err, authData) => {
    if (err) res.sendStatus(403);

    res.send({ message: 'Post created', authData });
  });
});

app.post('/api/login', (req, res) => {
  // Mock user.
  const user = {
    id: 1,
    username: 'joe',
    email: 'joe@mail.com',
  };

  jwt.sign({ user }, jwtSecret, (err, token) => {
    res.json({ token });
  });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000...');
});
