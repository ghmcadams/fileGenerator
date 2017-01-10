--
-- Author:  Gabriel McAdams
-- Date:    01/10/2017
-- Creating a SQL script to insert links to profile pages
--

USE my_db_name;

DECLARE userId BIGINT;

SELECT id INTO userId FROM `user` WHERE `name` = 'Gabriel McAdams' LIMIT 1;

IF userId IS NULL THEN
  -- Insert user
  INSERT INTO `user` (
    `name`
  )
  VALUES (
    'Gabriel McAdams'
  );

  SET userId = LAST_INSERT_ID();
END IF;


-- remove previously imported links for Gabriel McAdams...
DELETE FROM `link` WHERE `userId` = userId;


-- -----------------------------------------
--  stackoverflow
-- -----------------------------------------
INSERT INTO `link` SET
  `userid` = userId,
  `name` = 'stackoverflow',
  `description` = 'StackOverflow Developer Story',
  `url` = 'http://stackoverflow.com/users/story/213474',
  `deleted` = 0;


-- -----------------------------------------
--  linkedin
-- -----------------------------------------
INSERT INTO `link` SET
  `userid` = userId,
  `name` = 'linkedin',
  `description` = 'LinkedIn Profile',
  `url` = 'https://www.linkedin.com/in/gabrielmcadams',
  `deleted` = 0;


