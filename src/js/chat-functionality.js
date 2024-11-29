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

function addMessage(inputElement, messageArea) {
  const messageText = inputElement.value.trim();
  if (messageText) {
    const newMessage = document.createElement('div');
    newMessage.classList.add('chat-message', 'sent');
    newMessage.textContent = messageText;
    messageArea.appendChild(newMessage);

    inputElement.value = '';
    messageArea.scrollTop = messageArea.scrollHeight;
  }
}

initializeChat();