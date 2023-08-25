import { addRepost, removeRepost } from "../repositories/repost.repository.js"

function repostController(req, res) {
    return async (action) => {
        const postId = req.body.postId;
        const userId = res.locals.userId;

        if (!userId) return res.sendStatus(401);
        if (!postId) return res.sendStatus(404);

        try {
            switch (action) {
                case 'add':
                    await addRepost(postId, userId);
                    return res.sendStatus(201);
                case 'remove':
                    await removeRepost(postId, userId);
                    return res.sendStatus(204);
                default:
                    throw new Error("Invalid method");
            }
        } catch ({ message }) {
            if (message === "Not found") return res.status(404).send("Post not found");

            res.sendStatus(500);
        }
    };
}

export default {
    postRepost: (req, res) => repostController(req, res)('add'),
};