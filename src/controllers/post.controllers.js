import { insertPost } from "../repositories/post.repository.js"

export async function newPost(req, res) {
    const { description, link } = req.body

    try {
        const { userId } = res.locals
        console.log(res.locals)
        const user_id = userId.id
        await insertPost(description, link,  user_id)
        res.sendStatus(201)

    } catch (err) {
        res.status(499).send(err.message)
    }
}