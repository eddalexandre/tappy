import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    // 1. Pega o ID da URL (ex: ?id=b01)
    const { id } = req.query;

    // 2. Se não enviou ID, manda para o seu site principal
    if (!id) {
        return res.redirect('https://seusite.com'); 
    }

    try {
        // 3. Conecta ao Redis usando as variáveis que a Vercel criou pra você
        const kv = createClient({
            url: process.env.TAPPY_REST_API_URL,
            token: process.env.TAPPY_REST_API_TOKEN,
        });

        // 4. Busca o link de destino no banco de dados
        const destination = await kv.get(id);

        // 5. Se o link existir no banco, redireciona. Se não, manda para uma página de erro ou home.
        if (destination) {
            return res.redirect(302, destination);
        } else {
            return res.status(404).send("Link não encontrado para este banco.");
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).send("Erro ao conectar com o banco de dados.");
    }
}
