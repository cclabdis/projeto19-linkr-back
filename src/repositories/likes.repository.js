import { db } from "../database/database.connection.js";

class PostLikes {
    #postId;
    #userId;
    constructor(postId, userId) {
        this.#postId = postId;
        this.#userId = userId;
    }

    async #findLike() {
        return (await db.query(`
            SELECT 1 FROM likes
            WHERE user_id=$1 AND post_id=$2;
        `, [this.#userId, this.#postId]))
            .rowCount !== 0;
    }

    async #findPost() {
        return (await db.query(`
            SELECT 1 FROM posts
            WHERE id=$1;
        `, [this.#postId]))
            .rowCount !== 0;
    }

    static async retrieveAllLikes() {
        try {
            return (await db.query(`
                SELECT * FROM likes;
            `)).rows;
        } catch (err) {
            throw new Error(err);
        }
    }

    static async retrievePostsAndLikes() {
        try {
            return (await db.query(`
                SELECT posts.*, COUNT(likes.*) as likes
                FROM posts JOIN likes
                ON likes.post_id=posts.id
                GROUP BY posts.id;
            `, [])).rows;
        } catch (err) {
            throw new Error(err);
        }
    }

    async add() {
        try {
            if(!(await this.#findPost()))
                throw "Not found";
            if(await this.#findLike())
                throw "Forbidden";
            await db.query(`
                INSERT INTO likes (post_id, user_id)
                VALUES ($1, $2);
            `, [this.#postId, this.#userId]);
        } catch (err) {
            throw new Error(err);
        }
    }

    async remove() {
        try {
            if(!(await this.#findPost()))
                throw "Not found";
            if (!(await this.#findLike()))
                throw  "Forbidden";
            await db.query(`
                DELETE FROM likes
                WHERE post_id=$1 AND user_id=$2;
            `, [this.#postId, this.#userId]);
        } catch (err) {
            throw new Error(err);
        }
    }
}

export const addLike = async (postId, userId) =>
new PostLikes(postId, userId).add();

export const removeLike = async (postId, userId) =>
new PostLikes(postId, userId).remove();

/**
 *
 * @param {string} postId optional (needed to instantiate)
 * @param {string} userId optional (needed to instantiate)
 * @returns {method} An instance of PostLikes can add or remove a like from a post based on the userId
 */
export default PostLikes;