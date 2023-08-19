import { checkPost, deletePostId, insertPost } from "../repositories/post.repository.js"

export async function newPost(req, res) {
    const { description, link } = req.body

    try {
        const { userId } = res.locals
        const user_id = userId.id
        await insertPost(description, link, user_id)
        res.sendStatus(201)

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
        res.status(500).send( `deu ruim`);
    }
}

