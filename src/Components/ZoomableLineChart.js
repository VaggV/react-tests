import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  line,
  axisBottom,
  axisLeft,
  zoom,
  selectAll
} from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a ZoomableLineChart
 */

function ZoomableLineChart({ data, data2, dataX, maxHeight, minHeight, id = "myZoomableLineChart" }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [currentZoomState, setCurrentZoomState] = useState();

  // console.log("rerender")

  // will be called initially and on every data change
  useEffect(() => {
    const tip = selectAll(".tooltip");

    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } = { width: 600, height: 600};
      // dimensions || wrapperRef.current.getBoundingClientRect();
    
    // scales + line generator
    const xScale = scaleLinear()
      .domain([0, data[data.length - 1].MeterDistance])
      .range([10, width - 10]);

    const yScale = scaleLinear()
      .domain([minHeight, maxHeight])
      .range([height - 10, 10]);


    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      xScale.domain(newXScale.domain());

      const newYScale = currentZoomState.rescaleY(yScale);
      yScale.domain(newYScale.domain());
    }

    

    const lineGenerator = line()
      .x((d) => xScale(d.MeterDistance))
      .y((d) => yScale(d.Height));

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
      .attr("fill", (value) => (value.IsVisible ? "green" : "red")) 
      .attr("cx", (value) => xScale(value.MeterDistance))
      .attr("cy", (value) => yScale(value.Height))
      // .attr("stroke-width", 30)
      // .attr("stroke-opacity", 0)
      .attr("content-visibility", "auto")
      // .attr("stroke-linejoin", "round")

    const circles = svgContent
    .selectAll(".myDot");

  
    circles.on("mouseover", function (event, d) {
      // console.log("d", d)
      tip.style("opacity", 1)
            .html(d.Height.toFixed(2))
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
    const xAxis = axisBottom(xScale)
    .ticks(((width + 2) / (height + 2)) * 10)
    .tickSize(-height)
    .tickPadding(8)
    // Make the first and last tick invisible
    .tickSizeOuter(0)
    // Make the space between each tick smaller

    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .attr("stroke-opacity", `0.1`)
      .attr("shape-rendering", `crispEdges`);

    const yAxis = axisLeft(yScale)
    .ticks(10)
    .tickSize(-width)
    .tickPadding(8)
    .tickSizeOuter(0)
    
    svg
    .select(".y-axis")
    .call(yAxis)
    .attr("stroke-opacity", `0.1`)
    .attr("shape-rendering", `crispEdges`);

    // zoom
    const zoomBehavior = zoom()
      .scaleExtent([0.5, 10000]) // Min zoom level, max zoom level, 1 is default, 0.5 is smaller
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        setCurrentZoomState(zoomState);
        // console.log("zoomstate", zoomState.k)
      });

    svg.call(zoomBehavior);

  }, [currentZoomState, data, data2, dataX, dimensions, maxHeight, minHeight]);

  return (
    <React.Fragment>
      <div className="tooltip"></div>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <defs>
            <clipPath id="myChart">
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={'url(#myChart)'}></g>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </React.Fragment>
  );
}

export default ZoomableLineChart;