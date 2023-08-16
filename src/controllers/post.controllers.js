import { insertPost } from "../repositories/post.repository"

export async function newPost(req, res) {
    const { description, link } = req.body

    try {
        const { userId } = res.locals
        const username = userId.id
        await insertPost(description, link,  username)
        res.sendStatus(201)

    } catch (err) {
        res.status(499).send(err.message)
    }
}