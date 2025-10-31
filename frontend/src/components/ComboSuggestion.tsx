import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ComboSuggestion: React.FC = () => {
  const [people, setPeople] = useState(10);
  const [suggestion, setSuggestion] = useState('');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5053';

  const handleGenerate = async () => {
    const res = await fetch(`${API_BASE}/api/llm/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ People: people })
    });
    const data = await res.text();
    setSuggestion(data);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Sugerencias de Combos con IA</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">¿Cuántas personas? Nuestra IA te sugiere combos personalizados basados en tradiciones guatemaltecas.</p>
        <div className="flex gap-2 mb-4">
          <Input
            type="number"
            value={people}
            onChange={e => setPeople(Number(e.target.value))}
            placeholder="Número de personas"
            min="1"
            className="w-32"
          />
          <Button onClick={handleGenerate}>Generar Sugerencia</Button>
        </div>
        {suggestion && (
          <div className="p-4 bg-gray-50 rounded whitespace-pre-line">
            {suggestion}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComboSuggestion;
