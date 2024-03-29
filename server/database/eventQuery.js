const {insertGet} = require('./database')

exports.insertEvent = (baseId,eventName,date,maxParticipants,price,priceForGroup) =>{
    const sql = "INSERT INTO event (eventId,eventName,eventDate,maxParticipants,price,priceForGroup) VALUES (?,?,?,?,?,?)"
    const args = [baseId,eventName,date,maxParticipants,price,priceForGroup]
    console.log(args)
    return insertGet(sql,args)
}

exports.getEvent = (eventId) =>{
    //console.log(eventId)
    const sql = "SELECT eventName,eventDate,maxParticipants,price,priceForGroup FROM event WHERE eventId = ?"
    const args = [eventId]
    return insertGet(sql,args)
}

exports.getParticipants = (eventId) => {
    const sql = "SELECT participantName FROM participant WHERE eventId = ?"
    const args = [eventId]
    return insertGet(sql,args)
}

exports.insertParticipant = (name, eventId,participantId) =>{
    console.log(name, eventId, participantId)
    const sql = "INSERT INTO participant (eventId, participantName, participantId) VALUES (?,?,?)"
    const args = [eventId, name, participantId]
    return insertGet(sql,args)
}