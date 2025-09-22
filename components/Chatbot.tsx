
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { marked } from 'marked';
import { PRODUCTS_DATA } from '../constants';
import { SendIcon, TrashIcon } from './Icons';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  sources?: { uri: string; title: string }[];
}

interface ChatbotProps {
  promptFromProduct?: string;
  onPromptHandled?: () => void;
}

const CHAT_HISTORY_KEY = 'adeslas-chat-history';
const defaultMessage: Message = { 
  sender: 'bot', 
  text: 'Hola! Soy tu asistente virtual de Adeslas. ¿Cómo puedo ayudarte a entender nuestros productos o buscar información relevante?' 
};

const Chatbot: React.FC<ChatbotProps> = ({ promptFromProduct, onPromptHandled }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          return parsedHistory;
        }
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
      localStorage.removeItem(CHAT_HISTORY_KEY);
    }
    return [defaultMessage];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save chat history to localStorage", error);
    }
  }, [messages]);

  const handleSendMessage = async (prompt: string) => {
    if (prompt.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage, { sender: 'bot', text: '' }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const productInfo = JSON.stringify(PRODUCTS_DATA, null, 2);
      
      const systemInstruction = `Eres un asistente experto en los seguros de salud de SegurCaixa Adeslas. Tu objetivo es ayudar a los usuarios a entender los productos y ofrecer consejos de retención.

Tienes dos fuentes de información:
1.  **Datos Internos del Producto (tu fuente principal):** Un conjunto de datos JSON con información detallada sobre los productos de Adeslas. Debes usar esto como tu única fuente para responder preguntas sobre características, ventajas, limitaciones, precios, comparaciones entre productos de Adeslas y argumentos de retención.
2.  **Búsqueda en Google (fuente secundaria):** Puedes usar la búsqueda para responder preguntas que no se pueden contestar con los datos internos. Esto incluye:
    *   Preguntas sobre eventos actuales o noticias.
    *   Comparaciones con productos de otras compañías de seguros.
    *   Dudas generales sobre salud o terminología de seguros que no estén definidas en los datos.

**Reglas Importantes:**
*   **Prioriza los datos internos:** Siempre busca la respuesta en el JSON de productos primero.
*   **Sé transparente:** Cuando uses la Búsqueda de Google, siempre debes citar tus fuentes.
*   **Para comparaciones:** Si se te pide comparar productos de Adeslas, enfócate en las diferencias clave para ayudar al usuario a decidir.
*   **Para retención:** Si un usuario pregunta sobre un cliente que quiere cancelar, usa los "defenseArguments" del producto para dar consejos de retención sólidos.

La información de los productos es: \n\n${productInfo}`;

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          tools: [{googleSearch: {}}],
        }
      });
      
      let combinedText = '';
      const combinedSources = new Map<string, { uri: string; title: string }>();

      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        if (chunkText) {
          combinedText += chunkText;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = combinedText;
            return newMessages;
          });
        }
        
        const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        for (const gChunk of groundingChunks) {
            if (gChunk.web && gChunk.web.uri && gChunk.web.title) {
                // FIX: Create a new object that matches the required type '{ uri: string; title: string; }'.
                // The properties on `gChunk.web` are optional, so we must construct a new object
                // after confirming the required properties exist.
                combinedSources.set(gChunk.web.uri, { uri: gChunk.web.uri, title: gChunk.web.title });
            }
        }
      }

      const finalSources = Array.from(combinedSources.values());
      if (finalSources.length > 0) {
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].sources = finalSources;
            return newMessages;
        });
      }

    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      const errorMessage: Message = { sender: 'bot', text: 'Lo siento, he tenido un problema para procesar tu solicitud. Por favor, inténtalo de nuevo.' };
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = errorMessage;
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClearHistory = () => {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setMessages([defaultMessage]);
  };

  const submitUserInput = () => {
    handleSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitUserInput();
    }
  };

  useEffect(() => {
    if (promptFromProduct && onPromptHandled) {
      handleSendMessage(promptFromProduct);
      onPromptHandled();
    }
  }, [promptFromProduct]);


  return (
    <div className="bg-white rounded-2xl shadow-lg flex flex-col border border-gray-200/80 overflow-hidden h-[calc(100vh-10rem)] max-h-[700px]">
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0">
        <h3 className="font-bold text-lg text-gray-800">Asistente Virtual</h3>
        <button
          onClick={handleClearHistory}
          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:hover:text-gray-400"
          aria-label="Borrar historial"
          title="Borrar historial"
          disabled={messages.length <= 1 && messages[0]?.text === defaultMessage.text}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl shadow-sm text-sm md:text-base ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
              {msg.sender === 'bot' ? (
                msg.text ? (
                    <div 
                        className="prose-styles" 
                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.text, { breaks: true, gfm: true }) }}
                    />
                ) : (
                    <div className="flex items-center space-x-1.5">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                )
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-500 mb-1.5">Fuentes:</h4>
                  <ul className="space-y-1">
                    {msg.sources.map((source, i) => (
                      <li key={i}>
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline truncate block"
                          title={source.title}
                        >
                          {i + 1}. {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta..."
            className="w-full py-2.5 pl-4 pr-12 bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            disabled={isLoading}
          />
          <button
            onClick={submitUserInput}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:scale-100 transition-all transform active:scale-95"
            disabled={isLoading || inputValue.trim() === ''}
            aria-label="Enviar mensaje"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
