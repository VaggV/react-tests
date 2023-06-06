import React from 'react';
import { PhotoEditor } from '@capawesome/capacitor-photo-editor';
import { Filesystem, Directory } from '@capacitor/filesystem';
import logo512 from '../assets/img/logo512.png';

function ImageEditorTest() {

  const editPhoto = async () => {
    // const photo = await Filesystem.getUri({ path: "logo512.png", directory: Directory.Data});
    // Write logo512 to documents folder
    const photo = await Filesystem.writeFile({
      path: "logo512.png",
      data: logo512,
      directory: Directory.Documents,
      recursive: true
    });

    console.log("Photo is", photo);

    PhotoEditor.editPhoto({ path: photo.uri }).then((result) => {
      console.log("result", result);
    }).catch((error) => {
      console.log("error", error);
    });
  };

  return (
      <button onClick={editPhoto}>
        Cap awesome photo editor
      </button>
    
  );
}

export default ImageEditorTest;