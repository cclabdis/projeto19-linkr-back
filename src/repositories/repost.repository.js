import { db } from "../database/database.connection.js";

class PostReposts {
    #postId;
    #userId;
    constructor(postId, userId) {
        this.#postId = postId;
        this.#userId = userId;
    }

    async #findRepost() {
        return (await db.query(`
            SELECT 1 FROM repost
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

    async add() {
        try {
            if (!(await this.#findPost()))
                throw "Not found";
            if (await this.#findRepost())
                throw "Forbidden";
            await db.query(`
                INSERT INTO repost (post_id, user_id)
                VALUES ($1, $2);
            `, [this.#postId, this.#userId]);
        } catch (err) {
            throw new Error(err);
        }
    }

    async remove() {
        try {
            if (!(await this.#findPost()))
                throw "Not found";
            if (!(await this.#findRepost()))
                throw "Forbidden";
            await db.query(`
                DELETE FROM repost
                WHERE post_id=$1 AND user_id=$2;
            `, [this.#postId, this.#userId]);
        } catch (err) {
            throw new Error(err);
        }
    }
}

export const addRepost = async (postId, userId) =>
    new PostReposts(postId, userId).add();

export const removeRepost = async (postId, userId) =>
    new PostReposts(postId, userId).remove();

/**
 *
 * @param {string} postId optional (needed to instantiate)
 * @param {string} userId optional (needed to instantiate)
 * @returns {method} An instance of PostReposts can add or remove a repost from a post based on the userId
 */
export default PostReposts;