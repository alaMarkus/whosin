import {React,useEffect,useState} from 'react'
import {BrowserRouter as Router, Switch, Link, Route, useParams} from 'react-router-dom'
import axios from 'axios'
import {Cookies,useCookies} from 'react-cookie'
import {v4 as uuid} from 'uuid'

import {apiUrl} from "../config/config"
import "./event.css"
import MyButton from "./elements/MyButton"


function pricePerPeson(total, people){
    return total/people
}

const Event = (props) =>{
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    const [eventData, setEventData] = useState([])
    const [participants, setParticipants] = useState([])
    const [signName, setSignName] = useState('')
    const [userId, setUserId] = useState('')
    const [render, setRender] = useState('')


    const { eventid } = useParams();

    useEffect(()=>{
        if(cookies.userId==null){
            const newId = uuid()
            console.log(newId)
            setCookie("userId", newId,{maxAge:"100000000",sameSite:"strict"})
            setUserId(newId)
        }else{
            setUserId(cookies.userId)
        }
        if(cookies.name!=null){
            setSignName(cookies.name)
        }

        axios.post(apiUrl+"/getevent", {"eventId": eventid})
            .then(function(result){
                console.log(result.data)
                axios.post(apiUrl+"/getparticipants", {"eventId": eventid})
                    .then(function(result2){
                        const eventObj = result.data[0]
                        console.log(eventObj.eventDate)
                        const date = eventObj.eventDate
                        const formattedDate = date.split("-").reverse().join(".")
                        eventObj.eventDate = formattedDate
                        setEventData(eventObj)
                        setParticipants(result2.data)
                    })
            })
    },[])

    useEffect(()=>{
        axios.post(apiUrl+"/getparticipants", {"eventId": eventid})
        .then(function(result2){
            console.log(result2.data)
            setParticipants(result2.data)
        })
    },[render])

    const handleSubmit = () => {
        if(cookies.name==null){
            setCookie("name", signName,{maxAge:"100000000",sameSite:"strict"})
        }
        axios
            .post(apiUrl+"/signupforevent", {"name": signName, "eventId":eventid,"participantId": userId})
            .then(function(result){
                console.log(result)
                setRender(signName)
            })
    }

    const showCalculatedPrice = () =>{
        console.log(eventData.price)
        if (eventData.price==0){
            return (
                <div></div>
                )
        }
        if (eventData.priceForGroup==1){
            const showCalculatedPrice = eventData.price/participants.length
            return (
                <div>
                    <div>Price per person:</div>
                    {showCalculatedPrice}€
                </div>
            )
        }else{
            return (
                <div>
                    <div>Price per person:</div>
                    {eventData.price}€
                </div>
            )
        }
    }

    const spotsLeft = () =>{
        if (eventData.maxParticipants > 0){
            const left = eventData.maxParticipants-participants.length
            return (
                <div>
                    {left} Spots left
                </div>
            )
        }else{
            return (
                <div></div>
            )
        }
    }

    const participantNumber = () => {
        return(
            <div>
                {participants.length} Signed up
            </div>
        )
    }

    return (
        <div>
            <div className = "event-header">{eventData.eventName}</div>
            <div className="grid-cntr">
                <div>{eventData.eventDate}</div>
                <div>{spotsLeft()}</div>
                <div className="second-row">{showCalculatedPrice()}</div>
                <div className="second-row">{participantNumber()}</div>
            </div>
            <div className = "signup-cnt">
                <label>name</label>
                <input className="input-field" name="signupname" value = {signName} onInput={e=>setSignName(e.target.value)}/>
                <div className="center">
                    <button className="signup-button" onClick = {handleSubmit}>Count Me In!</button>
                </div>
            </div>
            <div className="participant-cnt">
                <div>
                    {participants.map(e=>{return(<div key={e.participantId}>{e.participantName}</div>)})}
                </div>
            </div>
        </div>
    )
}

export default Event;