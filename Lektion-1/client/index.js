const form = document.querySelector(".input-form") //läs in formulär
const submitBtn = document.querySelector("button[type='submit']") // läs in submit knapp

// These variables will be updated by the checkInputs function
let InputName = ""
let InputMessage = ""

const checkInputs = () => {
    // Read the current values from the form fields
    InputName = form.elements.name.value
    InputMessage = form.elements.message.value
    
    // If name or message is missing, disable button. Otherwise, enable it.
    if (!InputName || !InputMessage) {
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
     if (!InputName || !InputMessage) return alert("Fyll i båda fälten!")

     console.log({ namn: InputName, meddelande: InputMessage });

     // Reset form and disable button after submitting
     form.reset();
     checkInputs();
})

// Run the check once on page load to set the initial button state
checkInputs();
