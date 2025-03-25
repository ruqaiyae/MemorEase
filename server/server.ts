/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import {
  ClientError,
  errorMiddleware,
  authMiddleware,
  uploadsImageMiddleware,
  uploadsVideoMiddleware,
} from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import {
  type Image,
  type Recipe,
  type Story,
  type Video,
  type LikeMemory,
} from '../client/src/Lib/data.js';

function validateBody(
  property: string | number | undefined,
  propName: string
): void {
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

type Auth = {
  username: string;
  password: string;
};

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
      delete user.hashedPassword;
      const payload = user;
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

app.get(
  '/api/family/:familyId/dashboard/images',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `select * from "ImageMemories"
                  where "familyId" = $1
                  order by "imageId"
                  `;
      const response = await db.query<Image[]>(sql, [familyId]);
      const image = response.rows;
      res.json(image);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/images/:imageId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const imageId = Number(req.params.imageId);
      if (!Number.isInteger(imageId) || imageId < 1) {
        throw new ClientError(400, 'imageId must be a positive integer');
      }
      const sql = `select *
                    from "ImageMemories"
                    where "familyId" = $1
                    and "imageId" = $2;
                  `;
      const params = [familyId, imageId];
      const response = await db.query<Image>(sql, params);
      const image = response.rows[0];
      res.json(image);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  '/api/family/:familyId/dashboard/image-uploads',
  authMiddleware,
  uploadsImageMiddleware.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file)
        throw new ClientError(400, 'No file provided in the request.');
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      let { caption } = req.body as Partial<Image>;
      validateBody(caption, 'caption');
      if (!caption) caption = '';
      const imageUrl = `/images/${req.file.filename}`;
      const sql = `insert into "ImageMemories" ("userId", "familyId", "imageUrl", "caption")
                  values($1, $2, $3, $4)
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, imageUrl, caption];
      const response = await db.query<Image>(sql, params);
      const image = response.rows[0];
      res.status(201).json(image);
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  '/api/family/:familyId/dashboard/images/:imageId/edit',
  authMiddleware,
  uploadsImageMiddleware.single('image'),
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const imageId = Number(req.params.imageId);
      if (!Number.isInteger(imageId) || imageId < 1) {
        throw new ClientError(400, 'imageId must be a positive integer');
      }
      let { caption } = req.body as Partial<Image>;
      validateBody(caption, 'caption');
      if (!caption) caption = '';
      const imageUrl = `/images/${req.file?.filename}`;
      const sql = `update "ImageMemories"
                  set "userId" = $1, "familyId" = $2, "imageUrl" = $3, "caption" = $4
                  where "imageId" = $5
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, imageUrl, caption, imageId];
      const response = await db.query<Image>(sql, params);
      const image = response.rows[0];
      res.json(image);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  '/api/family/:familyId/dashboard/images/:imageId/edit',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const imageId = Number(req.params.imageId);
      if (!Number.isInteger(imageId) || imageId < 1) {
        throw new ClientError(400, 'imageId must be a positive integer');
      }
      const sql = `delete from "ImageMemories"
                  where "userId" = $1 and "familyId" = $2 and "imageId" = $3
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, imageId];
      const response = await db.query<Image>(sql, params);
      const image = response.rows[0];
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/recipes',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `select * from "RecipeMemories"
                  where "familyId" = $1
                  order by "recipeId";
                  `;
      const response = await db.query<Recipe[]>(sql, [familyId]);
      const recipes = response.rows;
      res.json(recipes);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/recipes/:recipeId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const recipeId = Number(req.params.recipeId);
      if (!Number.isInteger(recipeId) || recipeId < 1) {
        throw new ClientError(400, 'recipeId must be a positive integer');
      }
      const sql = `select *
                    from "RecipeMemories"
                    where "userId" = $1
                    and "familyId" = $2
                    and "recipeId" = $3;
                  `;
      const params = [req.user?.userId, familyId, recipeId];
      const response = await db.query<Recipe>(sql, params);
      const recipe = response.rows[0];
      res.json(recipe);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  '/api/family/:familyId/dashboard/recipe-uploads',
  authMiddleware,
  async (req, res, next) => {
    try {
      const {
        dishName,
        category,
        cookingTime,
        ingredients,
        directions,
        creator,
        backstory,
        notes,
      } = req.body;
      validateBody(dishName, 'dishName');
      validateBody(category, 'category');
      validateBody(cookingTime, 'cookingTime');
      validateBody(ingredients, 'ingredients');
      validateBody(directions, 'directions');
      validateBody(creator, 'creator');
      validateBody(backstory, 'backstory');
      validateBody(notes, 'notes');
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `insert into "RecipeMemories" ("userId", "familyId", "dishName", "category", "cookingTime", "ingredients", "directions", "creator", "backstory", "notes")
                  values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                  returning *;
                  `;
      const params = [
        req.user?.userId,
        familyId,
        dishName,
        category,
        cookingTime,
        ingredients,
        directions,
        creator,
        backstory,
        notes,
      ];
      const response = await db.query<Recipe>(sql, params);
      const recipe = response.rows[0];
      res.status(201).json(recipe);
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  '/api/family/:familyId/dashboard/recipes/:recipeId/edit',
  authMiddleware,
  async (req, res, next) => {
    try {
      const {
        dishName,
        category,
        cookingTime,
        ingredients,
        directions,
        creator,
        backstory,
        notes,
      } = req.body;
      validateBody(dishName, 'dishName');
      validateBody(category, 'category');
      validateBody(cookingTime, 'cookingTime');
      validateBody(ingredients, 'ingredients');
      validateBody(directions, 'directions');
      validateBody(creator, 'creator');
      validateBody(backstory, 'backstory');
      validateBody(notes, 'notes');
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const recipeId = Number(req.params.recipeId);
      if (!Number.isInteger(recipeId) || recipeId < 1) {
        throw new ClientError(400, 'recipeId must be a positive integer');
      }

      const sql = `update "RecipeMemories"
                  set "userId" = $1, "familyId" = $2, "dishName" = $3, "category" = $4, "cookingTime" = $5, "ingredients" = $6, "directions" = $7, "creator" = $8, "backstory" = $9, "notes" = $10
                  where "recipeId" = $11
                  returning *;`;
      const params = [
        req.user?.userId,
        familyId,
        dishName,
        category,
        cookingTime,
        ingredients,
        directions,
        creator,
        backstory,
        notes,
        recipeId,
      ];
      const result = await db.query<Recipe>(sql, params);
      const recipe = result.rows[0];
      if (!recipe) {
        throw new ClientError(404, 'No recipes are available');
      }
      res.json(recipe);
    } catch (error) {
      next(error);
    }
  }
);

app.delete(
  '/api/family/:familyId/dashboard/recipes/:recipeId/edit',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const recipeId = Number(req.params.recipeId);
      if (!Number.isInteger(recipeId) || recipeId < 1) {
        throw new ClientError(400, 'recipeId must be a positive integer');
      }
      const sql = `delete from "RecipeMemories"
                  where "userId" = $1 and "familyId" = $2 and "recipeId" = $3
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, recipeId];
      const response = await db.query<Story>(sql, params);
      const recipe = response.rows[0];
      if (!recipe) {
        throw new ClientError(404, 'No stories are available');
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/stories',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `select * from "StoryMemories"
                  where "familyId" = $1
                  order by "storyId";
                  `;
      const params = [familyId];
      const response = await db.query<Story[]>(sql, params);
      const stories = response.rows;
      res.json(stories);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/stories/:storyId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const storyId = Number(req.params.storyId);
      if (!Number.isInteger(storyId) || storyId < 1) {
        throw new ClientError(400, 'storyId must be a positive integer');
      }
      const sql = `select *
                    from "StoryMemories"
                    where "familyId" = $1
                    and "storyId" = $2;
                  `;
      const params = [familyId, storyId];
      const response = await db.query<Story>(sql, params);
      const story = response.rows[0];
      res.json(story);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  '/api/family/:familyId/dashboard/story-uploads',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { title, content, author } = req.body;
      validateBody(title, 'title');
      validateBody(content, 'content');
      validateBody(author, 'author');
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `insert into "StoryMemories" ("userId", "familyId", "title", "content", "author")
                  values($1, $2, $3, $4, $5)
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, title, content, author];
      const response = await db.query<Story>(sql, params);
      const story = response.rows[0];
      res.status(201).json(story);
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  '/api/family/:familyId/dashboard/stories/:storyId/edit',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const storyId = Number(req.params.storyId);
      if (!Number.isInteger(storyId) || storyId < 1) {
        throw new ClientError(400, 'imageId must be a positive integer');
      }
      const { title, content, author } = req.body;
      validateBody(title, 'title');
      validateBody(content, 'content');
      validateBody(author, 'author');
      const sql = `update "StoryMemories"
                  set "userId" = $1, "familyId" = $2, "title" = $3, "content" = $4, author = $5
                  where "storyId" = $6
                  returning *;
                  `;
      const params = [
        req.user?.userId,
        familyId,
        title,
        content,
        author,
        storyId,
      ];
      const response = await db.query<Image>(sql, params);
      const story = response.rows[0];
      res.json(story);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  '/api/family/:familyId/dashboard/stories/:storyId/edit',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const storyId = Number(req.params.storyId);
      if (!Number.isInteger(storyId) || storyId < 1) {
        throw new ClientError(400, 'storyId must be a positive integer');
      }
      const sql = `delete from "StoryMemories"
                  where "userId" = $1 and "familyId" = $2 and "storyId" = $3
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, storyId];
      const response = await db.query<Story>(sql, params);
      const story = response.rows[0];
      if (!story) {
        throw new ClientError(404, 'No stories are available');
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/videos',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `select * from "VideoMemories"
                  where "familyId" = $1
                  order by "videoId"
                  `;
      const response = await db.query<Video[]>(sql, [familyId]);
      const video = response.rows;
      res.json(video);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/videos/:videoId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const videoId = Number(req.params.videoId);
      if (!Number.isInteger(videoId) || videoId < 1) {
        throw new ClientError(400, 'videoId must be a positive integer');
      }
      const sql = `select *
                    from "VideoMemories"
                    where "familyId" = $1
                    and "videoId" = $2;
                  `;
      const params = [familyId, videoId];
      const response = await db.query<Video>(sql, params);
      const video = response.rows[0];
      res.json(video);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  '/api/family/:familyId/dashboard/video-uploads',
  authMiddleware,
  uploadsVideoMiddleware.single('video'),
  async (req, res, next) => {
    try {
      if (!req.file)
        throw new ClientError(400, 'No file provided in the request.');
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      let { caption } = req.body as Partial<Video>;
      validateBody(caption, 'caption');
      if (!caption) caption = '';
      const videoUrl = `/videos/${req.file.filename}`;
      const sql = `insert into "VideoMemories" ("userId", "familyId", "videoUrl", "caption")
                  values($1, $2, $3, $4)
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, videoUrl, caption];
      const response = await db.query<Video>(sql, params);
      const video = response.rows[0];
      res.status(201).json(video);
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  '/api/family/:familyId/dashboard/videos/:videoId/edit',
  authMiddleware,
  uploadsVideoMiddleware.single('video'),
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const videoId = Number(req.params.videoId);
      if (!Number.isInteger(videoId) || videoId < 1) {
        throw new ClientError(400, 'videoId must be a positive integer');
      }
      let { caption } = req.body as Partial<Video>;
      validateBody(caption, 'caption');
      if (!caption) caption = '';
      const videoUrl = `/videos/${req.file?.filename}`;
      const sql = `update "VideoMemories"
                  set "userId" = $1, "familyId" = $2, "videoUrl" = $3, "caption" = $4
                  where "videoId" = $5
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, videoUrl, caption, videoId];
      const response = await db.query<Video>(sql, params);
      const video = response.rows[0];
      res.json(video);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  '/api/family/:familyId/dashboard/videos/:videoId/edit',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const videoId = Number(req.params.videoId);
      if (!Number.isInteger(videoId) || videoId < 1) {
        throw new ClientError(400, 'videoId must be a positive integer');
      }
      const sql = `delete from "VideoMemories"
                  where "userId" = $1 and "familyId" = $2 and "videoId" = $3
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, videoId];
      const response = await db.query<Video>(sql, params);
      const video = response.rows[0];
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/images/:imageId/readLike',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      const imageId = Number(req.params.imageId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `select *
                    from "Likes"
                    where "userId" = $1
                    and "familyId" = $2
                    and "imageId" = $3;
                  `;
      const params = [req.user?.userId, familyId, imageId];
      const response = await db.query<LikeMemory>(sql, params);
      const isLiked = response.rows[0] || null;
      res.json(isLiked);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/recipes/:recipeId/readLike',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      const recipeId = Number(req.params.recipeId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `select *
                    from "Likes"
                    where "userId" = $1
                    and "familyId" = $2
                    and "recipeId" = $3;
                  `;
      const params = [req.user?.userId, familyId, recipeId];
      const response = await db.query<LikeMemory>(sql, params);
      const isLiked = response.rows[0] || null;
      res.json(isLiked);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/stories/:storyId/readLike',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      const storyId = Number(req.params.storyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `select *
                    from "Likes"
                    where "userId" = $1
                    and "familyId" = $2
                    and "storyId" = $3;
                  `;
      const params = [req.user?.userId, familyId, storyId];
      const response = await db.query<LikeMemory>(sql, params);
      const isLiked = response.rows[0] || null;
      res.json(isLiked);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  '/api/family/:familyId/dashboard/videos/:videoId/readLike',
  authMiddleware,
  async (req, res, next) => {
    try {
      const familyId = Number(req.params.familyId);
      const videoId = Number(req.params.videoId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `select *
                    from "Likes"
                    where "userId" = $1
                    and "familyId" = $2
                    and "videoId" = $3;
                  `;
      const params = [req.user?.userId, familyId, videoId];
      const response = await db.query<LikeMemory>(sql, params);
      const isLiked = response.rows[0] || null;
      res.json(isLiked);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  '/api/family/:familyId/dashboard/like-memory',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id, desiredColumn } = req.body;
      validateBody(id, 'id');
      validateBody(desiredColumn, 'desiredColumn');
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `insert into "Likes" ("userId", "familyId", "${desiredColumn}")
                  values($1, $2, $3)
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, id];
      const response = await db.query<Story>(sql, params);
      const memoryLiked = response.rows[0];
      res.status(201).json(memoryLiked);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  '/api/family/:familyId/dashboard/dislike-memory',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id, desiredColumn } = req.body;
      validateBody(id, 'id');
      validateBody(desiredColumn, 'desiredColumn');
      const familyId = Number(req.params.familyId);
      if (!Number.isInteger(familyId) || familyId < 1) {
        throw new ClientError(400, 'familyId must be a positive integer');
      }
      const sql = `delete from "Likes"
                  where "userId" = $1 and "familyId" = $2 and "${desiredColumn}" = $3
                  returning *;
                  `;
      const params = [req.user?.userId, familyId, id];
      const response = await db.query<Story>(sql, params);
      const story = response.rows[0];
      if (!story) {
        throw new ClientError(404, 'No memory available');
      }
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

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
