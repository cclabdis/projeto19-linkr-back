import { db } from "../database/database.connection.js";
export async function insertPost(description, link, user_id) {
    return db.query(`
    INSERT INTO posts 
      (description, link, user_id) 
    VALUES 
      ($1, $2, $3) 
    RETURNING id;` ,
    [description, link,  user_id]);
}


export async function deletePostId(id) {
    return db.query(`
    SELECT * FROM posts WHERE id = $1
      `, [id]);
}

export async function checkPost(id) {
    return db.query(`
    SELECT * FROM posts WHERE id = $1
      `, [id]);
}
