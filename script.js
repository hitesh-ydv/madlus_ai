document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    // Append user message
    appendMessage('user', userInput);

    // Clear input field
    document.getElementById('user-input').value = '';

    // Show loading indicator
    const loadingId = showLoading();

    try {
        const response = await fetch(`https://api.paxsenix.biz.id/ai/gpt4omini?text=${encodeURIComponent(userInput)}`);
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        const botMessage = data.message;

        // Remove loading indicator
        removeLoading(loadingId);

        // Append bot message with highlight and line break support
        appendMessage('bot', formatHighlightedText(botMessage));
    } catch (error) {
        // Remove loading indicator
        removeLoading(loadingId);

        // Append error message
        appendMessage('bot', 'Something went wrong. Please try again.');
        console.error(error);
    }
});

function appendMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', `${sender}-message`);
    messageDiv.innerHTML = `<span>${message}</span>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

// Function to parse and format text with **highlighting** and line breaks
function formatHighlightedText(text) {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Highlight text
    formattedText = formattedText.replace(/\n/g, '<br><br>'); // Add line breaks
    return formattedText;
}

// Show loading indicator
function showLoading() {
    const chatMessages = document.getElementById('chat-messages');
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('chat-message', 'bot-message', 'loading');
    loadingDiv.id = `loading-${Date.now()}`; // Unique ID for the loading message
    loadingDiv.innerHTML = `
        <span>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </span>`;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    return loadingDiv.id; // Return ID to remove later
}

// Remove loading indicator
function removeLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}
