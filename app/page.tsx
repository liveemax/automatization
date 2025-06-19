import * as React from "react";

import MainInput from "@/app/component/MainInput";

import { LOCALSTORAGE_PATH } from "@/helpers/constants/constants";

import ExportStorage from "./component/ExportStorage";

export default function BoxBasic() {
    return (
        <div>
            <ExportStorage/>
            <MainInput postText={"chrome://version/"}
                localstorageName={LOCALSTORAGE_PATH.chromePath}
                headerText='Изменить путь в chrome файлу'
            />
        </div>
    );
}