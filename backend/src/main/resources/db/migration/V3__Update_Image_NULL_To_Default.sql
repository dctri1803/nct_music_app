UPDATE songs
SET image_name = 'default.jpg'
WHERE image_name IS NULL AND id > 0;

UPDATE artists
SET photo = 'default.jpg'
WHERE photo IS NULL AND id > 0;
