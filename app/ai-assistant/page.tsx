'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User } from 'lucide-react';
import { mockSaasApps } from '@/lib/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const exampleQuestions = [
  'Which apps store data outside Saudi Arabia?',
  "What's our overall compliance score?",
  'How to fix Slack compliance issues?',
  'Which apps are high risk?',
  'Show me cost optimization opportunities',
  'What are the PDPL requirements?',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your compliance assistant. I can help you understand your SaaS security posture, answer questions about regulations, and guide you through remediation steps. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (question: string = inputValue) => {
    if (!question.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let assistantResponse = '';

      if (question.toLowerCase().includes('data') && question.toLowerCase().includes('outside')) {
        assistantResponse = `Based on your connected applications, ${mockSaasApps
          .filter((app) => app.dataRegion !== 'KSA')
          .length} apps store data outside Saudi Arabia:\n\n${mockSaasApps
          .filter((app) => app.dataRegion !== 'KSA')
          .slice(0, 3)
          .map((app) => `• ${app.name} (${app.dataRegion})`)
          .join('\n')}\n\nThese violate PDPL requirements. I recommend migrating to GCC-compliant alternatives.`;
      } else if (question.toLowerCase().includes('compliance') && question.toLowerCase().includes('score')) {
        const avgScore = Math.round(
          mockSaasApps.reduce((sum, app) => sum + app.complianceScore, 0) / mockSaasApps.length
        );
        assistantResponse = `Your overall compliance score is ${avgScore}%. Here's the breakdown by regulation:\n\n• PDPL: 78%\n• SDAIA: 72%\n• NCA: 65%\n• CITC: 80%\n• SOC2: 88%\n\nTo improve, focus on data localization and encryption requirements.`;
      } else if (question.toLowerCase().includes('slack')) {
        assistantResponse = `Slack has critical compliance issues:\n\n1. Data Storage: Messages stored in US data centers (PDPL violation)\n2. Encryption: Missing end-to-end encryption for compliance\n3. Data Residency: No Saudi Arabia data center option\n\nRecommendations:\n• Consider migrating to Microsoft Teams which has KSA data centers\n• Or negotiate with Slack for dedicated GCC infrastructure\n• Implement additional encryption layer for sensitive data`;
      } else if (question.toLowerCase().includes('high risk')) {
        const highRiskApps = mockSaasApps.filter(
          (app) => app.riskLevel === 'high' || app.riskLevel === 'critical'
        );
        assistantResponse = `You have ${highRiskApps.length} high-risk applications:\n\n${highRiskApps
          .slice(0, 5)
          .map((app) => `• ${app.name} (${app.riskLevel.toUpperCase()})`)
          .join('\n')}\n\nThese require immediate attention. I recommend creating an action plan with specific remediation steps for each application.`;
      } else if (question.toLowerCase().includes('cost')) {
        const totalSpend = mockSaasApps.reduce((sum, app) => sum + app.monthlySpend, 0);
        const potentialSavings = Math.round(totalSpend * 0.15);
        assistantResponse = `Your current SaaS spend is SAR ${totalSpend.toLocaleString()} per month.\n\nOptimization opportunities:\n• Unused licenses: ~${potentialSavings} potential savings\n• Duplicate tools: Consolidate similar applications\n• Negotiated discounts: Available for 3+ year commitments\n• Cloud optimization: Review usage patterns\n\nPotential annual savings: SAR ${(potentialSavings * 12).toLocaleString()}`;
      } else if (question.toLowerCase().includes('pdpl')) {
        assistantResponse = `PDPL (Personal Data Protection Law) Key Requirements:\n\n1. Data Localization: All personal data must be stored in Saudi Arabia\n2. Security Standards: Implement appropriate security measures\n3. User Rights: Provide data access and deletion rights\n4. Consent: Obtain explicit consent for data processing\n5. Breach Notification: Report breaches within 72 hours\n\nYour compliance: 78% - Focus on data localization first`;
      } else {
        assistantResponse =
          'I can help with questions about:\n• Data compliance and regulations\n• Risk assessment of your applications\n• Cost optimization strategies\n• PDPL, SDAIA, and other local requirements\n• Remediation guidance\n\nWhat would you like to explore?';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <main className="flex-1 overflow-hidden flex gap-6 p-8">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 p-6 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-md p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-secondary text-foreground p-4 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border pt-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Ask me anything about compliance..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-primary hover:bg-primary/90 text-white px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Context Panel */}
        <div className="w-80 flex flex-col gap-6">
          {/* Using Data */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Context</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Using company data</p>
                <p className="text-lg font-bold text-foreground">{mockSaasApps.length} apps</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">PDPL Rules Loaded</p>
                <p className="text-lg font-bold text-foreground">52 requirements</p>
              </div>
            </div>
          </Card>

          {/* Example Questions */}
          <Card className="p-6 flex-1 flex flex-col">
            <h3 className="font-semibold text-foreground mb-4">Example Questions</h3>
            <div className="space-y-2 flex-1">
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  disabled={isLoading}
                  className="w-full text-left p-2 rounded-lg hover:bg-secondary text-sm text-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  <p className="text-xs text-muted-foreground mb-1">→</p>
                  <p>{question}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
