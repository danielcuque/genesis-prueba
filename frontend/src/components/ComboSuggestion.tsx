import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ComboSuggestion: React.FC = () => {
  const [people, setPeople] = useState(10);
  const [suggestion, setSuggestion] = useState('');
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5053';

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

 
  const handleGenerate = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/llm/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ People: people }),
      });

      if (!res.ok) throw new Error('Error al generar sugerencia');
      const data = await res.text();
      setSuggestion(data);
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al generar la sugerencia.');
    }
  };

 
  const toggleRecording = () => {
    console.log('Browser supports:', browserSupportsSpeechRecognition);
    if (!browserSupportsSpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, language: 'es-ES' });
    }
  };

 
  const sendVoiceToLLM = async (voiceText: string) => {
    try {
      console.log('Enviando a LLM:', voiceText);
      const res = await fetch(`${API_BASE}/api/llm/voice-suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ VoiceText: voiceText }),
      });

      if (!res.ok) throw new Error('Error en voice-suggest');
      const data = await res.text();
      setSuggestion(data);
    } catch (error) {
      console.error(error);
      alert('Error al enviar la voz al servidor.');
    } finally {
      resetTranscript();
    }
  };

  useEffect(() => {
    if (!listening && transcript.trim()) {
      console.log('Reconocimiento finalizado, transcript:', transcript);
      sendVoiceToLLM(transcript.trim());
    }
  }, [listening]); 

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
            onChange={(e) => setPeople(Number(e.target.value))}
            placeholder="Número de personas"
            min="1"
            className="w-32"
          />

          {/* Botón de grabar con animación tipo ChatGPT */}
          <Button
            onClick={toggleRecording}
            className={`transition-all duration-300 flex items-center gap-3 ${
              listening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-black'
            }`}
          >
            {listening ? (
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-[3px]">
                  <span className="w-[3px] h-2 bg-white rounded animate-wave1"></span>
                  <span className="w-[3px] h-3 bg-white rounded animate-wave2"></span>
                  <span className="w-[3px] h-4 bg-white rounded animate-wave3"></span>
                  <span className="w-[3px] h-3 bg-white rounded animate-wave2"></span>
                  <span className="w-[3px] h-2 bg-white rounded animate-wave1"></span>
                </div>
                <span>Detener</span>
              </div>
            ) : (
              <>
                🎤 <span>Grabar Voz</span>
              </>
            )}
          </Button>

          <Button onClick={handleGenerate}>Generar Sugerencia</Button>
        </div>

        {transcript && (
          <p className="text-sm text-gray-600">🗣️ Transcripción: {transcript}</p>
        )}

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
