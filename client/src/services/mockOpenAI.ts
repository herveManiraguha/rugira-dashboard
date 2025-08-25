// Mock OpenAI service for AI assistant functionality
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  id: string;
  message: ChatMessage;
}

// Mock responses for trading bot assistance
const mockResponses = [
  "I can help you with your trading bot configuration. What specific aspect would you like assistance with?",
  "For optimal bot performance, I recommend reviewing your risk management settings. Would you like me to guide you through the risk parameters?",
  "Based on your question, here are some best practices for trading bot setup:\n\n1. Start with conservative risk settings\n2. Monitor performance regularly\n3. Use proper position sizing\n4. Set appropriate stop losses\n\nWould you like more details on any of these points?",
  "To troubleshoot bot issues, I'll need more information. Can you describe what specific problem you're experiencing?",
  "Great question! For strategy optimization, consider:\n\n• Backtesting with historical data\n• Monitoring key performance metrics\n• Adjusting parameters based on market conditions\n• Regular performance reviews\n\nWhat type of strategy are you working with?",
  "I can help you understand the compliance requirements for your trading operations. What specific compliance area interests you?",
  "For exchange integration, make sure you have:\n\n✓ Valid API keys\n✓ Proper permissions set\n✓ Network connectivity\n✓ Rate limit considerations\n\nWhich exchange are you trying to connect?",
];

// Simulate OpenAI chat completion
export class MockOpenAIService {
  private messageHistory: ChatMessage[] = [];

  async sendMessage(userMessage: string): Promise<ChatResponse> {
    // Add user message to history
    const userChatMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    this.messageHistory.push(userChatMessage);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Generate assistant response
    const responseContent = this.generateResponse(userMessage);
    const assistantMessage: ChatMessage = {
      id: `assistant_${Date.now()}`,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date(),
    };

    this.messageHistory.push(assistantMessage);

    return {
      id: assistantMessage.id,
      message: assistantMessage,
    };
  }

  private generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();

    // Context-aware responses
    if (message.includes('bot') && message.includes('not working')) {
      return "I understand you're having issues with your bot. Let me help you troubleshoot:\n\n1. Check if your API keys are valid and have the right permissions\n2. Verify your exchange connection status\n3. Review the bot logs for any error messages\n4. Ensure your strategy parameters are configured correctly\n\nWhich of these areas would you like to investigate first?";
    }

    if (message.includes('strategy') || message.includes('backtesting')) {
      return "For strategy development and backtesting:\n\n• Use sufficient historical data (at least 6 months)\n• Test across different market conditions\n• Consider transaction costs and slippage\n• Validate with out-of-sample data\n• Monitor key metrics like Sharpe ratio, max drawdown\n\nWhat specific strategy type are you working on?";
    }

    if (message.includes('risk') || message.includes('position')) {
      return "Risk management is crucial for successful trading. Here are key principles:\n\n🛡️ **Position Sizing**: Never risk more than 1-2% of capital per trade\n📊 **Diversification**: Spread risk across different assets\n⏹️ **Stop Losses**: Always define your exit points\n📈 **Risk-Reward Ratio**: Aim for at least 1:2 ratio\n\nWould you like me to help you set up specific risk parameters?";
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return "Hello! I'm your AI trading assistant. I can help you with:\n\n🤖 Bot configuration and troubleshooting\n📈 Strategy development and optimization\n⚙️ Risk management settings\n🔗 Exchange integrations\n📊 Performance analysis\n📋 Compliance guidance\n\nWhat would you like assistance with today?";
    }

    if (message.includes('performance') || message.includes('profit') || message.includes('loss')) {
      return "Let's analyze your bot performance. Key metrics to monitor:\n\n📊 **Total Return**: Overall profit/loss percentage\n📉 **Max Drawdown**: Largest peak-to-trough decline\n⚡ **Sharpe Ratio**: Risk-adjusted return measure\n🎯 **Win Rate**: Percentage of profitable trades\n💰 **Average Trade**: Mean profit per trade\n\nWould you like help interpreting any specific metrics?";
    }

    // Default to a random helpful response
    const randomIndex = Math.floor(Math.random() * mockResponses.length);
    return mockResponses[randomIndex];
  }

  getMessageHistory(): ChatMessage[] {
    return [...this.messageHistory];
  }

  clearHistory(): void {
    this.messageHistory = [];
  }
}

export const mockOpenAI = new MockOpenAIService();