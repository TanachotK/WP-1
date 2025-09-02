import express from "express"
import cors from "cors"
import fs from "fs"
import { fileURLToPath } from "url"
const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extend: false}))

const saveMessage = () => {
  fs.writeFileSync(fileURLToPath, JSON.stringify(messages))
 }
app.post("/messages", (req, res) =>{
  const {name, message} = req.body
    try{
        const newMessage = {
        name,
        message,
        timestamp: new Date().toISOString()
        }

    saveMesaage(message)

    res.status(201).json("Saved succesfully")
       }   catch (error){
            console.log("Error", error)
            res.status(500).json("Inernal server error");
       }
})

export default app