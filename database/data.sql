insert into "Users" ("firstName", "lastName", "username", "hashedPassword")
values ('Guest', 'User', 'guest', '$argon2id$v=19$m=65536,t=3,p=4$576zKZ3bRQRYo9Nn/kCJUw$mO+6rM/JcE+pwwW8kMSxw3gqIVwtiGGcozlP5xrFm2c');

insert into "Users" ("firstName", "lastName", "username", "hashedPassword")
values ('Sarah', 'Smith', 'sarah.s', '$argon2id$v=19$m=65536,t=3,p=4$DXonwVGGWYViXOmu/Oo6pQ$Dxe+7RPmeS0rkJSJSd+38KyoAz0dGE4eYGtSkd/kNp8');

insert into "Users" ("firstName", "lastName", "username", "hashedPassword")
values ('Mark', 'Smith', 'marksmith', '$argon2id$v=19$m=65536,t=3,p=4$jTc/MKPAsJjLCjQl1v5xfw$aYNKUjtr3aM0IKxd9Q2WlLR/JExPs9HH5grNGVnUN8c');

insert into "Users" ("firstName", "lastName", "username", "hashedPassword")
values ('John', 'Smith', 'j.smith', '$argon2id$v=19$m=65536,t=3,p=4$XWP/2UqakyMDOSNymbSLIQ$+aoC+S/HaiiNIEL6nzvdT1lHrOUrb9bBVJ2HxfJSWVw');

insert into "Users" ("firstName", "lastName", "username", "hashedPassword")
values ('Lily', 'Smith', 'lily.smith', '$argon2id$v=19$m=65536,t=3,p=4$BlVEEhG33IsikPQ7MVgy3g$n0AMzTNJ5DyDweXaYjP0ZqR1ONNA7gOm5MgyiWY3rOo');

insert into "Users" ("firstName", "lastName", "username", "hashedPassword")
values ('Emily', 'Smith', 'em.smith', '$argon2id$v=19$m=65536,t=3,p=4$OQjbH1N4iCtWVDl3w4s5CA$5hP2ghWAiMlHhqQ4JbI5fwL5E/nJR8TApM+O6bz3pJc');

insert into "Families" ("familyName", "hashedPassword")
values ('Smith', '$argon2id$v=19$m=65536,t=3,p=4$VMm6gn7kmQ6FfNyX2U34UA$x0QkiKPWw4yDdm8Zw73Vjda2BEXgJrm53PEi4Xt0zQE');

insert into "FamilyMembers" ("userId", "familyId")
values (1, 1);

insert into "FamilyMembers" ("userId", "familyId")
values (2, 1);

insert into "ImageMemories" ("userId", "familyId", "imageUrl", "caption")
values (1, 1, '/images/family-trip-1743797654537.jpg', 'Smiths on a wagon!');

insert into "ImageMemories" ("userId", "familyId", "imageUrl", "caption")
values (2, 1, '/images/Christmas-1743799636026.png', 'Cheers to unforgettable holiday moments! 🎄🥂✨!');

insert into "ImageMemories" ("userId", "familyId", "imageUrl", "caption")
values (4, 1, '/images/full-fam-1743800523118.jpg', 'Family, laughter, and sunshine - the perfect combination!');

insert into "RecipeMemories" ("userId", "familyId", "dishName", "category",  "cookingTime", "ingredients", "directions", "creator", "backstory", "notes")
values (1, 1, 'Grandma’s Cinnamon Sugar Cookies', 'Sweet Treat', '27 mins', 'All-purpose flour (2 3/4 cups), Baking soda (1 teaspoon), Baking powder (1/2 teaspoon), Salt (1/2 teaspoon), Unsalted butter - softened (1 cup), Granulated sugar (1 1/2 cups), Egg (1), Vanilla extract (1 teaspoon), Ground cinnamon (1/2 teaspoon), Granulated sugar (1/4 cup), Ground cinnamon (1 teaspoon)', 'Preheat oven to 350°F (175°C) and line a baking sheet with parchment paper. In a medium bowl, whisk together flour, baking soda, baking powder, salt, and cinnamon. In a large bowl, beat the softened butter and sugar together until light and fluffy. Add the egg and vanilla extract, mixing until well combined. Gradually add the dry ingredients to the wet mixture, stirring until a soft dough forms. In a small bowl, mix the cinnamon-sugar coating ingredients. Roll dough into small balls (about 1 inch in diameter), then roll each ball in the cinnamon-sugar mixture until fully coated. Place the cookies on the prepared baking sheet, spacing them about 2 inches apart. Bake for 8-10 minutes, or until the edges are lightly golden. Let the cookies cool on the baking sheet for 5 minutes before transferring them to a wire rack. Serve warm and enjoy.', 'Grandma Rose', 'Every winter, the Smith family kitchen would fill with the warm, comforting scent of cinnamon and sugar as Grandma baked her famous cookies. Emily and her little brother Jake would sit on the counter, giggling as they rolled the dough into perfect little balls before dunking them into the cinnamon-sugar mixture. Grandma always let them sneak a bite of the dough, winking and whispering, “A little taste of love makes them even sweeter.”

One special evening, during a heavy snowfall, the power went out just as the first batch was about to bake. Instead of panicking, Grandma lit a few candles, wrapped the cookie tray in foil, and set it by the fireplace. The family huddled together, sharing stories while the cookies baked slowly over the gentle warmth. When they finally tasted the golden, slightly smoky cookies, Grandma laughed, calling them her “fireplace batch.” That winter, the Smiths realized that the true magic of Grandma’s cookies wasn’t just in the ingredients—it was in the moments shared around them.', 'For a chewier texture, slightly underbake them and let them cool on the baking sheet. Adding a pinch of nutmeg enhances the flavor. Store in an airtight container for up to a week, though they rarely last that long in the Smith household. These cookies make perfect holiday gifts—just wrap them in a tin with a handwritten note, just like Grandma used to do.');

insert into "StoryMemories" ("userId", "familyId", "title", "content", "author")
values (2, 1, 'A Legacy of Love', 'When young Emily Smith visited her grandparents’ home every summer, she loved listening to the stories her Grandpa Henry told about their family’s history. He would pull out an old wooden box filled with sepia-toned photographs, each one carrying a tale of resilience, love, and laughter. There was a picture of her great-great-grandfather, a blacksmith who built the very house they still lived in, and another of her grandmother as a child, playing by the same oak tree that now shaded their backyard. Each story brought the past to life, making Emily feel like she was part of something much bigger than herself.

One summer, Emily found a dusty, forgotten journal hidden in the attic. The journal belonged to her great-aunt Margaret, who had traveled the world as a nurse during wartime. Her words spoke of bravery and compassion, of letters sent home filled with longing and love. Inspired, Emily decided to document her own family’s memories, creating a scrapbook filled with pictures, handwritten notes, and the stories Grandpa Henry told. When she finally presented it to the family one Thanksgiving, there wasn’t a dry eye in the room. The Smith family’s legacy wasn’t just in the stories—they were in the hearts of every generation that carried them forward.', 'Sarah Smith');

insert into "StoryMemories" ("userId", "familyId", "title", "content", "author")
values (1, 1, 'The Smith Family Time Capsule', 'One chilly autumn afternoon, the Smith family gathered in their backyard with a small metal box and a shovel. Inspired by an old tradition Grandpa Henry had once mentioned, they decided to create a time capsule filled with memories for future generations. Each family member contributed something special—Emily placed a handwritten letter describing her favorite family moments, her little brother Jake added his lucky baseball card, and their mom tucked in a family recipe that had been passed down for generations. Even Grandpa Henry, with his wise smile, slipped in a black-and-white photograph of his parents, along with a note that simply read, "Remember where you come from."

After sealing the box, they buried it beneath the old oak tree that had stood in their yard for over a hundred years. As they patted down the soil, Grandpa Henry chuckled, “One day, when you dig this up, you’ll see just how much love and laughter lived in this family.” Years passed, and the tree continued to stand tall, watching over generations of the Smiths. One day, decades later, Emily’s own children uncovered the box, unearthing the memories of a family that had always stayed connected through time.', 'Guest User');

insert into "VideoMemories" ("userId", "familyId", "videoUrl", "caption")
values (1, 1, '/videos/Celebrating christmas-1743799804211.mp4', 'Lights, laughter, and love—Christmas is in the air! 🎄✨');

insert into "Likes" ("userId", "familyId", "imageId", "recipeId", "storyId", "videoId")
values (1, 1, 1, NULL, NULL, NULL);

insert into "Likes" ("userId", "familyId", "imageId", "recipeId", "storyId", "videoId")
values (1, 1, Null, 1, NULL, NULL);

insert into "Likes" ("userId", "familyId", "imageId", "recipeId", "storyId", "videoId")
values (1, 1, Null, Null, 2, NULL);

insert into "Likes" ("userId", "familyId", "imageId", "recipeId", "storyId", "videoId")
values (1, 1, Null, Null, Null, 1);

insert into "Comments" ("userId", "familyId", "imageId", "videoId", "author", "comment")
values (3, 1, 2, Null, 'marksmith', 'Nothing beats a day outdoors with my favorite people!');

insert into "Comments" ("userId", "familyId", "imageId", "videoId", "author", "comment")
values (2, 1, 2, Null, 'sarah.s', 'These smiles make my heart so full.');

insert into "Comments" ("userId", "familyId", "imageId", "videoId", "author", "comment")
values (1, 1, 1, NULL, 'guest', 'Such a wholesome family pic! ❤️✨');

insert into "Comments" ("userId", "familyId", "imageId", "videoId", "author", "comment")
values (2, 1, 1, NULL, 'sarah.s', 'Omg, this turned out so good!! Love you all! 😍');

insert into "Comments" ("userId", "familyId", "imageId", "videoId", "author", "comment")
values (3, 1, 1, NULL, 'marksmith', 'Best day ever! Also, who’s responsible for the color coordination? 😂');

insert into "Comments" ("userId", "familyId", "imageId", "videoId", "author", "comment")
values (4, 1, 1, NULL, 'j.smith', 'Right?! It’s like we planned it… but didn’t. 😂');

insert into "Comments" ("userId", "familyId", "imageId", "videoId", "author", "comment")
values (5, 1, 1, NULL, 'lily.smith', 'Lowkey obsessed with how perfect this is.');

insert into "Comments" ("userId", "familyId", "imageId", "videoId", "author", "comment")
values (5, 1, 1, NULL, 'lily.smith', 'Also, the kids stole the show!');

insert into "Comments" ("userId", "familyId", "imageId", "videoId", "author", "comment")
values (6, 1, 1, NULL, 'em.smith', '100%! They’re the real MVPs. Also, can we talk about how comfy Dad looks? 😂');

insert into "Comments" ("userId", "familyId", "imageId", "videoId", "author", "comment")
values (1, 1, 1, NULL, 'guest', 'Seriously though, this needs to be framed.');
