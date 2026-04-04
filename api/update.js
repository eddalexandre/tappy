import { Redis } from 'ioredis';

export default async function handler(req, res) {
    const urlObj = new URL(req.url, `https://${req.headers.host}`);
    const id = urlObj.searchParams.get('id');
    const destinationUrl = urlObj.searchParams.get('url');

    if (!id || !destinationUrl) {
        return res.status(400).json({ error: "ID e URL sao obrigatorios" });
    }

    const redis = new Redis(process.env.TAPPY_REDIS_URL);

    try {
        await redis.set(id, destinationUrl);
        await redis.quit();
        return res.status(200).json({ status: "success" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
