import { getTrendingsDB, selectPostsFromHashtag } from "../repositories/hashtag.repository.js";

export async function getTrendings(req,res){
    try{
        const hashtags = await getTrendingsDB();
        return res.send(hashtags);
    }catch(err){
        return res.status(500).send(err.message);
    }
}

export async function getPostsByHashtag(req, res){
    try{
        const {hashtag} = req.params;
        const lista = await selectPostsFromHashtag(hashtag);
        return res.send(lista);
    }catch(err){
        return res.status(500).send(err.message);
    }
}