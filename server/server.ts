/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express, { application } from 'express';
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

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    validateBody(firstName, 'First name');
    validateBody(lastName, 'Last name');
    validateBody(username, 'Username');
    validateBody(password, 'Password');
    const hashedPassword = await argon2.hash(password);
    const sql = `
                insert into "Users" ("firstName", "lastName", "username", "hashedPassword")
                values ($1, $2, $3, $4)
                returning "firstName", "lastName", "username", "userId", "createdAt";
                `;

    const params = [firstName, lastName, username, hashedPassword];
    const response = await db.query(sql, params);
    // for sign-in on sign-up
    const user = response.rows[0];
    const { userId } = user;
    const payload = { firstName, lastName, username, userId };
    const token = jwt.sign(payload, hashKey);
    console.log('payload', payload);

    res.status(201).json({ user: payload, token });
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

app.post('/api/auth/create-family', authMiddleware, async (req, res, next) => {
  try {
    const { familyName, password } = req.body;
    validateBody(familyName, 'Family name');
    validateBody(password, 'Password');
    const hashedPassword = await argon2.hash(password);
    const sql = `
                insert into "Families" ("familyName", "hashedPassword")
                values ($1, $2)
                returning "familyName", "familyId", "createdAt";
                `;
    const params = [familyName, hashedPassword];
    const response = await db.query(sql, params);
    const family = response.rows[0];
    res.status(201).json(family);
  } catch (err) {
    next(err);
  }
});

async function validatePassword(
  familyId: number,
  password: string
): Promise<void | boolean> {
  const sql = `select * from "Families"
            where "familyId" = $1`;
  const response = await db.query(sql, [familyId]);
  const family = response.rows[0];
  if (!family) throw new ClientError(401, 'invalid login');
  if (!(await argon2.verify(family.hashedPassword, password))) {
    throw new ClientError(401, 'invalid login');
  }
  return true;
}

app.post('/api/auth/join-family', authMiddleware, async (req, res, next) => {
  try {
    const { familyId, password } = req.body;
    if (!familyId || !password) {
      throw new ClientError(401, 'Invalid credentials');
    }
    if (!(await validatePassword(familyId, password))) {
      throw new ClientError(401, 'Password incorrect');
    }
    const sql = `
                insert into "FamilyMembers" ("userId", "familyId")
                values ($1, $2)
                returning *;
                `;
    const params = [req.user?.userId, familyId];
    const response = await db.query(sql, params);
    const family = response.rows[0];
    res.status(201).json(family);
  } catch (err) {
    next(err);
  }
});

app.post('/api/family-details', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.body;
    validateBody(userId, 'userId');
    const sql = `select * from "FamilyMembers"
              join "Families" using ("familyId")
              where "userId" = $1;
              `;
    const response = await db.query(sql, [userId]);
    const familyDetails = response.rows;
    if (!familyDetails.length)
      throw new ClientError(404, 'Failed to get family name');
    const details = familyDetails.map((family) => {
      return { familyId: family.familyId, familyName: family.familyName };
    });
    res.send(details);
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
