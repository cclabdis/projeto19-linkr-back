import { db } from "../database/database.connection.js";

export async function postsQuery() {
  return db.query(`SELECT 
                        u.user_id,
                        u.photo,
                        p.description,
                        p.link
                    FROM posts p 
                    JOIN users u ON p.user_id = u.id
                    ORDER BY p.created_at DESC
                    LIMIT 20
                    `)
}