import { postsQuery, getUsersByUsernameDB, getUserPostByName, findNewPosts } from "../repositories/timeline.repository.js";
import { getMetadata } from "../middlewares/getMetadata.js";
import { checkFollow } from "../repositories/follow.repository.js";

export async function listPosts(req, res) {
  try {
    const { userId } = res.locals;
    const limit = req.headers.limit;
   
    const posts = await postsQuery(userId, limit);
    if (posts.length === 0){ 
      const list = await checkFollow(userId);
      if(list.length === 0) return res.status(200).send([{message:`You don't follow anyone yet. Search for new friends!`}]);
      return res.status(200).send([{message:`No posts found from your friends.`}]);
    };
    for (let i = 0; i < posts.length; i++) {
      let p = posts[i];
      let meta = await getMetadata(p.link);
      p.linkMetadata = meta || {};
    }
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).send("An error occured while trying to fetch the posts, please refresh the page");
  }
}

export async function getUsersList(req, res) {
  const { username } = req.params;
  const { userId } = res.locals;
  try {
    const usersFound = await getUsersByUsernameDB(username,userId);
    return res.send(usersFound.rows).status(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUserPost(req, res) {
  const {id} = req.params;
  const { userId } = res.locals;
  const limit = req.headers.limit;

  try {
    const userFound = await getUserPostByName(id, userId, limit);

    let userFoundPosts = userFound.rows;

    for (let i = 0; i < userFoundPosts.length; i++) {
      let meta = await getMetadata(userFoundPosts[i].link);
      userFoundPosts[i] = { ...userFoundPosts[i], linkMetadata: meta || {} };
    }

    return res.send(userFoundPosts).status(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export const getNewPosts = async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals;

  try {
    const newPostsCount = await findNewPosts(userId, postId);

    if(newPostsCount > 0) {
      res.status(200).send(newPostsCount);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}