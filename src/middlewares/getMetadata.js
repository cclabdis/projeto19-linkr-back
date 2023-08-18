import { json } from "express";
import urlMetadata from "url-metadata";

export async function getMetadata(url) {
    try {
        const m = await urlMetadata(url)

        const meta = {"title": m[`og:title`],
                "description": m.description,
                "image": m['og:image']}

        return meta;
    } catch (error) {
        console.log(error)
    }
}