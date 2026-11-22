export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { niche, topic } = req.body;

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a viral YouTube Shorts & Instagram Reels creator. Write a punchy, high-retention 45-second faceless video script with a strong 3-second hook and scene-by-scene visual cues.'
          },
          {
            role: 'user',
            content: `Niche: ${niche}. Topic: ${topic}. Write the complete script ready for voiceover.`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const script = data.choices?.[0]?.message?.content;

    if (!script) {
      return res.status(500).json({ error: 'NVIDIA API did not return a script' });
    }

    return res.status(200).json({ script });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to NVIDIA API' });
  }
}
