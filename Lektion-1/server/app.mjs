
import express from "express" // Importerar Express-ramverket för att bygga webbapplikationer
import cors from "cors" // Importerar CORS-paketet för att tillåta cross-origin-förfrågningar
import fs from "fs" // Importerar Node.js filsystem-modul för att läsa och skriva till filer
import { fileURLToPath } from "url" // Importerar en funktion för att konvertera fil-URL till en vanlig sökväg
import { dirname, join } from "path" // Importerar en funktion för att få mappsökvägen från en filsökväg

const __filename = fileURLToPath(import.meta.url) // Får den absoluta sökvägen till den aktuella filen
const __dirname = dirname(__filename) // Får den absoluta sökvägen till mappen som filen ligger i


const app = express() // Skapar en ny Express-applikation


app.use(cors()) // Tillåter att alla domäner kan göra anrop till din server
app.use(express.json()) // Middleware för att tolka inkommande JSON-data i request body
app.use(express.urlencoded({extended: false})) // Middleware för att tolka URL-kodad data (från formulär)
app.use(express.static(join(__dirname, '../client')));

// Funktion för att ladda meddelanden från message.json
const loadMessages = () => {
  const filePath = `${__dirname}/message.json` // Sökvägen till meddelandefilen

  try {
    if (fs.existsSync(filePath)) { // Kollar om filen existerar
      const data = fs.readFileSync(filePath, "utf-8") // Läser filens innehåll
      return JSON.parse(data) // Tolkar JSON-datan och omvandlar den till en JavaScript-array
    }
  } catch (error) {
    console.error("Error reading messages:", error);
    return [];
  }
  return [] // Returnerar en tom array om filen inte finns
 }

 // Funktion för att spara meddelanden till message.json
 const saveMessages = (messages) => {
    const filePath = `${__dirname}/message.json` // Sökvägen till meddelandefilen
    try {
        fs.writeFileSync(filePath, JSON.stringify(messages, null, 2)) // Skriver arrayen till filen som en JSON-sträng
    } catch(error) {
        console.error("Error saving messages:", error);
    }
 }

// Hanterar POST-requests till /messages för att spara ett nytt meddelande
app.post("/messages", (req, res) => {
  const { namn, meddelande } = req.body // Plockar ut namn och meddelande från request body
    try{
        if (!namn || !meddelande) {
            return res.status(400).json("Name and message are required.");
        }
        const messages = loadMessages() // Laddar befintliga meddelanden
        const newMessage = { // Skapar ett nytt meddelandeobjekt
            namn,
            meddelande,
            timestamp: new Date().toISOString() // Lägger till en tidsstämpel
        }

        messages.push(newMessage) // Lägger till det nya meddelandet i arrayen
        saveMessages(messages) // Sparar den uppdaterade arrayen till filen

        res.status(201).json("Meddelande sparat!") // Skickar tillbaka ett framgångsmeddelande
    } catch (error){
        console.log("Error", error) // Loggar eventuella fel till konsolen
        res.status(500).json("Internt serverfel"); // Skickar en felstatus om något går fel
    }
})

// Exporterar appen så att den kan användas i andra filer (t.ex. server.mjs)
export default app
