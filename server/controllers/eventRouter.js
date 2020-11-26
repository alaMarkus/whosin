const eventRouter = require('express').Router();
const query = require("../database/eventQuery");

eventRouter.post("/getevent", function(req,res){
    const eventId = req.body.eventId
    query.getEvent(eventId)
        .then(result=>{
            console.log(result)
            res.send(result)
        })
})

eventRouter.post("/getparticipants", function(req,res){
    const eventId = req.body.eventId
    query.getParticipants(eventId)
        .then(result=>{
            console.log(result)
            res.send(result)
        })
})

eventRouter.post("/insertevent", function(req,res){
    const event = req.body.event
    console.log(event)
    query.insertEvent(event.eventId,event.eventName,event.eventDate,event.maxParticipants,event.price,event.priceForGroup, event.description)
        .then(result=>{
            console.log(result)
            res.send("inserted")
        })
})

eventRouter.post("/signupforevent", function(req,res){
    const name = req.body.name
    const eventId = req.body.eventId
    const participantId = req.body.participantId
    console.log(name)
    console.log(eventId)
    query.insertParticipant(name,eventId, participantId)
        .then(result=>{
            console.log(result)
            res.send("inserted succesfully")
        })
})

module.exports = eventRouter;