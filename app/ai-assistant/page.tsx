'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, MessageCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { fetchFromApi } from '@/lib/api';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const exampleQuestions = [
    t('aiAssistant.whichAppsViolate'),
    t('aiAssistant.complianceScore'),
    t('aiAssistant.howToFix'),
    t('aiAssistant.whichAppsStoreOutside'),
  ];

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Call AI API
    try {
      const response = await fetchFromApi('/ai-assistant/chat', {
        method: 'POST',
        body: JSON.stringify({ message: messageText }),
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: t('aiAssistant.error') || 'Sorry, I am unable to process your request at the moment.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold text-foreground">{t('aiAssistant.title')}</h1>
          </div>
          <p className="text-muted-foreground">{t('aiAssistant.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Chat Interface */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 bg-card border-border p-6 flex flex-col overflow-hidden">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground text-sm">{t('aiAssistant.subtitle')}</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${message.type === 'user'
                          ? 'bg-accent text-white rounded-br-none'
                          : 'bg-secondary text-foreground rounded-bl-none'
                          }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary text-foreground px-4 py-2 rounded-lg rounded-bl-none">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !loading) {
                      handleSendMessage();
                    }
                  }}
                  placeholder={t('aiAssistant.inputPlaceholder')}
                  disabled={loading}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !input.trim()}
                  className="bg-accent hover:bg-accent/90 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Context Panel */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Company Data */}
            <Card className="bg-card border-border p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent" />
                {t('aiAssistant.context')}
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">SaaS Apps</p>
                  <p className="text-foreground font-semibold">47</p>
                </div>
                <div>
                  <p className="text-muted-foreground">PDPL Rules</p>
                  <p className="text-foreground font-semibold">52</p>
                </div>
              </div>
            </Card>

            {/* Example Questions */}
            <Card className="bg-card border-border p-4">
              <h3 className="font-semibold text-foreground mb-3">{t('aiAssistant.exampleQuestions')}</h3>
              <div className="space-y-2">
                {exampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    onClick={() => handleExampleQuestion(question)}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3 text-xs border-border hover:bg-secondary"
                    disabled={loading}
                  >
                    <span className="text-muted-foreground">{question}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
