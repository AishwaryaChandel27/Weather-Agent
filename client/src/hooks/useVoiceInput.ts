import { useState, useEffect, useRef, useCallback } from "react";

interface VoiceInputOptions {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

export function useVoiceInput({
  onResult,
  onError,
  continuous = true,
  interimResults = true,
  language = "en-US",
}: VoiceInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.lang = language;
        
        recognition.onstart = () => {
          setIsListening(true);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.onresult = (event) => {
          let finalTranscript = "";
          let currentInterimTranscript = "";
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              currentInterimTranscript += result[0].transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript(finalTranscript);
            onResult(finalTranscript);
          }
          
          setInterimTranscript(currentInterimTranscript);
        };
        
        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          onError?.(event.error);
        };
      }
    }
  }, [continuous, interimResults, language, onResult, onError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
  };
}

// Extend the Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
