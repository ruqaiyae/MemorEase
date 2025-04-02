insert into "Users" ("firstName", "lastName", "username", "hashedPassword")
values ('Guest', 'Guest', 'Guest', '$argon2id$v=19$m=65536,t=3,p=4$vr9eyHdrynesh+KyezNqWQ$sCyJ3RY1CzpGMmSrUyfJDFOXZK6eFuUohCPQl876jXY');

insert into "Families" ("familyName", "hashedPassword")
values ('Smith', '$argon2id$v=19$m=65536,t=3,p=4$VMm6gn7kmQ6FfNyX2U34UA$x0QkiKPWw4yDdm8Zw73Vjda2BEXgJrm53PEi4Xt0zQE');

insert into "FamilyMembers" ("userId", "familyId")
values (1, 1);
