// app/api/chat/route.js

export const runtime = 'edge';

export async function POST(req) {
  const body = await req.json();
  const { messages } = body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // ✅ SET THE MODEL HERE
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'No response from AI.';
    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ reply: 'Error connecting to OpenAI.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

