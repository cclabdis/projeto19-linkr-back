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

export async function selectPostsFromHashtag(hashtag,userId){
    const select = await db.query(`
    SELECT  
        h.hashtag,
        p.link,
        p.description,
        p.created_at,
        u.username,
        u.photo,
        u.mail,
        COUNT (l.post_id) AS like_count,
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
    GROUP BY p.id, u.username, u.photo, p.description, p.link, h.hashtag, u.mail
    ORDER BY P.id DESC
    LIMIT 20
    ;`,[hashtag,userId]);
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