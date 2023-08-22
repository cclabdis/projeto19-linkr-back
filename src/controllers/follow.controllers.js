import { getSameFollowInfosDB,getFollowInfosDB } from "../repositories/follow.repository.js";

export async function getFollowInfo(req,res){
    try{
        const followerId = parseInt(res.locals.userId);
        const targetId = parseInt(req.params.userId);
        let resp;
        if(followerId === targetId){
            resp = await getSameFollowInfosDB(followerId);
            resp = {...resp, isFolowing:false};
        } else {
            resp = await getFollowInfosDB(followerId, targetId);
        };
        return res.status(200).send(resp);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}