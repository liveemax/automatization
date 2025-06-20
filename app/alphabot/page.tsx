"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";

import MainInput from "@/app/component/MainInput";

import { API, LOCALSTORAGE_PATH } from "@/helpers/constants/constants";
import { delay } from "@/helpers/utils/utils";

import style from "./styles.module.scss";

export default function Home() {
    const [alphabotList,setAlphabotList] = useState<Array<string>>([]);
    const [raffleList,setRaffleList] = useState<Array<string>>([]);

    const onProjectDelete = (alphabotProject:string) => () => {
        const localstorageList = {} as any;
        const newList = alphabotList.filter((listItem) => {
            return listItem !== alphabotProject;
        });

        newList.forEach((listItem:string) => {
            localstorageList[listItem] = listItem;
        });

        setAlphabotList(Object.values(JSON.parse(localStorage.getItem(LOCALSTORAGE_PATH.alphabotProjects) || "")));

        localStorage.setItem(LOCALSTORAGE_PATH.alphabotProjects,JSON.stringify(localstorageList));

        setAlphabotList([...newList]);
    };

    const onRaffleDelete = (raffle:string) => () => {
        const localstorageList = {} as any;
        const newList = raffleList.filter((listItem) => {
            return listItem !== raffle;
        });

        newList.forEach((listItem) => {
            localstorageList[listItem] = listItem;
        });

        setRaffleList(Object.values(JSON.parse(localStorage.getItem(LOCALSTORAGE_PATH.alphabotRaffles) || "")));

        localStorage.setItem(LOCALSTORAGE_PATH.alphabotRaffles, JSON.stringify(localstorageList));

        setRaffleList([...newList]);
    };

    const onAddValue = (addedValue:string) => {
        if(alphabotList.indexOf(addedValue)==-1){
            setAlphabotList([...alphabotList,addedValue]);
        }
    };

    const onUpdateRuffles = async () => {
        for(let i = 0; i<alphabotList.length; i++) {
            const alphabotProject = alphabotList[i];
            await delay(1000);

            const response = await fetch(API.updateRaffles, {
                method: "POST",
                body: JSON.stringify({
                    alphabotProject,
                    chromePath: localStorage.getItem(LOCALSTORAGE_PATH.chromePath)
                })
            });

            const data = await response.json() as any;

            if(data.hrefs) {
                const raffleBuffer:Array<string> = [];
                // const alphabotRaffles = Object.values(JSON.parse(localStorage.getItem(LOCALSTORAGE_PATH.alphabotRaffles) || ""));

                data.hrefs.forEach((link:string) => {
                    if(raffleList.indexOf(link) === -1) {
                        raffleBuffer.push(link);
                    }
                });

                const allRaflse = [...raffleList, ...raffleBuffer];
                const localstorageRaffles:any = {};

                setRaffleList(allRaflse);

                allRaflse.forEach((raffle) => {
                    localstorageRaffles[raffle] = raffle;
                });

                localStorage.setItem(LOCALSTORAGE_PATH.alphabotRaffles, JSON.stringify(localstorageRaffles));
            }
        }
    };

    useEffect(() => {
        console.log(localStorage.getItem(LOCALSTORAGE_PATH.alphabotProjects),"JSON.parse(localStorage.getItem(LOCALSTORAGE_PATH.alphabotProjects) || \"\")");
        
        const alphabotProjects = Object.values(JSON.parse(localStorage.getItem(LOCALSTORAGE_PATH.alphabotProjects) || "[]")) as Array<string>;
        const alphabotRaffles = Object.values(JSON.parse(localStorage.getItem(LOCALSTORAGE_PATH.alphabotRaffles) || "[]")) as Array<string>;

        if(!alphabotProjects.length) {
            localStorage.setItem(LOCALSTORAGE_PATH.alphabotProjects,JSON.stringify({}));
        }

        if(!alphabotRaffles.length) {
            localStorage.setItem(LOCALSTORAGE_PATH.alphabotRaffles,JSON.stringify({}));
        }

        setAlphabotList(alphabotProjects);
        setRaffleList(alphabotRaffles);
    },[]);

    return (
        <div>
            <div>
                <h1>Alphabot update</h1>
                <MainInput onAddValue={onAddValue}
                    isGroup
                    localstorageName={LOCALSTORAGE_PATH.alphabotProjects}
                    headerText='Добавить альфабот проект'
                />
                <div className={style.alphabotButtons}>
                    <Button onClick={onUpdateRuffles}>
                        Update Raffles
                    </Button>
                </div>
                <div className={style.alphabotProject}>
                    <div>
                        <h2>Alphabot projects</h2>
                        {alphabotList.map((alphabotProject) => {
                            return <div className={style.alphabotItem}
                                key = {`${alphabotList.length}${alphabotProject}`}
                            >
                                <Link target='_blank'
                                    href={alphabotProject}
                                >
                                    {alphabotProject}
                                </Link>
                                <Button onClick={onProjectDelete(alphabotProject)}>
                                    X
                                </Button>
                            </div>;
                        })}
                    </div>
                    <div>
                        <h2>Alphabot Raffles</h2>
                        {raffleList.map((raffle) => {
                            return <div className={style.alphabotItem}
                                key = {`${raffleList.length}${raffle}`}
                            >
                                <Link  href={raffle}>
                                    {raffle}
                                </Link>
                                <Button onClick={onRaffleDelete(raffle)}>
                                    X
                                </Button>
                            </div>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}