const LIMITE = 100;

// cache em memória (pode resetar, mas ajuda)
let contador = 0;
let dataAtual = new Date().toDateString();

function checarLimite() {
    const hoje = new Date().toDateString();

    if (hoje !== dataAtual) {
        dataAtual = hoje;
        contador = 0;
    }

    if (contador >= LIMITE) {
        return false;
    }

    contador++;
    return true;
}

export default async function handler(req, res) {
    const url = process.env.GSHEET_URL;

    // 🔥 controle de limite
    if (!checarLimite()) {
        return res.status(429).json({
            erro: "Limite diário de 100 requisições atingido"
        });
    }

    try {
        // ===== GET =====
        if (req.method === "GET") {
            const response = await fetch(url);
            const data = await response.json();

            return res.status(200).json(data);
        }

        // ===== PUT =====
        if (req.method === "PUT") {
            const response = await fetch(url, {
                method: "POST", // Apps Script usa POST
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req.body)
            });

            const data = await response.json();

            return res.status(200).json(data);
        }

        return res.status(405).end();

    } catch (err) {
        return res.status(500).json({
            erro: "Erro ao acessar Google Sheets",
            detalhe: err.message
        });
    }
}