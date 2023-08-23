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

export async function CheckFollowSituationDB(requestId, targetId){
    const select = await db.query(`
    SELECT 
        *
    FROM followers
    WHERE target_id = $1 AND follower_id = $2;`
    ,[targetId, requestId]);
    return select.rows[0];
}

export async function CreateFollowRelation(requestId, targetId){
    const createdId = await db.query(`
        INSERT INTO followers (target_id,follower_id)
        VALUES(
            $1,            
            $2
        )
        RETURNING id;
    `,[targetId, requestId])
    if(createdId.rows[0]){
        return true;
    }
    else {
        return {erro:"Não conseguiu criar uma relação de seguidor no banco, tente novamente mais tarde!"};
    }
}

export async function DeleteFollowRelation(requestId, targetId){
    const deleteResult = await db.query(`
    DELETE FROM followers 
    WHERE 
        target_id= $1 AND 
        follower_id=$2;`,
    [targetId,requestId]);
    if (deleteResult.rowCount > 0) {
        return false;
    } else {
        return {erro:"Não conseguiu deletar a relação de seguidor no banco, tente novamente mais tarde!"};
    }
}