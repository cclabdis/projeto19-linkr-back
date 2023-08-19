import { db } from "../database/database.connection.js";

export async function postsQuery(userId) {
  return db.query(`SELECT 
                        u.username,
                        u.photo,
                        u.id AS user_id,
                        p.id,
                        p.description,
                        p.link,
                        COUNT (l.post_id) AS like_count,
                        EXISTS (SELECT 1 FROM likes WHERE user_id = $1 AND post_id = p.id) AS has_liked
                    FROM posts p 
                    JOIN users u ON p.user_id = u.id
                    LEFT JOIN likes l ON l.post_id = p.id
                    GROUP BY p.id, u.username, u.photo, p.description, p.link, u.id
                    ORDER BY p.created_at DESC
                    LIMIT 20
                    `,[userId])
}
//JEFTI: Eu adicionei as linhas 10,11, 14 e 15 para incluir as informações sobre os likes a resposta.