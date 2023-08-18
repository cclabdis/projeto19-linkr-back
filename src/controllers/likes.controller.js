import { addLike, removeLike } from "../repositories/likes.repository.js";

function likesController(req, res) {
    return async (action) => {
        const { postId } = req.params;
        const userId = res.locals.userId;

        if (!userId) return res.sendStatus(401);
        if (!postId) return res.sendStatus(404);

        try {
            switch (action) {
                case 'add':
                    await addLike(postId, userId)
                    return res.sendStatus(201);
                case 'remove':
                    await removeLike(postId, userId)
                    return res.sendStatus(204);
                default:
                    throw new Error("Invalid method");
            }
        } catch ({ message }) {
            if(message === "Not found") return res.status(404).send("Post not found");
            if(message === "Forbidden") return res.status(403).send("You cannot delete or like a post more than once.");

            res.sendStatus(500);
        }
    }
}

export default {
    postLike: (req, res) => (likesController(req, res))('add'),
    deleteLike: (req, res) => (likesController(req, res))('remove'),
};