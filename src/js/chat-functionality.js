// import { downloadPDF } from '../services/download-pdf'; 
// const { jsPDF } = require('jspdf');

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
  inputElement.value = '';
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
    messageArea.scrollTop = messageArea.scrollHeight;
  }
}

async function handleAnswer(answer) {
  if (!answer) return;

  const exception = "Procesando tu Solicitud de Excepción";

  if (answer.includes(exception)) {
    processExceptionRequest(answer);
  }
}

async function processExceptionRequest(inputString) {
  const nombreMatch = inputString.match(/Nombre:\s*([\w\s]+)/);
  const fechaMatch = inputString.match(/Fecha:\s*([\d\/-]+)/);
  const razonMatch = inputString.match(/Razón:\s*([\w\s]+)/);

  const name = nombreMatch ? nombreMatch[1] : null;
  const date = fechaMatch ? fechaMatch[1] : null;
  const reason = razonMatch ? razonMatch[1] : null;

  console.log("Nombre:", name);
  console.log("Fecha:", date);
  console.log("Razón:", reason);

  // const response = await fetch('/generate-pdf', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ name, date, reason }),
  // });

  // fetch('static/templates/exception.html')
  //   .then(response => response.text())
  //   .then(html => {
  //     debugger
  //       // Replace {{name}} placeholder with a given name
  //       // const name = 'Juan Pérez'; // Replace this with any dynamic name
  //       const updatedHTML = html.replace('{{name}}', name);

  //       // Call the function to download the updated HTML as a PDF
  //       downloadPDF(updatedHTML, `solicitud-excepcion-${name}`);
  //   })
  //   .catch(error => {
  //       console.error('Error loading HTML template:', error);
  //   });

  fetch('static/templates/exception.html')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      // const name = 'Juan Pérez'; // Replace with your dynamic value
      const updatedHTML = html.replace('{{name}}', name);

      // Open the updated HTML in a new window
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(updatedHTML);
        newWindow.document.close();
      } else {
        console.error('Failed to open a new window');
      }
    })
    .catch(error => {
      console.error('Error loading HTML template:', error);
    });
}

function downloadPDF(htmlContent, fileName) {
  // const doc = new jsPDF();
  const doc = new window.jspdf.jsPDF();

  // Generate PDF from provided HTML content
  doc.html(htmlContent, {
    callback: function (doc) {
      doc.save(`${fileName}.pdf`);
    },
    x: 10,
    y: 10,
    width: 180,  // Adjust the width to fit content
    windowWidth: 800  // The width of the page in the browser
  });
}

initializeChat();