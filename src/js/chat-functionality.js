function initializeChat() {
  const sendButton = document.getElementById('sendButton');
  const messageInput = document.getElementById('messageInput');
  const messageArea = document.getElementById('messageArea');

  const filesContainer = document.querySelector(".files");
  const initRequestContainer = document.querySelector(".initRequestContainer");
  const downloadButton = document.getElementById("downloadButton");
  const chatButton = document.getElementById("chatButton");

  const exceptionButton = document.getElementById("exception");


  sendButton.addEventListener('click', () => {
    addMessage(messageInput, messageArea);
  });

  messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addMessage(messageInput, messageArea);
    }
  });

  downloadButton.addEventListener("click", () => {
    if (filesContainer.style.display === "none") {
      filesContainer.style.display = "flex";
    } else {
      filesContainer.style.display = "none";
    }
    hideInitrequest();
  });

  chatButton.addEventListener("click", () => {
    hideInitrequest();
    addMessage(messageInput, messageArea, 'Quiero preguntarte algo');
  });

  exceptionButton.addEventListener("click", () => {
    filesContainer.style.display = "none";
    addMessage(messageInput, messageArea, 'Llenar una Solicitud de Excepción');
  });

  function hideInitrequest() {
    initRequestContainer.style.display = "none"
  }
}

async function addMessage(inputElement, messageArea, message = null) {
  const messageText = message ?? inputElement.value.trim();
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
      handleAnswer(data.answer);

      messageArea.appendChild(botMessage);

    } catch (error) {
      console.error('Error getting response from the backend:', error);
    }
    inputElement.value = '';
    messageArea.scrollTop = messageArea.scrollHeight;
  }
}

async function handleAnswer(answer) {
  if (!answer) return;

  const exception = "Procesando tu Solicitud de Excepción";

  if (answer.includes(exception)) {
    processExceptio(answer);
  }
}

async function processExceptio(inputString) {
  const nombreMatch = inputString.match(/Nombre:\s*([\w\s]+)/);
  const fechaMatch = inputString.match(/Fecha:\s*([\d\/-]+)/);
  const razonMatch = inputString.match(/Razón:\s*([\w\s]+)/);

  const nombre = nombreMatch ? nombreMatch[1] : null;
  const fecha = fechaMatch ? fechaMatch[1] : null;
  const razon = razonMatch ? razonMatch[1] : null;

  console.log("Nombre:", nombre);
  console.log("Fecha:", fecha);
  console.log("Razón:", razon);
}

initializeChat();