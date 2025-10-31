import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ComboSuggestion: React.FC = () => {
  const [people, setPeople] = useState(10);
  const [suggestion, setSuggestion] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
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

  const toggleRecording = () => {
    if (isRecording) {
      // Detener grabación
      setIsRecording(false);
      if (transcript) {
        sendVoiceToLLM(transcript);
      }
    } else {
      // Iniciar grabación
      startRecording();
    }
  };

  const startRecording = () => {
    if (!(window as any).webkitSpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Error de reconocimiento:', event.error);
      setIsRecording(false);
      alert('Error en reconocimiento de voz: ' + event.error);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Error al iniciar reconocimiento:', error);
      alert('No se pudo iniciar el reconocimiento de voz.');
    }
  };

  const sendVoiceToLLM = async (voiceText: string) => {
    const res = await fetch(`${API_BASE}/api/llm/voice-suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ VoiceText: voiceText })
    });
    const data = await res.text();
    setSuggestion(data);
    setTranscript('');
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Sugerencias de Combos con IA</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          ¿Cuántas personas? Nuestra IA te sugiere combos personalizados basados en tradiciones guatemaltecas.
        </p>

        <div className="flex gap-2 mb-4 items-center">
          <Input
            type="number"
            value={people}
            onChange={e => setPeople(Number(e.target.value))}
            placeholder="Número de personas"
            min="1"
            className="w-32"
          />

          {/* Botón de grabar estilo ChatGPT */}
          <Button
            onClick={toggleRecording}
            className={`transition-all duration-300 flex items-center gap-2 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-black'
            }`}
          >
            <span
              className={`h-3 w-3 rounded-full ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            {isRecording ? 'Detener Grabación' : 'Grabar Voz'}
          </Button>

          <Button onClick={handleGenerate}>Generar Sugerencia</Button>
        </div>

        {transcript && <p className="text-sm text-gray-600">🗣️ Transcripción: {transcript}</p>}

        {suggestion && (
          <div className="p-4 bg-gray-50 rounded whitespace-pre-line mt-4">
            {suggestion}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComboSuggestion;
