'use client'

import { useLayoutEffect, useState } from "react";

import { Button, TextField } from "@mui/material";
import Link from "next/link";

import styles from "./styles.module.scss"

interface ISideMenu {
  localstorageName: string,
  headerText: string,
  postText?: string,
  isGroup?: boolean,
  onAddValue?:(inputText:string)=>undefined
}

export default function MainInput({
  localstorageName,
  headerText,
  postText,
  isGroup,
  onAddValue = () => {}
}:ISideMenu) {
  const [inputText,setInputText] = useState('')

  const onInputChange = (e:{target:{value:string}}) => {
    setInputText(e.target.value)
  }

  const onButtonClick = () => {
    if(isGroup){
      const groupValue = JSON.parse(localStorage.getItem(localstorageName) || '{}')

      groupValue[inputText] = inputText

      localStorage.setItem(localstorageName,JSON.stringify(groupValue))

      setInputText('')
    } else {
      localStorage.setItem(localstorageName,JSON.stringify(inputText))
    }

    onAddValue(inputText)
  }

  const onReset = () => {
    localStorage.removeItem(localstorageName)
    
    setInputText('')
  }
  
  useLayoutEffect(()=>{
    if(!isGroup){
      setInputText(localStorage.getItem(localstorageName) || '')
    }
  },[])

    return (
          <>
          <h2>{headerText}</h2>
          <div className={styles.sideMenuContainer}>
            <TextField value={inputText} onChange={onInputChange} id="outlined-basic" label="Outlined" variant="outlined" />
            <Button variant="contained" onClick={onButtonClick}>Set path</Button>
            <Button variant="text" onClick={onReset}>Reset</Button>
            {postText}
          </div>
          </>
    );
  }