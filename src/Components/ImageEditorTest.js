import React, { useState } from 'react';
import { PhotoEditor } from '@capawesome/capacitor-photo-editor';
import { Filesystem, Directory } from '@capacitor/filesystem';
import logo512 from '../assets/img/logo512.png';
import FilerobotImageEditor, {
  TABS,
  TOOLS,
} from 'react-filerobot-image-editor';

function ImageEditorTest() {
  const [isImgEditorShown, setIsImgEditorShown] = useState(false);

  const openImgEditor = () => {
    setIsImgEditorShown(true);
  };

  const closeImgEditor = () => {
    setIsImgEditorShown(false);
  };

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

  // const increment = (input) => {
  //   input.value = Number(input.value) + 1
  // }

  // const decrement = (input) => {
  //   // Decrement input value by one and trigger change event
  //   input.value = Number(input.value) - 1;
  //   input.dispatchEvent(new Event('onChange'));
  // }

  const selectElement = () => {
    // Select element with class bKmApX
    const numInput = document.querySelector(".SfxInput-Base");

    // Make native numInput increment and decrement buttons visible on mobile
    numInput.style.webkitAppearance = "visible";
    numInput.style.mozAppearance = "visible";
    numInput.style.appearance = "";




    // console.log("element", element);
    // // Select parent 
    // const parent = element.parentElement;
    // console.log("parent", parent);
    // // Remove children of parent
    // while (parent.firstChild) {
    //   parent.removeChild(parent.firstChild);
    // }

    // // Make width fit-content on parent element
    // parent.style.width = "fit-content";


    // element.classList.add("spinner-input");

    // // Add a button for decrement
    // const button = document.createElement("button");
    // // Add classes spinner and decrement to button
    // button.classList.add("spinner", "decrement");
    // button.innerHTML = "-";
    // // Add on click event to button
    // button.onclick = () => decrement(element);
    
    // parent.appendChild(button);

    // //Add the original element back
    // parent.appendChild(element);

    // //Add another button
    // const button2 = document.createElement("button");
    // button2.classList.add("spinner", "increment");
    // button2.innerHTML = "+";
    // parent.appendChild(button2);

  }

  return (
    <>
      <button onClick={editPhoto}>
        Cap awesome photo editor
      </button>

      <button onClick={openImgEditor}>Open Filerobot image editor</button>

      <button onClick={selectElement}>Select element</button>

      {isImgEditorShown && (
        <FilerobotImageEditor
          source="https://scaleflex.airstore.io/demo/stephen-walker-unsplash.jpg"
          onBeforeSave={(x, y, z) => {
            console.log('before save', x, y, z);
          }}
          onSave={(editedImageObject, designState) =>
            console.log('saved', editedImageObject, designState)
          }
          onClose={closeImgEditor}
          annotationsCommon={{
            fill: '#ff0000',
          }}
          Text={{ text: 'Filerobot...' }}
          Rotate={{ angle: 90, componentType: 'slider' }}
          Crop={{
            presetsItems: [
              {
                titleKey: 'classicTv',
                descriptionKey: '4:3',
                ratio: 4 / 3,
                // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
              },
              {
                titleKey: 'cinemascope',
                descriptionKey: '21:9',
                ratio: 21 / 9,
                // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
              },
            ],
            presetsFolders: [
              {
                titleKey: 'socialMedia', // will be translated into Social Media as backend contains this translation key
                // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
                groups: [
                  {
                    titleKey: 'facebook',
                    items: [
                      {
                        titleKey: 'profile',
                        width: 180,
                        height: 180,
                        descriptionKey: 'fbProfileSize',
                      },
                      {
                        titleKey: 'coverPhoto',
                        width: 820,
                        height: 312,
                        descriptionKey: 'fbCoverPhotoSize',
                      },
                    ],
                  },
                ],
              },
            ],
          }}
          tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK]} // or {['Adjust', 'Annotate', 'Watermark']}
          defaultTabId={TABS.ANNOTATE} // or 'Annotate'
          defaultToolId={TOOLS.TEXT} // or 'Text'
        />
      )}
    </>
      
    
  );
}

export default ImageEditorTest;