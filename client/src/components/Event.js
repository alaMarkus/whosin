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

    const signUpRequest = (submitNew) =>{
        let idToUse = ""
        if (cookies.userId==null){
            console.log("userid null")
            idToUse = uuid()
            setUserId(idToUse)
            setCookie("userId", idToUse,{maxAge:"100000000",sameSite:"strict"})
            setCookie("name", signName,{maxAge:"100000000",sameSite:"strict"})
        }else{
            console.log("userid not null")
            idToUse=cookies.userId
            if(submitNew){
                console.log("submit new")
                idToUse = uuid()
            }
        }
        axios
            .post(apiUrl+"/signupforevent", {"name": signName, "eventId":eventid,"participantId": idToUse})
            .then(function(result){
                console.log(result)
                setShowSignUp("hide")
                setRender(signName)
            })
    }

    function participantChecker(parti){
        let includes = false
        const checkId = cookies.userId
        console.log("checkId =",checkId)
        for (let i =0;i<parti.length;i++){
            console.log(i,parti[i].participantId)
            if (parti[i].participantId==checkId){
                includes = true;
                break;
            }
        }
        console.log("includes =",includes)
        return includes
    }

    useEffect(()=>{
        axios.post(apiUrl+"/getevent", {"eventId": eventid})
            .then(function(result){
                console.log("firstdata")
                console.log(result.data)
                if(result.data[0].length===0){
                    let i = 0
                    setRender(i++)
                }
                axios.post(apiUrl+"/getparticipants", {"eventId": eventid})
                    .then(function(result2){
                        const eventObj = result.data[0]
                        console.log("eventobj")
                        console.log(eventObj)
                        console.log(eventObj.eventDate)
                        const date = eventObj.eventDate
                        const formattedDate = date.split("-").reverse().join(".")
                        eventObj.eventDate = formattedDate
                        setEventData(eventObj)
                        console.log(result2.data)
                        setParticipants(result2.data)

                        const tempId = cookies.userId
                        console.log("userId", tempId)

                        if(tempId!=null){
                            setUserId(tempId)
                            setSignName(cookies.name)
                            if(participantChecker(result2.data)==true){
                                setShowSignUp("hide")
                            }
                        }
                    })
            })
    },[render])




    const handleSubmit = () => {
        if(participantChecker(participants)==false){
            console.log("submit participantcheck false")
            signUpRequest(false)
        }else{
            console.log("submit participantcheck true")
            const conf = window.confirm("You've already signed up!\nDo you want to sign up again?")
            if (conf==true){
                signUpRequest(true)
            }else{
            }
        }
    }

    const showCalculatedPrice = () =>{
        console.log(eventData.price)
        if (eventData.priceForGroup==1){
            let calculatedPrice=0
            if (participants.length===0){
                calculatedPrice = eventData.price
            }else{
                calculatedPrice = Math.round(eventData.price/participants.length*100)/100
            }
            return (
                <div>
                    <div>Price per person:</div>
                    <div>{calculatedPrice}€</div>
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
        if (eventData.description!=undefined){
            if (showDescription === "hide"){
                return(
                    <div>
                        <div className="description-header-cntr">
                            <div className="description-header">description:</div>
                            <button className="description-button" onClick={handleHide}>{showDescription}</button>
                        </div>
                        <div>{eventData.description}</div>
                    </div>
                )
            }
            if (showDescription==="show"){
                return(
                    <div>
                        <div className="description-header-cntr">
                            <div className="description-header">description:</div>
                            <button className="description-button" onClick={handleHide}>{showDescription}</button>
                        </div>
                        <div>{eventData.description.substr(0,20)}...</div>
                    </div>
                )   
            }
        }else{
            return (
                <></>
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