import { RegisterHashtag,RegisterHashMiddles } from "../repositories/hashtag.repository.js";
import { insertPost } from "../repositories/post.repository.js"
import { checkPost, deletePostId, insertPost } from "../repositories/post.repository.js"


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

export async function deletePost(req, res) {

    const { id } = req.params

    try {
        const check = await checkPost(id)
        if (check.rowCount === 0) return res.sendStatus(404)

        await deletePostId(id)
        res.status(204).send("Excluido com sucesso")

    } catch (err) {
        res.status(500).send(err.message);
    }
}

