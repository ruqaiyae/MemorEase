set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "Users" (
  "userId" serial PRIMARY KEY,
  "firstName" text,
  "lastName" text,
  "username" text UNIQUE,
  "hashedPassword" text,
  "createdAt" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "Families" (
  "familyId" serial PRIMARY KEY,
  "familyName" text NOT NULL,
  "hashedPassword" text,
  "createdAt" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "FamilyMembers" (
  "userId" integer,
  "familyId" integer,
  "joinedAt" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  primary key ("userId", "familyId")
);


CREATE TABLE "ImageMemories" (
  "imageId" serial PRIMARY KEY,
  "userId" integer,
  "familyId" integer,
  "imageUrl" text NOT NULL,
  "caption" text,
  "createdAt" timestamptz DEFAULT (CURRENT_timestamp)
);


CREATE TABLE "RecipeMemories" (
  "recipeId" serial PRIMARY KEY,
  "userId" integer,
  "familyId" integer,
  "dishName" text NOT NULL,
  "category" text NOT NULL,
  "cookingTime" text NOT NULL,
  "ingredients" text NOT NULL,
  "directions" text NOT NULL,
  "creator" text NOT NULL,
  "backstory" text,
  "notes" text,
  "createdAt" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "updatedAt" timestamptz DEFAULT (CURRENT_timestamp)
);

CREATE TABLE "StoryMemories" (
  "storyId" serial PRIMARY KEY,
  "userId" integer,
  "familyId" integer,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "createdAt" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "updatedAt" timestamptz DEFAULT (CURRENT_timestamp)
);

CREATE TABLE "VideoMemories" (
  "videoId" serial PRIMARY KEY,
  "userId" integer,
  "familyId" integer,
  "videoUrl" text NOT NULL,
  "caption" text,
  "createdAt" timestamptz DEFAULT (CURRENT_timestamp)
);

CREATE TABLE "Likes" (
  "likeId" serial PRIMARY KEY,
  "userId" integer,
  "storyId" integer,
  "imageId" integer,
  "videoId" integer,
  "createdAt" timestamptz DEFAULT (CURRENT_timestamp)
);

CREATE TABLE "Comments" (
  "commentsId" serial PRIMARY KEY,
  "userId" integer,
  "storyId" integer,
  "imageId" integer,
  "videoId" integer,
  "comment" text NOT NULL,
  "createdAt" timestamptz DEFAULT (CURRENT_timestamp)
);

ALTER TABLE "FamilyMembers" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "FamilyMembers" ADD FOREIGN KEY ("familyId") REFERENCES "Families" ("familyId");

ALTER TABLE "ImageMemories" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "ImageMemories" ADD FOREIGN KEY ("familyId") REFERENCES "Families" ("familyId");

ALTER TABLE "RecipeMemories" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "RecipeMemories" ADD FOREIGN KEY ("familyId") REFERENCES "Families" ("familyId");

ALTER TABLE "StoryMemories" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "StoryMemories" ADD FOREIGN KEY ("familyId") REFERENCES "Families" ("familyId");

ALTER TABLE "VideoMemories" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "VideoMemories" ADD FOREIGN KEY ("familyId") REFERENCES "Families" ("familyId");

ALTER TABLE "Likes" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "Comments" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");

ALTER TABLE "Likes" ADD CONSTRAINT "Likes_StoryMemories" FOREIGN KEY ("storyId") REFERENCES "StoryMemories" ("storyId");

ALTER TABLE "Likes" ADD CONSTRAINT "Likes_ImageMemories" FOREIGN KEY ("imageId") REFERENCES "ImageMemories" ("imageId");

ALTER TABLE "Likes" ADD CONSTRAINT "Likes_VideoMemories" FOREIGN KEY ("videoId") REFERENCES "VideoMemories" ("videoId");

ALTER TABLE "Comments" ADD CONSTRAINT "Comments_StoryMemories" FOREIGN KEY ("storyId") REFERENCES "StoryMemories" ("storyId");

ALTER TABLE "Comments" ADD CONSTRAINT "Comments_ImageMemories" FOREIGN KEY ("imageId") REFERENCES "ImageMemories" ("imageId");

ALTER TABLE "Comments" ADD CONSTRAINT "Comments_VideoMemories" FOREIGN KEY ("videoId") REFERENCES "VideoMemories" ("videoId");
