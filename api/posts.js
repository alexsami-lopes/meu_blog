export default async function handler(req, res) {
    const url = process.env.GSHEET_URL;

    try {
        // ===== GET =====
        if (req.method === "GET") {
            const response = await fetch(url);
            const data = await response.json();
            return res.status(200).json(data);
        }

        // ===== POST =====
        if (req.method === "POST") {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req.body)
            });

            const data = await response.json();

            // Se o limite do Apps Script foi atingido, ele pode retornar erro 429 ou uma msg específica
            if (data.erro === "Limite diário atingido") {
                 return res.status(429).json(data);
            }

            return res.status(200).json(data);
        }

        // Se não for GET nem POST
        return res.status(405).json({ erro: "Método não permitido. Use GET ou POST." });

    } catch (err) {
        return res.status(500).json({
            erro: "Erro ao acessar Google Sheets",
            detalhe: err.message
        });
    }
}