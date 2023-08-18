import { db } from "../database/database.connection.js";

export async function postsQuery() {
  return db.query(`SELECT 
                        u.username,
                        u.photo,
                        p.id,
                        p.description,
                        p.link,
                        COUNT (l.post_id) AS like_count,
                        EXISTS (SELECT 1 FROM likes WHERE user_id = 1 AND post_id = p.id) AS has_liked
                    FROM posts p 
                    JOIN users u ON p.user_id = u.id
                    LEFT JOIN likes l ON l.post_id = p.id
                    GROUP BY p.id, u.username, u.photo, p.description, p.link
                    ORDER BY p.created_at DESC
                    LIMIT 20
                    `)
}

export async function likeInformation(){
  // return await db.query(`SELECT * 
  //                   FROM posts AS p 
  //                   JOIN likes l ON l.post_id = p.id 
  //                   WHERE p.id = $1;`
  // ,[post_id]);

  const resp = await db.query(`SELECT * FROM likes;`);
  return resp.rows;
}