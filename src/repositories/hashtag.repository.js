import { db } from "../database/database.connection.js";

export async function getTrendingsDB(){
    const select =  await db.query(`
    SELECT 
        h.id, 
        h.hashtag, 
        COUNT(rel.hashtag_id) AS appearances 
    FROM hashtags AS h 
    JOIN hashMiddle as rel 
        ON rel.hashtag_id = h.id 
    GROUP BY h.id 
    ORDER BY appearances DESC
    LIMIT 10;`);
    return select.rows;
}

export async function selectPostsFromHashtag(hashtag,userId, limit){
    const select = await db.query(`
    SELECT  
        h.hashtag,
        p.link,
        p.id,
        p.description,
        p.created_at,
        u.id AS posterId,
        u.username,
        u.photo,
        u.mail,
        (
            SELECT JSON_AGG (
                JSON_BUILD_OBJECT('user_id', ul.id, 'username', ul.username)
            )
            FROM likes lp
            JOIN users ul ON lp.user_id = ul.id
            WHERE lp.post_id = p.id
        ) AS likes_users,
        COUNT (l.post_id) AS like_count,
        ( SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count,
        ( SELECT COUNT(*) FROM repost rp WHERE rp.post_id = p.id) AS reposts_count,
        EXISTS (SELECT 1 FROM likes WHERE user_id = $2 AND post_id = p.id) AS has_liked
    FROM hashmiddle AS rel 
    JOIN hashtags as h 
        ON h.id = rel.hashtag_id 
    JOIN posts p 
        ON p.id = rel.post_id
    JOIN users u
        ON u.id = p.user_id
    LEFT JOIN likes l 
        ON l.post_id = p.id
    WHERE h.hashtag = $1
    GROUP BY p.id, u.username,posterId, u.photo, p.description, p.link, h.hashtag, u.mail
    ORDER BY P.id DESC
    LIMIT $3
    ;`,[hashtag,userId, limit]);
    return select.rows;
}

export async function RegisterHashtag(hashtagsList){
    const resp = [];
    const promises = hashtagsList.map(async (el)=>{
        const hashtag = el.replace('#',''); 
        const select = await db.query(`SELECT * FROM hashtags WHERE hashtag=$1;`,[hashtag]);
        let created_id = [];
        if(!select.rows[0]) created_id =  await db.query(`INSERT INTO hashtags (hashtag) VALUES($1) RETURNING *;`,[hashtag]);
        const hashtagId =  select.rows[0]?.id || created_id.rows[0]?.id;
        return hashtagId;
    })
    const listaHashtags = await Promise.all(promises);
    return listaHashtags;
}

export async function RegisterHashMiddles(hashtagsId, postId){
    const respIds = [];
    const promises = hashtagsId.map(async (id)=>{
        const insert = await db.query(`INSERT INTO hashmiddle(post_id, hashtag_id) VALUES ($1,$2) RETURNING id;`,[postId,id]);
        respIds.push(insert.rows[0].id);
    });
    await Promise.all(promises);
    return respIds;
}


export async function getHashtags(postId) {
    const select = await db.query(`
    SELECT
        hs.id, 
        h.hashtag 
    FROM hashmiddle AS hs 
    JOIN hashtags h ON h.id = hs.hashtag_id
    WHERE post_id = $1;`, [postId]);
    return select.rows;
}

export async function deleteHashmiddle(id){
    await db.query('DELETE FROM hashmiddle WHERE id= $1',[id]);
}

export async function updatePostInDB(desc, id){
    const resp = await db.query(`
    UPDATE
        posts
    SET
        description = $1
    WHERE
        id = $2
    RETURNING *;`,[desc, id]);
    return resp.rows[0];
}