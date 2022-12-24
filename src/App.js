// import { VictoryChart, VictoryZoomContainer, VictoryScatter } from 'victory';
import React, { useState } from "react";
import ZoomableLineChart from "./Components/ZoomableLineChart";

function App() {
    const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);

    const data2 = [25, 75];

    const dataX = [0, 6];

    
    return (
        <div style={{ margin: 0 }}>
            <h2>Zoomable Line Chart with D3 </h2>
            <ZoomableLineChart data={data} data2={data2} dataX={dataX} />
            <button
                onClick={() => setData([...data, Math.round(Math.random() * 100)])}
            >
                Add data
            </button>
        </div>
      );
}

export default App;
