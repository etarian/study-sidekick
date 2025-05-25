'use client';

import { useState } from 'react';

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('General');
  const [mode, setMode] = useState('Explain');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const contextPrompt = `You are a helpful AI Homework Helper. The subject is ${subject}. Your mode is ${mode === 'Explain' ? 'Explain step by step' : 'Just give the answer clearly'}.`;

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'system', content: contextPrompt }, ...newMessages],
      }),
    });

    const data = await response.json();
    setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  if (!started) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-6 leading-tight">
          📘 Meet Your <span className="text-blue-600">Study Sidekick</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Your personal AI-powered homework helper. Ask questions. Get clear answers. Learn faster.
        </p>

        <ul className="text-gray-600 text-left mb-10 mx-auto max-w-md space-y-2">
          <li>✅ Step-by-step help</li>
          <li>✅ Choose your subject</li>
          <li>✅ Explain or just answer mode</li>
        </ul>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg transition duration-300"
          onClick={() => setStarted(true)}
        >
          Start Learning ➜
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>📘</span> StudySidekick
      </h1>

      <div className="mb-4 flex gap-2">
        <select value={subject} onChange={e => setSubject(e.target.value)} className="border p-2 rounded">
          <option>General</option>
          <option>Math</option>
          <option>Science</option>
          <option>History</option>
          <option>English</option>
        </select>
        <select value={mode} onChange={e => setMode(e.target.value)} className="border p-2 rounded">
          <option>Explain</option>
          <option>Answer</option>
        </select>
      </div>

      <div className="border h-64 overflow-y-scroll p-2 mb-4 bg-white rounded shadow">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-blue-600' : 'text-green-700'}`}>
            <strong>{msg.role === 'user' ? 'You' : 'StudySidekick'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <p className="italic">StudySidekick is thinking...</p>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="border flex-1 p-2 rounded"
          placeholder="Ask your homework question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}


