import { postsQuery, getUsersByUsernameDB, getUserPostByName, findNewPosts } from "../repositories/timeline.repository.js";
import { getMetadata } from "../middlewares/getMetadata.js";

export async function listPosts(req, res) {
  try {
    const { userId } = res.locals;
    const posts = await postsQuery(userId);

    if (posts.rowCount === 0) return res.status(200).send([]);
    for (let i = 0; i < posts.rowCount; i++) {
      let p = posts.rows[i];
      let meta = await getMetadata(p.link);
      p.linkMetadata = meta || {};
    }

    res.status(200).send(posts.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).send("An error occured while trying to fetch the posts, please refresh the page");
  }
}

export async function getUsersList(req, res) {
  const { username } = req.params;

  try {
    const usersFound = await getUsersByUsernameDB(username);

    return res.send(usersFound.rows).status(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUserPost(req, res) {
  const {id} = req.params;
  const { userId } = res.locals;

  try {
    const userFound = await getUserPostByName(id, userId);

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

  try {
    const newPostsCount = await findNewPosts(postId);

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