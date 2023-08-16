import { getTrendingsDB } from "../repositories/hashtag.repository.js";

export async function getTrendings(req,res){
    try{
        const hashtags = await getTrendingsDB();
        return res.send(hashtags);
    }catch(err){
        return res.status(500).send(err.message);
    }
}