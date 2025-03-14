/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  hashedPassword: string;
};

type Auth = {
  username: string;
  password: string;
};

function validateBody(property: string | number, propName: string): void {
  if (!property) throw new ClientError(400, `${propName} required`);
}

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
                select * from "users"
                where "username" = $1;
                `;
    const response = await db.query(sql, [username]);
    const user = response.rows[0];
    if (!user) throw new ClientError(401, 'invalid login');
    if (!(await argon2.verify(user.hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    } else {
      const { userId } = user;
      const payload = { username, userId };
      const token = jwt.sign(payload, hashKey);
      res.json({ user: payload, token });
    }
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
                select * from "Users"
                where "username" = $1;
                `;
    const response = await db.query(sql, [username]);
    const user = response.rows[0];
    if (!user) throw new ClientError(401, 'invalid login');
    if (!(await argon2.verify(user.hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    } else {
      const { userId } = user;
      const payload = { username, userId };
      const token = jwt.sign(payload, hashKey);
      res.json({ user: payload, token });
    }
  } catch (err) {
    next(err);
  }
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
