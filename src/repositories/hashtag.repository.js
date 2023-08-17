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
    ORDER BY appearances 
    LIMIT 10;`);
    return select.rows;
}

export async function selectPostsFromHashtag(hashtag){
    const select = await db.query(`
    SELECT  
        h.hashtag,
        p.link,
        p.description,
        p.created_at,
        u.username,
        u.photo,
        u.mail    
    FROM hashmiddle AS rel 
    JOIN hashtags as h 
        ON h.id = rel.hashtag_id 
    JOIN posts p 
        ON p.id = rel.post_id
    JOIN users u
        ON u.id = p.user_id 
    WHERE h.hashtag = $1
    ORDER BY p.created_at;`,[hashtag]);
    return select.rows;
}

export async function RegisterHashtag(text){
    const hashtagRegex = /#(\w+)/g; //regex para retirar apenas as hashtags
    const hashtags = text.match(hashtagRegex); //váriavel que recebe a comparação do texto com a regex que foi criada
    const hashtagsUnique = hashtags.filter((el,i)=>{return (hashtags.indexOf(el)===i) });
    const promises = hashtagsUnique.map(async (el)=>{
        const hashtag = el.slice(1); 
        const select = await db.query(`SELECT * FROM hashtags WHERE hashtag=$1;`,[hashtag]);
        let created_id = [];
        if(!select.rows[0]) created_id =  await db.query(`INSERT INTO hashtags (hashtag) VALUES($1) RETURNING *;`,[hashtag]);
        return select.rows[0] || created_id.rows[0];
    })
    const listaHashtags = await Promise.all(promises);
    return listaHashtags;
}