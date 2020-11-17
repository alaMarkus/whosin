import React from 'react'
import styled from "styled-components"

const Button = styled.button`
    border: none;
    background-color: #2057c5;
    border-radius: 5pt;
    height: 40pt;
    width: 80pt;
    font-size: x-large;
    text-align: center;
    padding:1vh;
    margin:1vh;
    cursor: pointer;
`

const MyButton = (props) =>{
    return (
        <Button onClick={props.onClick}>{props.text}</Button>
    )
}

export default MyButton;