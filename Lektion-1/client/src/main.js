import axios from "axios";

const form = document.querySelector(".input-form") //läs in formulär
const submitBtn = document.querySelector("button[type='submit']") // läs in submit knapp
    
// These variables will be updated by the checkInputs function
let inputName = ""
let inputMessage = ""


const displayMessage = (messages) => {
    console.log({ messages: messages });

    const messagesContainer = document.querySelector(".messages");

    console.log({ messagesContainer: messagesContainer});

    messagesContainer.innerHTML = "";

    messages.forEach((msg) => {
        console.log({msg: msg});

        const messageDiv = document.createElement("div");
        messageDiv.className = "message";

        const date = new Date(msg.timestamp).toLocaleString("sv-SE");

        messageDiv.innerHTML = `
            <div class="message-header">
                <strong>${msg.name}</strong>
                <span class="timestamp">${date}</span>
            </div>
            <p class="message-content">${msg.message}</p>
            <button class="delete-btn" data-id="${msg.id}">Radera</button>
            <button class="update-btn" data-id="${msg.id}">updatera</button>
            `;
            
        messagesContainer.appendChild(messageDiv);

    });
//Efter att alla meddelanden har lagts till, läg till event listeners på radera knapparna
        addDeleteEventlisteners();
};                                                                                                                                                                                                                                                                                                            
const checkInputs = () => {
    // Read the current values from the form fields
    inputName = form.elements.name.value
    inputMessage = form.elements.message.value
    
    // If name or message is missing, disable button. Otherwise, enable it.
    if (!inputName || !inputMessage) {
        submitBtn.disabled = true
    } else {
        submitBtn.disabled = false
    }
}

// Pass the function reference (checkInputs), don't call it (checkInputs()).
// This will run checkInputs every time you type in the form.
form.addEventListener("input", checkInputs)

form.addEventListener("submit", async (e) =>  {
     e.preventDefault() //Hindrar formuläret från att ladda om

     // This check is good for safety, but the button should already handle this
     if (!inputName || !inputMessage) return alert("Fyll i båda fälten!")

        const messageData = {
          name: inputName,
          message: inputMessage,
        };
      
      
      try {
           const response = await axios.post(
            "http://localhost:3000/messages",
            messageData
           );

            if (response.status == 201) {
                alert("Meddelandet sparades!")
                form.reset()
            }   else{
                alert("Ett fel uppstod!")
            }
        }   catch (error) {
            console.error("Fel:", error)
            alert("Kunde inte skicka meddelandet")
        }
        console.log({ name: inputName, message: inputMessage });

     // Reset form and disable button after submitting
     form.reset();
     checkInputs();
})

window.addEventListener("load", async (e) => loadMessages()); 

    const loadMessages = async () => {

    try {
        const response = await axios.get("http://localhost:3000/messages");

      console.log({response: response.data.data});
        

        displayMessage(response.data.data)
    }catch (error) {}


};

const addDeleteEventlisteners = () => {
    //Hitta alla knappar med klassen "delete-btn"
    const deleteButtons = document.querySelectorAll(".delete-btn")

    //Lägg  till en klick lyssnare
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", handleDelete)
    })
};

const handleDelete = async (e) => {
    const messageId = e.target.dataset.id;
    console.log({messageId: messageId });

    try {
        //skicka DELETE-request till serven
        //Vi lägger till ID:t i URL:en
        const response = await axios.delete(`http://localhost:3000/messages/${messageId}`)

        if (response.data.success) {
            alert("Meddelandet raderades!")

            //Ladda in akka neddelanden för att visa uppdaterad lista
            await loadMessages();
        } else {
            alert("Kunde inte radera meddelandet");
        }
    } catch (error) {
        console.log("Fel vid radering:", error)
        
        if (error.response && error.response.status === 404){
            alert("Meddelandet hittades inte")
        } else {
            alert("Kunde inte radera meddelandet");
        }
    }
}
// Run the check once on page load to set the initial button state
checkInputs();
