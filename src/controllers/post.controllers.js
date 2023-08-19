import ManipulateHashtags from "../middlewares/manipulateHashtags.js";
import { RegisterHashtag,RegisterHashMiddles, updatePostInDB } from "../repositories/hashtag.repository.js";
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
        return res.status(204).send("Excluido com sucesso")

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updatePost(req, res){
    try{
        const {id} = req.params;
        const {userId} = res.locals;
        const {description, hashtagsList} = req.body;
        const post = await checkPost(id);
        if (post.rowCount === 0) return res.sendStatus(404);
        if (post.rows[0].user_id !== userId) return res.sendStatus(401);
        const CleanHashtags = hashtagsList.map((el)=>{return el.replace('#','')});
        await ManipulateHashtags(CleanHashtags, id);
        const newPost = await updatePostInDB(description, id);
        return res.send(newPost).status(200);

    }catch(err){
        return res.status(500).send(err.message);
    }
}