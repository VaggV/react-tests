import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  line,
  axisBottom,
  axisLeft,
  zoom,
  selectAll,
  pointer,
  least,
  map
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
    const X = map(data, function(d) { return d.MeterDistance; });
    const Y = map(data, function(d) { return d.Height; });
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

    function mousemove(event) {
      const x = xScale.invert(pointer(event)[0]);
      const y = yScale.invert(pointer(event)[1]);
      
      tip.style("opacity", 1)
        .html("<strong style='background-color: inherit;'>Height: </strong>" + x.toFixed(2) + "m<br /><strong style='background-color: inherit;'>Distance: </strong>" + y.toFixed(2) + "m")
        .style("left", (event.pageX - 65) + "px")
        .style("top", (event.pageY - 58) + "px");

      const [xm, ym] = pointer(event);
      const i = least(data, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
      console.log("i", i)
    }

    // render the line
    svgContent
      .selectAll(".myLine")
      .data([data])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", lineGenerator)
      .on("mousemove", mousemove)
      .on("mouseout", () => tip.style("opacity", 0))
      .on("mouseover", () => tip.style("opacity", 1))

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

    const circles = svgContent
      .selectAll(".myDot")
      .data(data);

    // svgContent
    // .selectAll('text')
    // .data(data)
    // .enter()
    // .append('text')    
    // .text(function(d, i) {
    //   return "dsadasdad";
    // })
    // .attr('x', function(d, i) {
    //   console.log("d", d)
    //   return xScale(d.MeterDistance);
    // })
    // .attr('y', function(d, i) {
    //   return yScale(d.Height);
    // })
    

    circles.join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", 4)
      .attr("fill", (value) => (value.IsVisible ? "green" : "red")) 
      .attr("cx", (value) => xScale(value.MeterDistance))
      .attr("cy", (value) => yScale(value.Height))
      .attr("stroke-width", 30)
      .attr("stroke-opacity", 0)
      // .attr("content-visibility", "hidden")
      // .attr("stroke-linejoin", "round")


    circles.on("mouseover", function (event, d) {
      // console.log("event1", event)
      tip.style("opacity", 1)
            .html("<strong style='background-color: inherit;'>Height: </strong>" + d.Height.toFixed(2) + "m<br /><strong style='background-color: inherit;'>Distance: </strong>" + d.MeterDistance.toFixed(2) + "m")
            .style("left", (event.pageX - 65) + "px")
            .style("top", (event.pageY - 58) + "px")
    })
    .on("mousemove", function(event) {
      return tip.style("left", (event.pageX - 75) + "px")
                .style("top", (event.pageY - 60) + "px")
    })
    .on("mouseout", function() {
      return tip.style("opacity", 0)
    })



    // axes
    const xAxis = axisBottom(xScale)
    .ticks(((width + 2) / (height + 2)) * 10)
    .tickSize(-height)
    .tickPadding(16)
    // Make the first and last tick invisible
    .tickSizeOuter(0)

    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .attr("stroke-opacity", `0.1`)
      // .attr("shape-rendering", `crispEdges`);

    const yAxis = axisLeft(yScale)
    .ticks(10)
    .tickSize(-width)
    .tickPadding(8)
    .tickSizeOuter(0)
    
    svg
    .select(".y-axis")
    .call(yAxis)
    .attr("stroke-opacity", `0.1`)
    // .attr("shape-rendering", `crispEdges`);

    const testingg = selectAll(".testingg");
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


    testingg.call(zoomBehavior);
    
    const dot = svg.append("g")
      .attr("display", "none");

    dot.append("circle")
        .attr("r", 2.5);

    dot.append("text")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("y", -8);

    
  }, [currentZoomState, data, data2, dataX, dimensions, maxHeight, minHeight]);

  return (
    <React.Fragment>
      <div className="tooltip"></div>

      <div className='testingg'  ref={wrapperRef} style={{ marginBottom: "2rem" }}>

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