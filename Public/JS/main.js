const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const socket = io();

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    // Emit message to the server
    socket.emit("chatMessage",msg);
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus()
})

// Output message from DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.innerHTML = `<div class="message"><p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p></div>`;
    document.querySelector(".chat-messages").appendChild(div);
}