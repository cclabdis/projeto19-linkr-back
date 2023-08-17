import { postsQuery } from "../repositories/timeline.repository.js";
import { getMetadata } from "../middlewares/getMetadata.js";
import urlMetadata from "url-metadata";

export async function listPosts(req, res) {
    try {
        const posts = await postsQuery();
        if (posts.rowCount === 0) return res.status(200).send("There are no posts yet");

        for(let i=0; i<posts.rowCount; i++){
            let p = posts.rows[i];
            let meta = await getMetadata(p.link);

            p.linkMetadata = meta;
        }

        res.status(200).send(posts.rows);
    } catch (err) {
        console.log(err);
        return res.status(500).send("An error occured while trying to fetch the posts, please refresh the page");
    }
}