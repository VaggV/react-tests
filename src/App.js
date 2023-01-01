// import { VictoryChart, VictoryZoomContainer, VictoryScatter } from 'victory';
import React from "react";
import ZoomableLineChart from "./Components/ZoomableLineChart";
import heightData from "./data/data.json";

function App() {
    // const [data, setData] = useState([25, 30, 45, 60, 70, 65, 75]);
    

    // const data2 = [25, 75];

    // const dataX = [0, 6];

    // // Get the max height of the data
    const maxHeight = Math.max(...heightData.map((d) => d.Height));
    // // Get the min height of the data
    const minHeight = Math.min(...heightData.map((d) => d.Height));

    // Get the first and last heights of the data
    const firstHeight = heightData[0].Height;
    const firstDistance = heightData[0].MeterDistance;

    const lastHeight = heightData[heightData.length - 1].Height;
    const lastDistance = heightData[heightData.length - 1].MeterDistance;
    
    const data2 = [firstHeight, lastHeight];
    const dataX = [firstDistance, lastDistance];

    // console.log(data2)
    // console.log(dataX)
    return (
        <div style={{ margin: 0 }}>
            <h2>Zoomable Line Chart with D3 </h2>
            <ZoomableLineChart 
                data={heightData}
                data2={data2}
                dataX={dataX}
                maxHeight={maxHeight}
                minHeight={minHeight}
            />
        </div>
      );
}

export default App;
