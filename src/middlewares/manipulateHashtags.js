import { RegisterHashMiddles, RegisterHashtag, deleteHashmiddle, getHashtags } from "../repositories/hashtag.repository.js";


export default async function ManipulateHashtags(newHashtagsList, postId){
    const oldHashtagsList = await getHashtags(postId);
    let createList = [...newHashtagsList];
    for(let i=0; i<oldHashtagsList.length; i++){
        if (! newHashtagsList.includes(oldHashtagsList[i].hashtag)){
            await deleteHashmiddle(oldHashtagsList[i].id);
        } else {
            const rmvIndex = createList.indexOf(oldHashtagsList[i].hashtag);
            createList.splice(rmvIndex,1);
        }
    }
    const hashtagsId = await RegisterHashtag(createList);
    await RegisterHashMiddles(hashtagsId, postId);
}