const Agent = require('../services/agent');

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

      const data = await Agent.ask(messageText);

      const botMessage = document.createElement('div');
      botMessage.classList.add('chat-message', 'received');
      botMessage.textContent = data.response;
      // botMessage.textContent = 'te estoy escuchando'
      messageArea.appendChild(botMessage);

    } catch (error) {
      console.error('Error getting response from the backend:', error);
    }
    inputElement.value = '';
    messageArea.scrollTop = messageArea.scrollHeight;
  }
}

initializeChat();