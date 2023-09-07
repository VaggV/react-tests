import React from "react";
import { Share } from '@capacitor/share'
import logo512 from '../assets/img/logo512.png';

function CapacitorTests() {

  const share = async () => {
     // Remove data:image/png;base64, from the base64 string
    const base64Image = logo512.split('base64,')[1];

    console.log('base64Image', logo512)
    // Share base64 encoded image
    const x = await Share.share({
      title: 'Share image',
      text: 'Share image',
      url: `data:image/png;base64,${base64Image}`,
      dialogTitle: 'Share image'
    });

    console.log('x', x)



    
  }

  return (
    <div style={{ margin: 0 }}>
      <button onClick={share}>Share img</button>
    </div>
  );
}

export default CapacitorTests;
