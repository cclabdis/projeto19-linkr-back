import { db } from "../database/database.connection.js";

export async function getTrendingsDB(){
    /*await db.query(`INSERT INTO users (username,photo,mail,password,created_at) VALUES('jefti','https://img.olhardigital.com.br/wp-content/uploads/2019/09/20190912030622.jpg','jefti@admin.com','123',NOW()) ;`);
    await db.query(`INSERT INTO hashtags (hashtag) VALUES ('driven');`);
    await db.query(`INSERT INTO posts 
    (user_id,link,description,created_at) VALUES 
    (
        1,
        'https://www.notion.so/bootcampra/Revis-o-React-51df562cfaa241bf98401a1980ea065f',
        'Revisão react da let!',
        NOW()
    );`);
    await db.query(`INSERT INTO hashmiddle (post_id,hashtag_id) VALUES (1,1)`);
    await db.query(`INSERT INTO hashmiddle (post_id,hashtag_id) VALUES (1,2)`);*/
    const select =  await db.query(`SELECT h.id, h.hashtag, COUNT(rel.hashtag_id) AS appearances FROM hashtags AS h JOIN hashMiddle as rel ON rel.hashtag_id = h.id GROUP BY h.id ORDER BY appearances LIMIT 10;`);
    return select.rows;
}