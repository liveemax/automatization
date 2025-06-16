'use client'

// pages/index.js - Fixed frontend with better error handling
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';

import MainInput from '@/app/component/MainInput';
import BrowserStatus from '@/app/component/BrowserStatus';

import { API, LOCALSTORAGE_PATH, MAX_DELAY, MIN_DELAY } from '@/helpers/constants/constants';

import style from './styles.module.scss'


export default function Home() {
  const [alphabotList,setAlphabotList] = useState([])

  const onProjectDelete = (alphabotProject:string) => () => {
    const localstorageList = {}
    const newList = alphabotList.filter((listItem)=>{
      return listItem !== alphabotProject
    })

    newList.forEach((listItem)=>{
      localstorageList[listItem] = listItem
    })

    setAlphabotList(Object.values(JSON.parse(localStorage.getItem(LOCALSTORAGE_PATH.alphabotProjects)) || ''))

    localStorage.setItem(LOCALSTORAGE_PATH.alphabotProjects,JSON.stringify(localstorageList))

    setAlphabotList([...newList])
}

  const onAddValue = (addedValue:string) => {
      if(alphabotList.indexOf(addedValue)==-1){
      setAlphabotList([...alphabotList,addedValue])
    }
  }

  const onUpdateRuffles = async () => {
    alphabotList.forEach(async (alphabotProject,index)=>{
      if(index == 0) {
        await new Promise((resolv)=>{
          setTimeout(()=>{
            resolv('')
          },Math.random() * MAX_DELAY + MIN_DELAY)
        }).then(async()=>{
          await fetch(API.updateRaffles, {
            method: 'POST',
            body: JSON.stringify({
              alphabotProject
            })
          });
        })
      }
      })
      }

  useEffect(()=>{
    setAlphabotList(Object.values(JSON.parse(localStorage.getItem(LOCALSTORAGE_PATH.alphabotProjects)) || ''))
  },[])

  return (
    <div>
      <BrowserStatus/>
        <div>
        <h1>Alphabot update</h1>
              <MainInput onAddValue={onAddValue} isGroup localstorageName={LOCALSTORAGE_PATH.alphabotProjects} headerText='Добавить альфабот проект'/>
        <div className={style.alphabotButtons}>
            <Button onClick={onUpdateRuffles}>
              Update Raffles
            </Button>
        </div>
        <div className={style.alphabotProject}>
          <div>
          <h2>Alphabot projects</h2>
        {alphabotList.map((alphabotProject)=>{
          return <div className={style.alphabotItem} key = {`${alphabotList.length}${alphabotProject}`}>
            <Link  href={alphabotProject}>
              {alphabotProject}
            </Link>
            <Button onClick={onProjectDelete(alphabotProject)}>
              X
            </Button>
          </div>
        })}
          </div>
          <div>
          <h2>Alphabot Raffles</h2>
        {alphabotList.map((alphabotProject)=>{
          return <div className={style.alphabotItem} key = {`${alphabotList.length}${alphabotProject}`}>
            <Link  href={alphabotProject}>
              {alphabotProject}
            </Link>
            <Button onClick={onProjectDelete(alphabotProject)}>
              X
            </Button>
          </div>
        })}
          </div>
        </div>
      </div>
    </div>
  );
}