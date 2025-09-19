"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  AlertCircle,
  Settings,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface Message {
  id: string;
  text: string | any;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'portfolio' | 'profit_loss';
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
  type: 'portfolio';
  user: string;
  summary: {
    total_value: number;
    total_invested: number;
    profit_loss: number;
    profit_loss_percentage: number;
    total_holdings: number;
    status: 'profit' | 'loss';
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
    status: 'profit' | 'loss';
    icon_url?: string;
  }>;
}

interface ProfitLossData {
  type: 'profit_loss';
  user: string;
  performance: {
    total_invested: number;
    total_current_value: number;
    profit_loss: number;
    profit_loss_percentage: number;
    status: 'profit' | 'loss';
    performance_level: string;
    performance_message?: string;
    icon?: string;
    trend_icon?: string;
  };
  insights?: {
    is_outstanding: boolean;
    is_excellent: boolean;
    is_positive: boolean;
    is_significant_loss: boolean;
    is_normal_volatility: boolean;
    suggestion: string;
  };
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [showUserSettings, setShowUserSettings] = useState(false);
  
  const [currentUserName, setCurrentUserName] = useState("Alice");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = "https://xzfpv760-3070.inc1.devtunnels.ms/api";

  // Portfolio Component - Show ALL holdings
  const PortfolioView = ({ data }: { data: PortfolioData }) => {
    const { summary, holdings } = data;
    const isProfit = summary.status === 'profit';

    return (
      <div className="w-full max-w-sm bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-4">
          <div className={`p-2 rounded-full ${isProfit ? 'bg-green-100' : 'bg-red-100'}`}>
            {isProfit ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{data.user}'s Portfolio</h3>
            <p className="text-xs text-gray-500">{summary.total_holdings} assets</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-500">Total Value</p>
              <p className="font-semibold text-gray-900">${summary.total_value.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Invested</p>
              <p className="font-semibold text-gray-900">${summary.total_invested.toLocaleString()}</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-gray-100">
              <p className="text-gray-500">P&L</p>
              <div className="flex items-center space-x-2">
                <p className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                  {isProfit ? '+' : ''}${Math.abs(summary.profit_loss).toLocaleString()}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isProfit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {summary.profit_loss_percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ALL Holdings */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">All Holdings ({holdings.length})</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {holdings.map((holding, index) => (
              <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  {/* Crypto Icon */}
                  {holding.icon_url ? (
                    <img
                      src={holding.icon_url}
                      alt={holding.crypto}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                      {holding.crypto.charAt(0)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 text-sm">{holding.crypto}</p>
                      <p className="text-sm font-semibold text-gray-900">
                        ${holding.current_value.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {holding.amount} @ ${holding.current_price.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-1">
                        <span className={`text-xs ${
                          holding.status === 'profit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {holding.status === 'profit' ? '+' : ''}${Math.abs(holding.profit_loss).toLocaleString()}
                        </span>
                        <span className={`text-xs ${
                          holding.status === 'profit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ({holding.profit_loss_percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced P&L Component
  const ProfitLossView = ({ data }: { data: ProfitLossData }) => {
    const { performance, insights } = data;
    const isProfit = performance.status === 'profit';

    const getPerformanceMessage = (level: string, percentage: number) => {
      if (performance.performance_message) {
        return performance.performance_message;
      }
      
      switch (level) {
        case 'outstanding': return `🚀 Outstanding! ${percentage.toFixed(1)}% returns`;
        case 'excellent': return `🎯 Excellent! ${percentage.toFixed(1)}% gains`;
        case 'positive': return `📈 Positive returns of ${percentage.toFixed(1)}%`;
        case 'normal_volatility': return `📊 Normal market volatility (${Math.abs(percentage).toFixed(1)}% down)`;
        case 'moderate_loss': return `📉 Moderate loss of ${Math.abs(percentage).toFixed(1)}%`;
        case 'significant_loss': return `⚠️ Significant loss of ${Math.abs(percentage).toFixed(1)}%`;
        default: return `Portfolio ${isProfit ? 'up' : 'down'} ${Math.abs(percentage).toFixed(1)}%`;
      }
    };

    const getInsightCardStyle = () => {
      if (insights?.is_outstanding) return 'bg-green-50 border-green-200';
      if (insights?.is_excellent) return 'bg-blue-50 border-blue-200';
      if (insights?.is_positive) return 'bg-emerald-50 border-emerald-200';
      if (insights?.is_significant_loss) return 'bg-red-50 border-red-200';
      return 'bg-gray-50 border-gray-200';
    };

    return (
      <div className="w-full max-w-sm bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-4">
          <div className={`p-2 rounded-full ${isProfit ? 'bg-green-100' : 'bg-red-100'}`}>
            {isProfit ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{data.user}'s Performance</h3>
            <p className="text-xs text-gray-500 capitalize">{performance.performance_level.replace('_', ' ')}</p>
          </div>
          <div className="ml-auto">
            <span className="text-2xl">
              {performance.icon || (isProfit ? '🟢' : '🔴')}
            </span>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Total Invested</p>
              <p className="font-semibold text-gray-900">${performance.total_invested.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Current Value</p>
              <p className="font-semibold text-gray-900">${performance.total_current_value.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-3">
            <p className="text-gray-500 text-xs mb-2">Net P&L</p>
            <div className="flex items-center justify-between">
              <p className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {isProfit ? '+' : ''}${Math.abs(performance.profit_loss).toLocaleString()}
              </p>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                isProfit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {performance.profit_loss_percentage.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Performance Message */}
          <div className={`rounded-lg p-3 border ${getInsightCardStyle()}`}>
            <p className="text-sm font-medium text-gray-700">
              {getPerformanceMessage(performance.performance_level, performance.profit_loss_percentage)}
            </p>
          </div>

          {/* Investment Suggestion */}
          {insights?.suggestion && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 text-sm">💡</span>
                <div>
                  <p className="text-xs font-medium text-blue-800 mb-1">Investment Insight:</p>
                  <p className="text-xs text-blue-700">{insights.suggestion}</p>
                </div>
              </div>
            </div>
          )}

          {/* Performance Indicators */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {insights?.is_outstanding && (
              <div className="bg-green-100 px-2 py-1 rounded-full text-center">
                <span className="text-xs font-medium text-green-700">Outstanding</span>
              </div>
            )}
            {insights?.is_excellent && (
              <div className="bg-blue-100 px-2 py-1 rounded-full text-center">
                <span className="text-xs font-medium text-blue-700">Excellent</span>
              </div>
            )}
            {insights?.is_positive && (
              <div className="bg-emerald-100 px-2 py-1 rounded-full text-center">
                <span className="text-xs font-medium text-emerald-700">Positive</span>
              </div>
            )}
            {insights?.is_significant_loss && (
              <div className="bg-red-100 px-2 py-1 rounded-full text-center">
                <span className="text-xs font-medium text-red-700">High Loss</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Check if message content is JSON
  const isJsonMessage = (content: any): boolean => {
    return typeof content === 'object' && content !== null && (content.type === 'portfolio' || content.type === 'profit_loss');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadWelcomeMessage();
    }
  }, [isOpen]);

  const loadWelcomeMessage = async () => {
    try {
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
        type: 'text',
      };

      setMessages([welcomeMessage]);
      setIsConnected(true);
      setError(null);
    } catch (error) {
      console.error("Error loading welcome message:", error);
      const fallbackMessage: Message = {
        id: "welcome-fallback",
        text: `Hi **${currentUserName}**! 👋 I'm your **KoinBX Crypto Bot**. I can help you with:\n\n💰 **Your Portfolio** - Check balance, P&L, holdings\n📈 **Market Data** - Latest crypto prices\n🔍 **Crypto Info** - Learn about blockchain\n\nTry: "show my portfolio" or "what's Bitcoin's price?"\n\nHow can I help you today?`,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages([fallbackMessage]);
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
      type: 'text',
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

      if (currentUserName) {
        requestBody.userName = currentUserName;
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

      // Determine message type based on response
      let messageType: 'text' | 'portfolio' | 'profit_loss' = 'text';
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

      let errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again later.";

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          errorMessage = "Authentication error. Please check the API configuration.";
        } else if (error.message.includes("429")) {
          errorMessage = "Too many requests. Please wait a moment before trying again.";
        } else if (error.message.includes("500")) {
          errorMessage = "Server error. Our team has been notified. Please try again later.";
        }
        setError(error.message);
      }

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
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

  const retryConnection = async () => {
    setError(null);
    await loadWelcomeMessage();
  };

  const clearConversation = async () => {
    if (sessionId) {
      try {
        await fetch(`${API_BASE_URL}/chat/clear/${sessionId}`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Error clearing conversation:", error);
      }
    }
    setMessages([]);
    setSessionId("");
    await loadWelcomeMessage();
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickActions = [
    { text: "Show my portfolio", emoji: "💰" },
    { text: "Show my profit/loss", emoji: "📈" },
    { text: "Bitcoin price", emoji: "₿" },
    { text: "Market trends", emoji: "📊" },
  ];

  const handleQuickAction = (action: string) => {
    setInputText(action);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* User Settings Modal */}
      {showUserSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="font-semibold mb-4">User Settings (Temporary)</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name:</label>
              <select
                value={currentUserName}
                onChange={(e) => setCurrentUserName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Charlie">Charlie</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowUserSettings(false);
                  clearConversation();
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save & Refresh
              </button>
              <button
                onClick={() => setShowUserSettings(false)}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-gray-700 hover:text-gray-900 p-4 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center relative">
            <MessageCircle size={20} className="text-white" />
            {!isConnected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold">KoinBX Assistant</div>
            <div className="text-xs text-gray-500">
              {isConnected ? `Hi ${currentUserName.split(' ')[0]}!` : "Connection issue"}
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ${
            isMinimized ? "w-80 h-16" : "w-96 h-[800px]"
          } flex flex-col`}
        >
          {/* Header */}
          <div className="bg-white p-4 rounded-t-2xl flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center relative">
                <Bot size={20} className="text-white" />
                {!isConnected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  KoinBX Crypto Bot
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span>
                    {isConnected
                      ? `${currentUserName.split(' ')[0]} • Online`
                      : "Connection issue"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowUserSettings(true)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                title="User Settings"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Error Banner */}
              {error && (
                <div className="bg-red-50 border-b border-red-100 p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-xs text-red-700">Connection issue</span>
                  </div>
                  <button
                    onClick={retryConnection}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Quick actions:</div>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.text}
                        onClick={() => handleQuickAction(action.text)}
                        className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1 rounded-full transition-colors"
                      >
                        {action.emoji} {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chat-bubble flex items-end space-x-2 ${
                      message.isUser ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        message.isUser ? "bg-blue-600" : "bg-gray-100"
                      }`}
                    >
                      {message.isUser ? (
                        <User size={14} className="text-white" />
                      ) : (
                        <Bot size={14} className="text-gray-600" />
                      )}
                    </div>
                    <div className={`flex flex-col ${message.type !== 'text' ? 'max-w-none' : 'max-w-[280px]'}`}>
                      <div
                        className={`${message.type === 'text' ? 'px-4 py-3' : 'p-0'} rounded-2xl text-sm leading-relaxed ${
                          message.isUser
                            ? "bg-blue-600 text-white rounded-br-md"
                            : message.type === 'text' 
                            ? "bg-gray-50 text-gray-800 rounded-bl-md"
                            : ""
                        }`}
                      >
                        {/* Render different content based on message type */}
                        {message.type === 'portfolio' && isJsonMessage(message.text) ? (
                          <PortfolioView data={message.text as PortfolioData} />
                        ) : message.type === 'profit_loss' && isJsonMessage(message.text) ? (
                          <ProfitLossView data={message.text as ProfitLossData} />
                        ) : (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-2 last:mb-0">{children}</p>
                              ),
                              strong: ({ children }) => (
                                <strong
                                  className={`font-semibold ${
                                    message.isUser ? "text-white" : "text-blue-600"
                                  }`}
                                >
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => <em className="italic">{children}</em>,
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside mb-2 space-y-1">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside mb-2 space-y-1">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => <li className="text-sm">{children}</li>,
                              code: ({ children }) => (
                                <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">
                                  {children}
                                </code>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-gray-300 pl-2 italic">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {typeof message.text === 'string' ? message.text : ''}
                          </ReactMarkdown>
                        )}
                      </div>
                      <div
                        className={`text-xs text-gray-400 mt-1 px-1 ${
                          message.isUser ? "text-right" : "text-left"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-end space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Bot size={14} className="text-gray-600" />
                    </div>
                    <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex space-x-3 items-end">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        isConnected
                          ? "Ask about your portfolio, crypto prices..."
                          : "Connection issue..."
                      }
                      disabled={isTyping}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping || !isConnected}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-sm"
                  >
                    <Send size={16} />
                  </button>
                </div>
                {!isConnected && (
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    Check your connection and try again
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-2 text-center">
                  Currently logged in as: <strong>{currentUserName}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
