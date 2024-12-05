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

        // Process and append bot message
        processBotMessage(botMessage);
    } catch (error) {
        // Remove loading indicator
        removeLoading(loadingId);

        // Append error message
        appendMessage('bot', 'Something went wrong. Please try again.');
        console.error(error);
    }
});

// Function to process and append bot message with code block handling
function processBotMessage(message) {
    const codeBlockRegex = /```([\s\S]+?)```/g; // Match code blocks
    let match;
    let lastIndex = 0;

    while ((match = codeBlockRegex.exec(message)) !== null) {
        // Append text before the code block
        if (match.index > lastIndex) {
            appendMessage('bot', formatHighlightedText(message.slice(lastIndex, match.index)));
        }

        // Append the code block
        appendMessage('bot', match[1], true);

        lastIndex = codeBlockRegex.lastIndex;
    }

    // Append remaining text after the last code block
    if (lastIndex < message.length) {
        appendMessage('bot', formatHighlightedText(message.slice(lastIndex)));
    }
}

// Append message with optional code block support
function appendMessage(sender, message, isCodeBlock = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', `${sender}-message`);

    if (isCodeBlock) {
        messageDiv.classList.add('code-block');
        messageDiv.innerHTML = `<pre><code>${message}</code></pre>`;
    } else {
        messageDiv.innerHTML = `<span>${message}</span>`;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}

// Function to parse and format text with **highlighting** and line breaks
function formatHighlightedText(text) {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Highlight text
    formattedText = formattedText.replace(/\n/g, '<br><br>'); // Add line breaks
    return formattedText;
}

function showLoading() {
    const chatMessages = document.getElementById('chat-messages');
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('chat-message', 'bot-message', 'loading');
    loadingDiv.id = `loading-${Date.now()}`; // Unique ID for the loading message
    loadingDiv.innerHTML = `
        <div class="w-48 p-2 bg-base-200 rounded">
            <div class="h-4 w-36 bg-gray-300 skeleton"></div>
            <div class="mt-2 h-4 w-28 bg-gray-300 skeleton"></div>
        </div>`;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    return loadingDiv.id; // Return ID to remove later
}


function removeLoading(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.remove();
    }
}

document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    const body = document.body;
    const toggleBtn = document.getElementById('theme-toggle-btn');

    // Toggle the dark-theme class on the body
    body.classList.toggle('dark-theme');

    // Update button text based on the current theme
    if (body.classList.contains('dark-theme')) {
        toggleBtn.textContent = 'Switch to Light Mode';
    } else {
        toggleBtn.textContent = 'Switch to Dark Mode';
    }
});
