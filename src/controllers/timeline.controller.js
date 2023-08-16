import { postsQuery } from "../repositories/timeline.repository.js";

export async function listPosts(req, res) {
    try {
        const posts = await postsQuery();
        if (posts.rowCount !== 0) return res.status(200).send("There are no posts yet");

        res.status(200).send(posts.rows);
    } catch (err) {
        console.log(err);
        return res.status(500).send("An error occured while trying to fetch the posts, please refresh the page");
    }
}