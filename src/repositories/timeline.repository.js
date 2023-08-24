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
                        p.created_at,
                        (
                            SELECT JSON_AGG (
                                JSON_BUILD_OBJECT('user_id', ul.id, 'username', ul.username)
                            )
                            FROM likes lp
                            JOIN users ul ON lp.user_id = ul.id
                            WHERE lp.post_id = p.id
                        ) AS likes_users,
                        COUNT (l.post_id) AS like_count,
                        EXISTS (SELECT 1 FROM likes WHERE user_id = $1 AND post_id = p.id) AS has_liked
                    FROM posts p
                    JOIN users u ON p.user_id = u.id
                    LEFT JOIN likes l ON l.post_id = p.id
                    GROUP BY p.id, u.username, u.photo, p.description, p.link, u.id
                    ORDER BY p.created_at DESC
                    LIMIT 10
                    `,
    [userId]
  );

}

export async function getUsersByUsernameDB(username,userId) {
  return db.query(`
  SELECT 
    users.id, 
    users.username, 
    users.photo,
    EXISTS (SELECT 1 FROM followers WHERE follower_id = $2 AND target_id = users.id) AS "isFollowing" 
  FROM users 
  WHERE 
    LOWER(username) LIKE LOWER($1)
  ORDER BY "isFollowing" DESC;`, 
  [username + "%",userId]);
}

export async function getUserPostByName(id, userId) {
  return db.query(
    `SELECT
                          u.username,
                          u.photo,
                          u.id AS user_id,
                          p.id,
                          p.description,
                          p.link,
                          COUNT (l.post_id) AS like_count,
                          EXISTS (SELECT 1 FROM likes WHERE user_id = $2 AND post_id = p.id) AS has_liked,
                          (
                            SELECT JSON_AGG (
                                JSON_BUILD_OBJECT('user_id', ul.id, 'username', ul.username)
                            )
                            FROM likes lp
                            JOIN users ul ON lp.user_id = ul.id
                            WHERE lp.post_id = p.id
                        ) AS likes_users
                      FROM posts p
                      JOIN users u ON p.user_id = u.id
                      LEFT JOIN likes l ON l.post_id = p.id
                      WHERE u.id = $1
                      GROUP BY p.id, u.username, u.photo, p.description, p.link, u.id
                      ORDER BY p.created_at DESC
                      LIMIT 20
                      `,
    [id, userId]
  );
};

export async function findNewPosts(id) {
  try {
    const newPosts = await db.query(
      `SELECT COUNT(*) FROM posts WHERE id > $1`, [id]
    );
    return newPosts.rows[0].count;
  } catch (err) {
    throw new Error(err);
  }
}