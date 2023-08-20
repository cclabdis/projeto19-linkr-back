import { db } from "../database/database.connection.js";

export async function postsQuery(userId) {
  return db.query(
    `SELECT 
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
                    `,
    [userId]
  );
}

export function getUsersByUsernameDB(username) {
  return db.query(`SELECT users.id, users.username, users.photo FROM users WHERE LOWER(username) LIKE LOWER($1);`, [username + "%"]);
}

export async function getUserPostByName(username, userId) {
  return db.query(
    `SELECT 
                          u.username,
                          u.photo,
                          u.id AS user_id,
                          p.id,
                          p.description,
                          p.link,
                          COUNT (l.post_id) AS like_count,
                          EXISTS (SELECT 1 FROM likes WHERE user_id = $2 AND post_id = p.id) AS has_liked
                      FROM posts p 
                      JOIN users u ON p.user_id = u.id
                      LEFT JOIN likes l ON l.post_id = p.id
                      WHERE LOWER(u.username) = LOWER($1)
                      GROUP BY p.id, u.username, u.photo, p.description, p.link, u.id
                      ORDER BY p.created_at DESC
                      LIMIT 20
                      `,
    [username, userId]
  );
}
