import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export const GraphView = ({ nodes, edges, highlight }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!nodes || !edges) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d => d.name).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#444")
      .attr("stroke-width", 1.5)
      .selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", d => d.id === highlight ? "#ff4444" : "#444")
      .attr("stroke-width", d => d.id === highlight ? 3 : 1.5);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 14)
      .attr("fill", d => d.name === highlight ? "#ff4444" : "#888")
      .call(
        d3.drag()
          .on("start", dragStart)
          .on("drag", dragged)
          .on("end", dragEnd)
      );

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text(d => d.name)
      .attr("fill", "#eee")
      .attr("font-size", "12px")
      .attr("dx", 18)
      .attr("dy", 4);

    sim.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    function dragStart(event, d) {
      if (!event.active) sim.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnd(event, d) {
      if (!event.active) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [nodes, edges, highlight]);

  return (
    <svg
      ref={ref}
      style={{
        width: "100%",
        height: "600px",
        background: "#000",
        border: "1px solid #333",
        borderRadius: "8px"
      }}
    />
  );
};