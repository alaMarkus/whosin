const express = require("express");
const app = express();
const eventRouter = require("./controllers/eventRouter")
const port = 8085;
const dbconnection = require("./database/database");
const cors = require("cors")
const path = require('path')

const corsOptions = {
    origin: "95.216.173.144:8085",
    //origin:"*",
    optionsSuccesStatus:200,
    credentials: true
}

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
    app.use(cors(corsOptions))
}else{
    const corsOptions2 = {
        origin: "http://localhost:3000",
        //origin:"*",
        optionsSuccesStatus:200,
        credentials: true
    }
    app.use(cors(corsOptions2))
    console.log("cors localhost")
}


app.use(express.json())

app.use("/",eventRouter)

app.listen(port,()=>{
    console.log("listening on port "+port);
})