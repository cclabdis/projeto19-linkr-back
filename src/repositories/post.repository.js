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
  try {
    await db.query('SET CONSTRAINTS ALL DEFERRED');
    await db.query(`
            DELETE FROM hashmiddle WHERE post_id = $1;
        `, [id]);

    await db.query(`
            DELETE FROM posts WHERE id = $1;
        `, [id]);

    await db.query('SET CONSTRAINTS ALL IMMEDIATE');

    return true; 

  } catch (err) {
    await db.query('ROLLBACK'); 
    throw err; 
  }
}


export async function checkPost(id) {
  return db.query(`
    SELECT * FROM posts WHERE id = $1
      `, [id]);
}
