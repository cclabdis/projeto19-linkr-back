import { getMetadata } from "../middlewares/getMetadata.js";
import { RegisterHashtag, getTrendingsDB, selectPostsFromHashtag } from "../repositories/hashtag.repository.js";

export async function getTrendings(req,res){
    try{
        const hashtags = await getTrendingsDB();
        return res.send(hashtags);
    }catch(err){
        return res.status(500).send(err.message);
    }
}

export async function getPostsByHashtag(req, res, limit){
    try{
        const {userId} = res.locals;
        const {hashtag} = req.params;
        const limit = req.headers.limit;

        let lista = await selectPostsFromHashtag(hashtag,userId, limit);
        for(let i =0; i<lista.length; i++){
            let meta = await getMetadata(lista[i].link);
            lista[i] = {...lista[i], linkMetadata:meta||{}};
        }
        return res.send(lista);
    }catch(err){
        console.log(err);
        return res.status(500).send(err.message);
    }
}
