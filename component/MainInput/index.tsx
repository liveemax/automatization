'use client'

import { useLayoutEffect, useState } from "react";

import { Button, TextField } from "@mui/material";

import styles from "./styles.module.scss"

interface ISideMenu {
  localstorageName: string,
  headerText: string,
  postText?: string,
  isGroup?: boolean,
}

export default function MainInput({
  localstorageName,
  headerText,
  postText,
  isGroup
}:ISideMenu) {
  const [inputText,setInputText] = useState('')

  const onInputChange = (e:{target:{value:string}}) => {
    setInputText(e.target.value)
  }

  const onButtonClick = () => {
    localStorage.setItem(localstorageName,inputText)
  }
  
  useLayoutEffect(()=>{
    if(!isGroup){
      setInputText(localStorage.getItem(localstorageName) || '')
    }
  },[])

    return (
          <>
          <h2>{headerText}</h2>
          <div className={styles.layoutContainerPage}>
            <TextField value={inputText} onChange={onInputChange} id="outlined-basic" label="Outlined" variant="outlined" />
            <Button variant="contained" onClick={onButtonClick}>Set path</Button>
            <Button variant="text" onClick={onButtonClick}>Reset</Button>
            {postText}
            chrome://version/
          </div>
          </>
    );
  }