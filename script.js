document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');
    const clearChatButton = document.getElementById('clear-chat');
    const statusIndicator = document.getElementById('status-indicator');
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');

    // Initialize the AI service
    const aiService = new AIService();

    // Auto-resize textarea as user types
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Handle form submission
    messageForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage('user', message);
        messageInput.value = '';
        messageInput.style.height = 'auto';
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Get AI response
            const response = await aiService.getAIResponse(message);
            
            // Remove typing indicator and add AI response
            removeTypingIndicator();
            addMessage('ai', response);
        } catch (error) {
            removeTypingIndicator();
            addMessage('ai', "Sorry, I'm having trouble connecting. Please try again later.");
            console.error("Error getting AI response:", error);
            updateStatus('error', 'Connection error');
        }
    });

    // Clear chat history
    clearChatButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the conversation?')) {
            chatMessages.innerHTML = '';
            // Add initial AI message back
            addMessage('ai', "Hello! I'm Rikuya AI. How can I help you today?");
        }
    });

    // Add a message to the chat
    function addMessage(sender, content) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = content;
        
        const timestamp = document.createElement('div');
        timestamp.classList.add('message-timestamp');
        timestamp.textContent = getCurrentTime();
        
        messageElement.appendChild(messageContent);
        messageElement.appendChild(timestamp);
        chatMessages.appendChild(messageElement);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.classList.add('typing-indicator');
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    // Get current time in HH:MM format
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Update connection status
    function updateStatus(status, text) {
        statusText.textContent = text;
        
        switch(status) {
            case 'connected':
                statusDot.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                statusDot.style.backgroundColor = '#F44336';
                break;
            case 'connecting':
                statusDot.style.backgroundColor = '#FFC107';
                break;
        }
    }

    // Initial status
    updateStatus('connected', 'Connected');
});
