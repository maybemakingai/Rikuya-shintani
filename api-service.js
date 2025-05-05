class AIService {
    constructor() {
        // You can replace this with the actual DeepSeek API endpoint when available
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        this.apiKey = '661d87fdc43f4668963c890f5a72db03'; // In production, don't hardcode this
        this.conversationHistory = [
            {
                role: "system",
                content: "You are a helpful AI assistant called DeepSeek. Provide concise and helpful responses."
            }
        ];
    }

    async getAIResponse(userMessage) {
        // Add user message to conversation history
        this.conversationHistory.push({
            role: "user",
            content: userMessage
        });

        try {
            // For demonstration, we'll simulate both API and local responses
            // In a real implementation, you would choose one method
            
            // Method 1: API call (preferred if available)
            const response = await this._getAPIResponse();
            
            // Method 2: Local simulation (fallback)
            // const response = await this._getLocalResponse();
            
            // Add AI response to conversation history
            this.conversationHistory.push({
                role: "assistant",
                content: response
            });
            
            return response;
        } catch (error) {
            console.error("Error in getAIResponse:", error);
            throw error;
        }
    }

    async _getAPIResponse() {
        // Note: This is a simulation since DeepSeek's official API may differ
        // Replace with actual API call when available
        
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: this.conversationHistory,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async _getLocalResponse() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // This is a simple simulation - in a real implementation, you would:
        // 1. Load the DeepSeek model (if running locally)
        // 2. Process the conversation history
        // 3. Generate a response
        
        const lastMessage = this.conversationHistory[this.conversationHistory.length - 1].content.toLowerCase();
        
        // Simple response logic for demonstration
        if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
            return "Hello! How can I assist you today?";
        } else if (lastMessage.includes('how are you')) {
            return "I'm an AI, so I don't have feelings, but I'm functioning optimally. How can I help you?";
        } else if (lastMessage.includes('thank')) {
            return "You're welcome! Is there anything else you'd like to know?";
        } else {
            return "I'm DeepSeek AI, here to help with your questions. Could you clarify or ask me something specific?";
        }
    }

    clearConversationHistory() {
        this.conversationHistory = [
            {
                role: "system",
                content: "You are a helpful AI assistant called DeepSeek. Provide concise and helpful responses."
            }
        ];
    }
}
