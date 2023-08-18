import { db } from "../database/database.connection.js";
export async function insertPost(description, link,  user_id){
    return db.query(`INSERT INTO posts (description, link, user_id) 
        VALUES ($1, $2, $3) RETURNING id;` ,
    [description, link,  user_id]);
}


