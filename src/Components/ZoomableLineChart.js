import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  line,
  max,
  axisBottom,
  axisLeft,
  zoom,
  selectAll
} from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a ZoomableLineChart
 */

function ZoomableLineChart({ data, data2, dataX , id = "myZoomableLineChart" }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [currentZoomState, setCurrentZoomState] = useState();

  // will be called initially and on every data change
  useEffect(() => {
    const tip = selectAll(".tooltip");

    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();
    
    // scales + line generator
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([10, width - 10]);

    const yScale = scaleLinear()
      .domain([0, max(data)])
      .range([height - 10, 10]);

    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      xScale.domain(newXScale.domain());

      const newYScale = currentZoomState.rescaleY(yScale);
      yScale.domain(newYScale.domain());
    }

    

    const lineGenerator = line()
      .x((d, index) => xScale(index))
      .y((d) => yScale(d));

    const lineGenerator2 = line()
      .x((d, index) => xScale(dataX[index]))
      .y((d) => yScale(d));
      // .curve(curveCardinal);

    // render the line
    svgContent
      .selectAll(".myLine")
      .data([data])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", lineGenerator);


    // Add a line that connects the first and last point
    svgContent
      .selectAll(".myLine2")
      .data([data2])
      .join("path")
      .attr("class", "myLine2")
      .attr("stroke", "lightblue")
      .attr("fill", "none")
      .attr("d", lineGenerator2)
      .attr("stroke-width", 3);


    // const myline = svgContent.selectAll(".myLine");

    // myline.on("mouseover", function (event, d) {
    //   console.log("d", d)
    // })

    svgContent
      .selectAll(".myDot")
      .data(data)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", 4)
      .attr("fill", "orange")
      .attr("cx", (value, index) => xScale(index))
      .attr("cy", yScale)
      .attr("stroke-width", 30)
      .attr("stroke-opacity", 0)
      // .attr("stroke-linejoin", "round")

    const circles = svgContent
    .selectAll(".myDot");

  
    circles.on("mouseover", function (event, d) {
      // console.log("d", d)
      tip.style("opacity", 1)
            .html(d)
            .style("left", (event.pageX-25) + "px")
            .style("top", (event.pageY-35) + "px")
    })
    .on("mousemove", function(event) {
      return tip.style("left", (event.pageX-25) + "px")
                .style("top", (event.pageY-35) + "px")
    })
    .on("mouseout", function() {
      return tip.style("opacity", 0)
    })



    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);

    // zoom
    const zoomBehavior = zoom()
      .scaleExtent([0.5, 10000])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        setCurrentZoomState(zoomState);
      });

    svg.call(zoomBehavior);

  }, [currentZoomState, data, dimensions]);

  return (
    <React.Fragment>
      <div className="tooltip" style={{ opacity: "0" }}></div>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`}></g>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </React.Fragment>
  );
}

export default ZoomableLineChart;