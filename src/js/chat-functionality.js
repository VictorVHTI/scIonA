function initializeChat() {
  const sendButton = document.getElementById('sendButton');
  const messageInput = document.getElementById('messageInput');
  const messageArea = document.getElementById('messageArea');

  sendButton.addEventListener('click', () => {
    addMessage(messageInput, messageArea);
  });

  messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addMessage(messageInput, messageArea);
    }
  });
}

async function addMessage(inputElement, messageArea) {
  const messageText = inputElement.value.trim();
  if (messageText) {
    try {
      const newMessage = document.createElement('div');
      newMessage.classList.add('chat-message', 'sent');
      newMessage.textContent = messageText;
      messageArea.appendChild(newMessage);

      const response = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = document.createElement('div');
      botMessage.classList.add('chat-message', 'received');
      botMessage.textContent = data.answer;
      messageArea.appendChild(botMessage);

    } catch (error) {
      console.error('Error getting response from the backend:', error);
    }
    inputElement.value = '';
    messageArea.scrollTop = messageArea.scrollHeight;
  }
}

initializeChat();