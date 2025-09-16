import axios from "axios";

const form = document.querySelector(".input-form") //läs in formulär
const submitBtn = document.querySelector("button[type='submit']") // läs in submit knapp
    
// These variables will be updated by the checkInputs function
let inputName = ""
let inputMessage = ""

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

// Run the check once on page load to set the initial button state
checkInputs();
