import 'tui-image-editor/dist/tui-image-editor.css';

import { PhotoEditor } from '@capawesome/capacitor-photo-editor';

import logo512 from '../assets/img/logo512.png';
import React from 'react';


function ImageEditorTest() {
  const [path, setPath] = React.useState(logo512);

  const editPhoto = async () => {
    console.log(logo512.substring(1))
    PhotoEditor.editPhoto({ path: logo512 }).then((result) => {
      console.log("result", result);
    }).catch((error) => {
      console.log("error", error);
    });
  };

  return (
    <>
      <input type={"text"} onChange={(e) => setPath(e.target.value)} />
      <button
        onClick={() => {
          editPhoto();
        }}
      >
        Test
      </button>
      <button 
        onClick={() => {
          setPath(logo512.replace("data:image/png;base64,", ""));
        }}
      >
        Remove base64 
      </button>
      <p>{path.substring(0,50)}</p>
      
    </>
    
  );
}




export default ImageEditorTest;