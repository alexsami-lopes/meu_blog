let posts = [];

export default function handler(req, res) {
    if (req.method === "PUT") {
        const { action, author, message } = req.body;

        if (action !== "put") {
            return res.status(400).json({ msg: "Ação inválida" });
        }

        posts.push({ author, message });

        return res.status(200).json({ msg: "Post salvo!" });
    }

    if (req.method === "GET") {
        return res.status(200).json(posts);
    }

    return res.status(405).end();
}