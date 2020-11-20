import React,{useState, use, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import {apiUrl} from "../config/config"
import MyButton from "./elements/MyButton"
import "./create-event.css"

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }


const CreateEvent = () =>{
    const [event, setEvent] = useState({"maxParticipants": 0,"price":0,"maxParticipants": 0, "priceForGroup": 1})
    const [maxParts, setMaxParts] = useState(0)
    const [showExtras, setShowExtras] = useState(0)
    const [selectedExtras, setSelectedExtras] = useState({"price":0,"maxParticipants": 0})
    const history = useHistory()

    useEffect(()=>{
        console.log(event.eventId)
        if(event.eventId!=undefined){
            history.push("/event/"+event.eventId)
            sendRequest(event)
        }
    },[event.eventId])

    const handleSubmit = (e) =>{
        e.preventDefault();
            const baseId = makeid()
            const obj1 = {"eventId":baseId}
            setEvent(Object.assign({},event,obj1))
    }

    const sendRequest = (eventObj) =>{
        axios
            .post(apiUrl+"/insertevent", {"event":eventObj})
            .then(function(result){
                console.log(result)
            })
        console.log(event)
    }

    const handleChange = (e) =>{
        const obj1 = {[e.target.name]: e.target.value};
        setEvent(
            Object.assign({},event,obj1)
        )
        console.log(event)
    }


    const price = () => {
        if (selectedExtras.price==1){
            return (
                <div className="extras">
                    <label>Price</label>
                    <input className="input-field" name ="price" onChange={handleChange} autoComplete="off"></input>
                        <div className="radio-cnt">
                            <div className="radio">
                                <label>
                                    <input name ="priceForGroup" type="radio" value="0" onChange={handleChange}/>
                                    Per Person
                                </label>
                            </div>
                                <div className="radio">
                                <label>
                                    <input name ="priceForGroup"  type="radio" value="1" onChange={handleChange}/>
                                    For Group
                                </label>
                            </div>
                        </div>
                </div>
            )
        }else{
            return (<div></div>)
        }
    }

    const showMax = () =>{
        if(selectedExtras.maxParticipants==1){
            return (
                <div className="max-parts-input">
                    <label>How many can attend?</label>
                    <input className="input-field" name = "maxParticipants" onChange={handleChange} autoComplete="off"></input>
                </div>
            )
        }else{
            return (<></>)
        }
    }

    

    const handleButton = () => {
        if (showExtras==0){
            setShowExtras(1)
        }else{
            setShowExtras(0)
        }
    }

    const handleExtras = (e) =>{
        const extra = (e.target.id)
        if (selectedExtras[extra]===0){
            const obj1 = {[e.target.id]: 1};
            console.log(obj1)
            setSelectedExtras(Object.assign({},selectedExtras,obj1))
        }else{
            const obj1 = {[e.target.id]: 0};
            console.log(obj1)
            setSelectedExtras(Object.assign({},selectedExtras,obj1))
        }
        console.log(selectedExtras)
    }

    const selectExtras = () =>{
        if (showExtras==1){
            return (
                <div className="option-container">
                    <div className="extra-option" id="price" onClick={handleExtras}>Price</div>
                    <div className="extra-option" id="maxParticipants" onClick={handleExtras}>Participant limit</div>
                </div>
            )
        }
    }

    return (
        <div className="create-event-container">
            <div className="extras-menu-container">
                <div className="extra-button-container">
                    <button className="extra-button" onClick={handleButton}>More options</button>
                </div>
                {selectExtras()}
            </div>
            <div className="create-event-inner-container">
                <form onSubmit={handleSubmit}>
                    <div className = "form-container">
                        <label>Event Name</label>
                        <input className="input-field" name="eventName" onChange={handleChange} autoComplete="off" required ></input>

                        <label>Date</label>
                        <input className="input-field" type="date" name="eventDate" onChange={handleChange}></input>
                        <div>
                            {price()}
                            {showMax()}
                        </div>
                        <div className="create-button-container">
                            <MyButton text = "Create!" type="submit"/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateEvent;