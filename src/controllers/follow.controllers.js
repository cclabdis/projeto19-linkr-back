import { getSameFollowInfosDB,getFollowInfosDB, CheckFollowSituationDB, CreateFollowRelation, DeleteFollowRelation } from "../repositories/follow.repository.js";

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
        if (resp.username === null) resp.username = 'undefined';
        return res.status(200).send(resp);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function followUser(req,res){
    try{
        const followerId = parseInt(res.locals.userId);
        const targetId = parseInt(req.params.userId);
        if(followerId === targetId) return res.status(403).send('Não é permitido um usuario seguir ele mesmo!');    
        const checkFollow = await CheckFollowSituationDB(followerId, targetId);
        if(checkFollow ===  undefined){
            const DBresp = await CreateFollowRelation(followerId, targetId);
            return res.send(DBresp);
        } else {
            const DBresp = await DeleteFollowRelation(followerId, targetId);
            return res.send(DBresp);
        }
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}
