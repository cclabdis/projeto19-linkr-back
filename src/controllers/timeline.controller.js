import { postsQuery, getUsersByUsernameDB } from "../repositories/timeline.repository.js";
import { getMetadata } from "../middlewares/getMetadata.js";

export async function listPosts(req, res) {
  try {
    const { userId } = res.locals;
    const posts = await postsQuery(userId);

    if (posts.rowCount === 0) return res.status(200).send("There are no posts yet");
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
