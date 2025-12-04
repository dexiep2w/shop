import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  // Yorum ekleme
  if (req.method === "POST") {
    const { text } = JSON.parse(req.body);

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Yorum boş olamaz." });
    }

    const comment = {
      text,
      date: new Date().toISOString()
    };

    await kv.lpush("comments", JSON.stringify(comment));

    return res.status(200).json({ message: "Yorum kaydedildi." });
  }

  // Yorumları listeleme
  if (req.method === "GET") {
    const items = await kv.lrange("comments", 0, -1);
    const comments = items.map((i) => JSON.parse(i));
    return res.status(200).json(comments);
  }

  res.status(405).json({ error: "Method not allowed" });
}
