// /api/comments.js
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, comment } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ error: 'Name and comment are required' });
    }

    // Yorumları "comments" listesine ekle
    await redis.lpush('comments', JSON.stringify({ name, comment, date: new Date().toISOString() }));

    return res.status(201).json({ message: 'Comment added' });
  }

  if (req.method === 'GET') {
    // Son 100 yorumu getir
    const comments = await redis.lrange('comments', 0, 99);
    const parsedComments = comments.map(c => JSON.parse(c));
    return res.status(200).json(parsedComments);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
