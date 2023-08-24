import { CreateCommentaryDB, SelectCommentaryDB } from "../repositories/comments.repository.js";

export async function registerComment(req,res){
    try{
        const {userId} = res.locals;
        const {comment} = req.body;
        const {postId} = req.params;
        const create = await CreateCommentaryDB(postId, userId,comment);
        return res.send(create);
    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);        
    }
}

export async function getComments(req, res){
    try{
        const {userId} = res.locals;
        const {postId} = req.params;
        const select = await SelectCommentaryDB(postId);
        return res.send(select);
    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);        
    }
}