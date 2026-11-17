import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  HelpCircle,
  Compass,
  CloudRain,
  ShieldAlert,
  Coins,
  Utensils,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChatCopilot } from './hooks';
import type { TripWithDetails, AIChatMessage } from '@waylo/shared';

interface AICopilotDrawerProps {
  trip: TripWithDetails | any;
}

const DEFAULT_PROMPTS = [
  '🌤️ What’s the riding weather forecast?',
  '🍽️ Recommend top local restaurants',
  '🎒 Any critical gear I should not forget?',
  '💰 Check our trip budget & split advice',
  '🛡️ Route hazards & riding safety tips',
];

export function AICopilotDrawer({ trip }: AICopilotDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const chatMutation = useChatCopilot();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your **Waylo AI Travel Copilot** for **${trip?.name || 'your expedition'}**. Ask me about riding advisories, weather checks, scenic detours, or packing recommendations!`,
    },
  ]);

  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_PROMPTS);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || chatMutation.isPending) return;

    const userMsg: AIChatMessage = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');

    try {
      const response = await chatMutation.mutateAsync({
        message: text.trim(),
        history: updatedMessages.slice(-6),
        tripId: trip?.id,
        tripContext: {
          destination: trip?.destination,
          origin: trip?.startLocation,
          name: trip?.name,
          tripType: trip?.tripType,
          budget: trip?.estimatedBudget,
        },
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.message },
      ]);

      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I ran into an error while retrieving advice. Please try asking again!',
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Action Button Launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-blue-500/30 group"
        >
          <div className="relative">
            <Sparkles className="h-4 w-4 animate-spin group-hover:rotate-45 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
            </span>
          </div>
          <span>AI Copilot</span>
        </button>
      )}

      {/* Slide-over Drawer / Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col rounded-3xl bg-card border border-border/80 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">Waylo Travel Copilot</h4>
                <p className="text-[10px] text-sky-100 font-medium">
                  {trip?.destination || 'Contextual Expedition AI'}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-xl h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
            {messages.map((m, idx) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="h-7 w-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                      isUser
                        ? 'bg-primary text-white rounded-tr-xs font-medium'
                        : 'bg-muted/70 text-foreground border border-border/60 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {m.content}
                  </div>

                  {isUser && (
                    <div className="h-7 w-7 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                      <UserIcon className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {chatMutation.isPending && (
              <div className="flex items-center gap-2 text-muted-foreground italic text-xs pl-9">
                <Sparkles className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Copilot is drafting advice...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-muted/40 border-t border-border/50 shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {suggestions.slice(0, 4).map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(s)}
                  className="px-2.5 py-1 rounded-xl bg-card border border-border/80 text-[11px] font-medium text-foreground hover:bg-primary hover:text-white shrink-0 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-card border-t border-border/80 flex items-center gap-2 shrink-0"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Copilot about stops, food, weather..."
              className="rounded-xl text-xs font-medium"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputMessage.trim() || chatMutation.isPending}
              className="rounded-xl shrink-0 bg-primary text-white hover:bg-primary/90 h-9 w-9"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
