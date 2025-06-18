'use client'

import * as React from 'react';

import { importFromFile } from '@/helpers/cloudai/storageExport';

export default function InputFileUpload() {

  const onUpload  = async (input:any) => {
    const file = input.target.files[0];

    importFromFile(file)
  }

  return (
  <>
    <input id="image-file" type="file" onChange={onUpload}/>
</>
  );
}