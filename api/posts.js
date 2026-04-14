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
                    // MUDANÇA AQUI:
                    "Content-Type": "text/plain;charset=utf-8" 
                },
                body: JSON.stringify(req.body)
            });

            // O Google costuma fazer um redirecionamento (302) após o POST.
            // Se o JSON falhar, pegamos o texto puro para evitar que a Vercel quebre.
            let data;
            const textResponse = await response.text();
            try {
                data = JSON.parse(textResponse);
            } catch (e) {
                data = { msg: textResponse };
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