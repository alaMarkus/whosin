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
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const [eventData, setEventData] = useState([])
    const [participants, setParticipants] = useState([])
    const [signName, setSignName] = useState('')
    const [userId, setUserId] = useState('')
    const [render, setRender] = useState('')

    const [showDescription, setShowDescription] = useState("show")
    const [showSignUp, setShowSignUp] = useState("show")


    const { eventid } = useParams();

    const userIdFunc = () =>{
        const newId = uuid()
        console.log(newId)
        setCookie("userId", newId,{maxAge:"100000000",sameSite:"strict"})
        setUserId(newId)
    }

    useEffect(()=>{
        if(cookies.userId==null){
            userIdFunc()
        }else{
            setUserId(cookies.userId)
            setShowSignUp("hide")
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
        }else{
            const conf = window.confirm("You've already signed up!\nDo you want to sign up again?")
            if (conf==true){
                userIdFunc()
                setCookie("name", signName,{maxAge:"100000000",sameSite:"strict"})
            }else{

            }
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
            const showCalculatedPrice = Math.round(eventData.price/participants.length*100)/100
            return (
                <div>
                    <div>Price per person:</div>
                    <div>{showCalculatedPrice}€</div>
                </div>
            )
        }else{
            return (
                <div>
                    <div>Price per person:</div>
                    <div>{eventData.price}€</div>
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

    const description = () =>{
        const lorem = `Lorem Ipsum is simply dummy text of the printing and 
        typesetting industry. Lorem Ipsum has been the industry's 
        standard dummy text ever since the 1500s, when an unknown 
        printer took a galley of type and scrambled it to make a type 
        specimen book. It has survived not only five centuries, but also 
        the leap into electronic typesetting, remaining essentially unchanged. 
        It was popularised in the 1960s with the release of Letraset sheets 
        containing Lorem Ipsum passages, and more recently with desktop 
        publishing software like Aldus PageMaker including versions of 
        Lorem Ipsum.`
        if (showDescription === "hide"){
            return(
                <div>
                    <div>{eventData.description}</div>
                    <div>{lorem}</div>
                </div>
            )
        }
        if (showDescription==="show"){
            return(
                <div>{lorem.substr(0,20)}...</div>
            )
        }
    }

    const dateAndTime = () =>{
        return(
            <div>
                <div>{eventData.eventDate}</div>
                <div></div>
            </div>
        )
    }

    const handleHide = () =>{
        showDescription==="hide"?setShowDescription("show"):setShowDescription("hide")
    }

    const handleExtra = () =>{
        setShowSignUp("show")
    }

    const signUpper = () => {
        if (showSignUp == "show"){
            return (
                <div className="signup-cnt">
                    <label>name</label>
                    <input className="signup-field" name="signupname" value = {signName} onInput={e=>setSignName(e.target.value)}/>
                    <div className="center">
                        <button className="signup-button" onClick = {handleSubmit}>Count Me In!</button>
                    </div>
                </div>
            )
        }else{
            return(
            <div className="signup-cnt">
                <div className="signeup-header">You've already signed up</div>
                <div className="signedup-name">{cookies.name}!</div>
                <button className="signup-extra-button" onClick={handleExtra}>Sign up someone else</button>
            </div>
            )
        }
    }

    return (
        <div>
            <div className = "event-header">{eventData.eventName}</div>
            <div className="event-data-cntr">
                <div className="event-data">{dateAndTime()}</div>
                <div className="event-data">{showCalculatedPrice()}</div>
                <div className="event-data">{participantNumber()}</div>
                <div className="event-data">{spotsLeft()}</div>
            </div>
            <div className="description-header-cntr">
                <div className="description-header">description:</div>
                <button className="description-button" onClick={handleHide}>{showDescription}</button>
            </div>
            <div className="description-cntr">{description()}</div>
            <div>
                {signUpper()}
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