import { db } from "../database/database.connection.js"

export async function CreateCommentaryDB(postId, userId,comment){
    const create = await db.query(`
        INSERT INTO comments 
            (comment, post_id, user_id) 
        VALUES 
            ($1,$2,$3)
        RETURNING *;`
        ,[comment, postId,userId]);
    return create;
}

export async function SelectCommentaryDB(postId, viewId){
    const select = await db.query(`
        SELECT
            c.id AS "comment_id",
            c.user_id,
            c.comment AS comment,
            u.photo AS user_photo,
            u.mail AS user_mail,
            u.username,
            author.id AS author_id,
            CASE WHEN c.user_id = author.id THEN true ELSE false END AS user_is_author,
            EXISTS (SELECT 1 FROM followers WHERE follower_id=$2 AND target_id = c.user_id) AS following
        FROM comments AS c
        JOIN users u ON u.id= c.user_id
        JOIN posts p ON p.id = c.post_id
        LEFT JOIN users author ON author.id = p.user_id
        LEFT JOIN followers ON target_id = c.user_id AND follower_id = $2
        WHERE post_id = $1;
    `,[postId, viewId]);
    return select.rows;
}