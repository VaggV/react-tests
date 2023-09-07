// import { VictoryChart, VictoryZoomContainer, VictoryScatter } from 'victory';
// import React from "react";
// import ZoomableLineChart from "./Components/ZoomableLineChart";
// import heightData from "./data/data.json";
import React, { useCallback, useState } from 'react';
import { GoogleMap, useLoadScript} from '@react-google-maps/api';

function App() {
    // const [data, setData] = useState([25, 30, 45, 60, 70, 65, 75]);
    const [map, setMap] = useState(null);

    // const data2 = [25, 75];

    // const dataX = [0, 6];

    // // Get the max height of the data
    // const maxHeight = Math.max(...heightData.map((d) => d.Height));
    // // // Get the min height of the data
    // const minHeight = Math.min(...heightData.map((d) => d.Height));

    // // Get the first and last heights of the data
    // const firstHeight = heightData[0].Height;
    // const firstDistance = heightData[0].MeterDistance;

    // const lastHeight = heightData[heightData.length - 1].Height;
    // const lastDistance = heightData[heightData.length - 1].MeterDistance;
    
    // const data2 = [firstHeight, lastHeight];
    // const dataX = [firstDistance, lastDistance];

    // console.log(data2)
    // console.log(dataX)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onLoad = useCallback(map => {
        console.log("LOADED MAP", map)
        setMap(map);
        const buttons = [
            ["Rotate Left", "rotate", 20, window.google.maps.ControlPosition.LEFT_CENTER],
            ["Rotate Right", "rotate", -20, window.google.maps.ControlPosition.RIGHT_CENTER],
            ["Tilt Down", "tilt", 20, window.google.maps.ControlPosition.TOP_CENTER],
            ["Tilt Up", "tilt", -20, window.google.maps.ControlPosition.BOTTOM_CENTER],
        ];
        
        buttons.forEach(([text, mode, amount, position]) => {
            const controlDiv = document.createElement("div");
            const controlUI = document.createElement("button");
        
            controlUI.classList.add("ui-button");
            controlUI.innerText = `${text}`;
            controlUI.addEventListener("click", () => {
                adjustMap(mode, amount);
            });
            controlDiv.appendChild(controlUI);
            map.controls[position].push(controlDiv);
        });
    
        const adjustMap = function (mode, amount) {
        switch (mode) {
            case "tilt":
                map.setTilt(map.getTilt() + amount);
                break;
            case "rotate":
                map.setHeading(map.getHeading() + amount);
                break;
            default:
                break;
        }
        };
    });
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDBLTSpjIfJadk-NSAchwpxMrKG3CrNgVw" // ,
        // ...otherOptions
      })
    
    
    const renderMap = () => {
        // wrapping to a function is useful in case you want to access `window.google`
        // to eg. setup options or create latLng object, it won't be available otherwise
        // feel free to render directly if you don't need that
        
        return (
            <div style={{
                display: "flex",
                height: "100%",
                width: "100%"
            }}>
                <GoogleMap
                    width="calc(100vw - 50px)"
                    onLoad={onLoad}
                    mapContainerStyle={{
                        height: "calc(90vh)",
                        flex: "1 1 0"
                    }}
                    onTiltChanged={(what) => {
                        // console.log("Tilt Changed", map.getTilt(), what);
                    }}
                    zoom={3}
                    center={{ lat: -34.397, lng: 150.644 }}
                    tilt={40}
                    rotateControl={true}
                    options={{
                        // heading: 320,
                        streetViewControl: true,
                        streetViewControlOptions: {
                            position: 6, // ControlPosition.RIGHT_BOTTOM,
                        },
                        // fullscreenControl: false,
                        zoomControl: true,
                        mapTypeId: 'satellite',
                        rotateControl: true
                        // gestureHandling: "auto",
                        // maxZoom: 24,
                        // minZoom: 7,
                        // disableDefaultUI: true,
                        //rotateControl: true,
                        //gestureHandling: "auto",
                    }}
                >
                    
                </GoogleMap>
            </div>
        )
      }
    
      if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>
      }
    
      return isLoaded ? renderMap() : "Could not loaded"
}

export default App;
