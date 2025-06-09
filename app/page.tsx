import * as React from 'react';

import { LOCALSTORAGE_PATH } from '@/helpers/constants/constants';

import MainInput from '@/component/MainInput';

export default function BoxBasic() {
  return (
    <div>
      <MainInput postText={'chrome://version/'} localstorageName={LOCALSTORAGE_PATH.chromePath} headerText='Изменить путь в chrome файлу'/>
      <MainInput isGroup localstorageName={LOCALSTORAGE_PATH.alphabotProjects} headerText='Добавить альфабот проект'/>
    </div>
  );
}