import { RegisterHashtag,RegisterHashMiddles } from "../repositories/hashtag.repository.js";
import { insertPost } from "../repositories/post.repository.js"

export async function newPost(req, res) {
    const { description, link,hashtagsList } = req.body

    try {
        const { userId } = res.locals
        const obj = await insertPost(description, link,  userId)
        const idPost = obj.rows[0].id;
        const hashtagsId  = await RegisterHashtag(hashtagsList);
        await RegisterHashMiddles(hashtagsId, idPost);
        return res.sendStatus(201);

    } catch (err) {
        res.status(499).send(err.message)
    }
}