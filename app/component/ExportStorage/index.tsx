"use client";

import classNames from "classnames";
import { Button } from "@mui/material";

import InputFileUpload from "@/app/component/InputFileUpload";

import { exportToFile } from "@/helpers/cloudai/storageExport";

import styles from "./styles.module.scss";

export default function ExportStorage ({

}) {
  
    const onEcsportClick = () => {
        exportToFile("localstorage");
    };

    return <div className = {classNames(styles.exportStorage)}>
        <h1>
            Экспорт / импорт localhost
        </h1>
        <div>
            <Button onClick={onEcsportClick}
                variant="outlined"
            >
                Экспорт
            </Button>
            <InputFileUpload />
        </div>
    </div>;
};
