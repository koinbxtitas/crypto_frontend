"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import {
  Send,
  User,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  text: string | any;
  isUser: boolean;
  timestamp: Date;
  type?: "text" | "portfolio"; // Removed profit_loss type
}

interface ApiResponse {
  id: string;
  message: string | any;
  timestamp: string;
  model: string;
  sessionId?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface PortfolioData {
  type: "portfolio";
  user: string;
  summary: {
    total_value: number;
    total_invested: number;
    profit_loss: number;
    profit_loss_percentage: number;
    total_holdings: number;
    status: "profit" | "loss";
  };
  holdings: Array<{
    crypto: string;
    amount: number;
    buy_price: number;
    current_price: number;
    current_value: number;
    invested_value: number;
    profit_loss: number;
    profit_loss_percentage: number;
    status: "profit" | "loss";
    icon_url?: string;
  }>;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // const API_BASE_URL = "http://172.188.32.111:3070/api";
  const API_BASE_URL = "http://localhost:3070/api";

  // Suggested prompts always shown
  const suggestedPrompts = [
    "What is KoinBX?",
    "How to register in KoinBX?",
    "How to do KYC in KoinBX?",
    "How to verify bank account in KoinBX?",
    "Price of Bitcoin in INR?",
    "Trending cryptos",
    "Best crypto to buy?",
  ];

  // User Avatar Component (only icon, no username text)
  const UserAvatar = ({
    size = 40,
    className = "",
  }: {
    size?: number;
    className?: string;
  }) => (
    <div
      className={`rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      <User size={size * 0.6} />
    </div>
  );

  const PortfolioView = ({ data }: { data: PortfolioData }) => {
    const { summary, holdings } = data;
    const isProfit = summary.status === "profit";

    return (
      <div className="w-full">
        <div className="w-xl bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center space-x-4 mb-6">
            <div
              className={`p-3 rounded-full flex-shrink-0 ${
                isProfit ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {isProfit ? (
                <TrendingUp className="w-6 h-6 text-green-700" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-700" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 text-lg truncate">
                {data.user}'s Portfolio
              </h3>
              <p className="text-sm text-gray-600">
                {summary.total_holdings} assets
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <div className="grid grid-cols-2 gap-6 text-sm min-w-0">
              <div className="min-w-0">
                <p className="text-gray-600 mb-2">Total Value</p>
                <p className="font-bold text-gray-900 text-xl break-words">
                  ${summary.total_value.toLocaleString()}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-gray-600 mb-2">Invested</p>
                <p className="font-bold text-gray-900 text-xl break-words">
                  ${summary.total_invested.toLocaleString()}
                </p>
              </div>
              <div className="col-span-2 pt-4 border-t border-gray-200 min-w-0">
                <p className="text-gray-600 mb-2">P&L</p>
                <div className="flex items-center space-x-3 flex-wrap">
                  <p
                    className={`font-bold text-xl break-words ${
                      isProfit ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isProfit ? "+" : ""}$
                    {Math.abs(summary.profit_loss).toLocaleString()}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${
                      isProfit
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {summary.profit_loss_percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 min-w-0">
            <h4 className="text-lg font-semibold text-gray-900">
              Holdings ({holdings.length})
            </h4>
            <div className="max-h-64 overflow-y-auto space-y-3 custom-scrollbar min-w-0">
              {holdings.slice(0, 3).map((holding, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-w-0"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    {holding.icon_url ? (
                      <img
                        src={holding.icon_url}
                        alt={holding.crypto}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 flex-shrink-0">
                        {holding.crypto.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {holding.crypto}
                        </p>
                        <p className="text-sm font-bold text-gray-900 flex-shrink-0 ml-2">
                          ${holding.current_value.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">
                          {holding.amount} @ $
                          {holding.current_price.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <span
                            className={`text-sm font-medium ${
                              holding.status === "profit"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {holding.status === "profit" ? "+" : ""}$
                            {Math.abs(holding.profit_loss).toLocaleString()}
                          </span>
                          <span
                            className={`text-sm ${
                              holding.status === "profit"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            ({holding.profit_loss_percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {holdings.length > 3 && (
                <div className="text-center">
                  <span className="text-gray-600 text-sm">
                    +{holdings.length - 3} more assets
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const isJsonMessage = (content: any): boolean => {
    return (
      typeof content === "object" &&
      content !== null &&
      content.type === "portfolio"
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadWelcomeMessage();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 200) + "px";
    }
  }, [inputText]);

  const loadWelcomeMessage = async () => {
    try {
      // Add disclaimer message first
      const disclaimerMessage: Message = {
        id: "disclaimer",
        text: "**Disclaimer:** Cryptocurrency investments carry significant risk and high volatility. Past performance does not guarantee future results. The information provided by this bot is for educational purposes only and should not be considered as financial or investment advice. Always conduct thorough research (DYOR) before making any investment decisions. Never invest more than you can afford to lose. Consider consulting with financial professionals for personalized guidance. KoinBX does not guarantee profits or outcomes from trading or investing in digital assets.",
        isUser: false,
        timestamp: new Date(),
        type: "text",
      };

      const response = await fetch(`${API_BASE_URL}/chat/welcome`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      const welcomeMessage: Message = {
        id: data.id,
        text: data.message,
        isUser: false,
        timestamp: new Date(data.timestamp),
        type: "text",
      };

      // Set disclaimer first, then welcome message
      setMessages([disclaimerMessage, welcomeMessage]);
      setIsConnected(true);
      setError(null);
    } catch (error) {
      console.error("Error loading welcome message:", error);

      const disclaimerMessage: Message = {
        id: "disclaimer",
        text: "**Disclaimer:** Cryptocurrency investments carry significant risk and high volatility. Past performance does not guarantee future results. The information provided by this bot is for educational purposes only and should not be considered as financial or investment advice. Always conduct thorough research (DYOR) before making any investment decisions. Never invest more than you can afford to lose. Consider consulting with financial professionals for personalized guidance. KoinBX does not guarantee profits or outcomes from trading or investing in digital assets.",
        isUser: false,
        timestamp: new Date(),
        type: "text",
      };

      const fallbackMessage: Message = {
        id: "welcome-fallback",
        text: `Hi! 👋 I'm your **KoinBX Crypto Assistant**. I can help you with:\n\n💰 **Your Portfolio** - Check balance, holdings\n📈 **Market Data** - Latest crypto prices\n🔍 **Crypto Info** - Learn about blockchain\n\nTry: "show my portfolio" or "what's Bitcoin's price?"\n\nHow can I help you today?`,
        isUser: false,
        timestamp: new Date(),
        type: "text",
      };

      setMessages([disclaimerMessage, fallbackMessage]);
      setIsConnected(false);
      setError("Connection issue. Using offline mode.");
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputText;
    setInputText("");
    setIsTyping(true);
    setError(null);

    try {
      const requestBody: any = {
        message: messageText,
      };

      if (sessionId) {
        requestBody.sessionId = sessionId;
      }

      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data: ApiResponse = await response.json();

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      let messageType: "text" | "portfolio" = "text";
      if (isJsonMessage(data.message)) {
        messageType = data.message.type;
      }

      const botResponse: Message = {
        id: data.id,
        text: data.message,
        isUser: false,
        timestamp: new Date(data.timestamp),
        type: messageType,
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsConnected(true);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsConnected(false);

      let errorMessage =
        "I'm sorry, I'm having trouble connecting right now. Please try again later.";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage =
            "Authentication error. Please check the API configuration.";
        } else if (error.message.includes("429")) {
          errorMessage =
            "Too many requests. Please wait a moment before trying again.";
        } else if (error.message.includes("500")) {
          errorMessage =
            "Server error. Our team has been notified. Please try again later.";
        }
        setError(error.message);
      }

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePromptSelect = (prompt: string) => {
    setInputText(prompt);
    // Focus the textarea after selecting prompt
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Always show prompts, so no toggle needed

  return (
    <div
      className="h-screen flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-opacity-10 z-0"></div>

      {/* Header */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <Image src="/vercel.svg" alt="Assistant" width={36} height={36} />
            <div>
              <div className="font-semibold text-gray-900 text-lg">
                KoinBX Assistant
              </div>
              <div className="text-sm text-gray-600 flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span>{isConnected ? "Online" : "Connection issue"}</span>
              </div>
            </div>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Image
              src="/ainew.svg"
              alt="KoinBX Logo"
              width={120}
              height={40}
              className="h-12 w-auto"
              priority
            />
          </div>

          {/* Right Section - Removed username and avatar */}
          <div />
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-4 max-w-2xl relative ${
                  message.isUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  {message.isUser ? (
                    <UserAvatar className="shadow-sm" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Image
                        src="/vercel.svg"
                        alt="Assistant"
                        width={27}
                        height={27}
                        className="pt-1.5 pl-0.5"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 flex-1 max-w-2xl w-full">
                  <div
                    className={`rounded-2xl shadow-sm w-full relative ${
                      message.isUser
                        ? "bg-blue-600 text-white p-4"
                        : "bg-white/95 backdrop-blur-sm text-gray-900 p-4 border border-gray-200"
                    }`}
                  >
                    {/* AI logo for assistant bubbles */}
                    {!message.isUser && (
                      <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full overflow-hidden">
                        <Image
                          src="/ai.png"
                          alt="AI"
                          width={20}
                          height={20}
                          quality={100}
                          priority
                        />
                      </div>
                    )}

                    {message.type === "portfolio" &&
                    isJsonMessage(message.text) ? (
                      <div className="w-full">
                        <PortfolioView data={message.text as PortfolioData} />
                      </div>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-3 last:mb-0 leading-relaxed">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong
                              className={`font-semibold ${
                                message.isUser
                                  ? "text-blue-100"
                                  : "text-blue-700"
                              }`}
                            >
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-3 space-y-1 pl-4">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-3 space-y-1 pl-4">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          code: ({ children }) => (
                            <code
                              className={`px-2 py-1 rounded-md text-sm font-mono ${
                                message.isUser
                                  ? "bg-blue-500 text-blue-100"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {typeof message.text === "string" ? message.text : ""}
                      </ReactMarkdown>
                    )}
                  </div>
                  <div
                    className={`text-xs text-white/70 px-2 ${
                      message.isUser ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-4 max-w-2xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm relative">
                  <Image
                    src="/vercel.svg"
                    alt="Assistant"
                    width={27}
                    height={27}
                    className="pt-1.5 pl-0.5"
                  />

                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm shadow-sm border border-gray-200 p-4 rounded-2xl">
                  <div className="text-gray-500 text-sm">
                    Assistant is typing...
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10">
        {/* Suggestion bubbles always visible */}
        <div className="w-full px-6 mt-4 mb-1">
          <div className="flex flex-wrap gap-3 justify-center animate-in slide-in-from-bottom duration-300">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptSelect(prompt)}
                className="px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 rounded-full text-sm border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md transform hover:scale-105 animate-in zoom-in duration-200"
                style={{
                  animationDelay: `${index * 50}ms`,
                  transformOrigin: "center center",
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Disclaimer Text with Exclamation Icon */}
        <div className="w-full flex items-center justify-center pt-2 px-6 mb-0 text-gray-700 text-xs select-none">
          <AlertCircle className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
          <span>
            This content is generated by AI, may be inaccurate at times, and
            should not be considered financial advice.
          </span>
        </div>

        {/* Input container */}
      <div className="p-3">
  <div className="max-w-4xl mx-auto">
    <div className="relative flex items-end">
      <textarea
        ref={inputRef}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={
          isConnected
            ? "Ask me about your portfolio, crypto prices, market trends..."
            : "Connection issue..."
        }
        disabled={isTyping}
        className="w-full min-h-[56px] max-h-[200px] overflow-hidden resize-none bg-white/95 backdrop-blur-sm border border-gray-300 rounded-3xl pl-6 py-4 pr-14 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed shadow-lg custom-scrollbar"
        rows={1}
      />
      <button
        onClick={handleSendMessage}
        disabled={!inputText.trim() || isTyping || !isConnected}
        className="absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-2xl transition-all shadow-sm hover:shadow-md flex-shrink-0"
      >
        <Send size={18} />
      </button>
    </div>
    {error && (
      <div className="text-sm text-red-600 mt-3 text-center bg-red-50/95 backdrop-blur-sm rounded-lg p-3 border border-red-200">
        {error}
      </div>
    )}
  </div>
</div>

      </div>

      {/* Custom CSS for animations and scrollbars */}
      <style jsx>{`
        /* Custom Scrollbar Styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* Animations */
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-in-from-bottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .zoom-in {
          animation-name: zoom-in;
        }

        .slide-in-from-bottom {
          animation-name: slide-in-from-bottom;
        }
      `}</style>
    </div>
  );
}
