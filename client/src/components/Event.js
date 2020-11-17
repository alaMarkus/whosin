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
                        console.log(result2.data)
                        setEventData(result.data[0])
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

    return (
        <div>
            <div>
                <div>{eventData.eventName}</div>
                <div>{eventData.eventDate}</div>
                <div>{eventData.maxParticipants}</div>
                <div>{eventData.price}€</div>
                <div>{eventData.priceForGroup}</div>
            </div>
            <div className = "signup-cnt">
                <label>name</label>
                <input className="input-field" name="signupname" value = {signName} onInput={e=>setSignName(e.target.value)}/>
                <div className="center">
                    <MyButton text = "Count Me In!" onClick = {handleSubmit}/>
                </div>
            </div>
            <div className="participant-cnt">
                <div>
                    {participants.map(e=>{return(<div>{e.participantName}</div>)})}
                </div>
            </div>
        </div>
    )
}

export default Event;