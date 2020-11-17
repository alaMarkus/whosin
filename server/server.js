const express = require("express");
const app = express();
const eventRouter = require("./controllers/eventRouter")
const port = 8085;
const dbconnection = require("./database/database");
const cors = require("cors")

const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccesStatus:200,
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())

app.use("/",eventRouter)

app.listen(port,()=>{
    console.log("listening on port "+port);
})