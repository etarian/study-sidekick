// app/api/chat/route.js


export const runtime = 'edge';

export async function POST(req) {
  const body = await req.json();
  const { messages } = body;

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ reply: 'Missing OpenAI API key.' }),
      { status: 500 }
    );
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    if (!data.choices || !data.choices[0]) {
      console.error('OpenAI returned no choices:', data);
      return new Response(
        JSON.stringify({ reply: 'No response from AI.' }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ reply: data.choices[0].message.content }),
      { status: 200 }
    );
  } catch (error) {
    console.error('OpenAI fetch error:', error);
    return new Response(
      JSON.stringify({ reply: 'OpenAI API error.' }),
      { status: 500 }
    );
  }
}

