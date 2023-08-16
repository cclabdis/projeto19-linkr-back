import { db } from "../database/database.connection.js";
export async function insertPost(description, link,  user_id){
    return db.query(`INSERT INTO posts (description, link, user_id) 
        VALUES ($1, $2, $3)` ,
    [description, link,  user_id]);
}


