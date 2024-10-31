"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";

export const SupportChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { user: string; message: string }[]
  >([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { user: "Usuario", message: currentMessage },
      ]);
      setCurrentMessage("");
      // Simular respuesta del soporte
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            user: "Soporte",
            message:
              "Gracias por su mensaje. Un agente se pondrá en contacto con usted pronto.",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isChatOpen ? (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="rounded-full w-16 h-16 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80">
          <CardHeader className="flex flex-row items-center">
            <CardTitle>Chat de Soporte</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsChatOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto mb-4 space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.user === "Usuario" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg p-2 max-w-[80%] ${
                      msg.user === "Usuario"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
              <Textarea
                placeholder="Escribe tu mensaje..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="resize-none"
              />
              <Button type="submit">Enviar</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
