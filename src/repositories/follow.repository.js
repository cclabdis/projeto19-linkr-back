import { db } from "../database/database.connection.js";

export async function getSameFollowInfosDB(id){
    const select = await db.query(`
    SELECT 
        id,
        photo,
        username 
    FROM users 
    WHERE id = $1;`
    ,[id]);
    return select.rows[0];
}

export async function getFollowInfosDB(requestId, targetId){
    const select = await db.query(`
    SELECT 
        id,
        photo,
        username,
        EXISTS (SELECT 1 FROM followers WHERE target_id = $1 AND follower_id = $2) AS "isFollowing"
    FROM users
    WHERE id = $1;`
    ,[targetId, requestId]);
    return select.rows[0];
}