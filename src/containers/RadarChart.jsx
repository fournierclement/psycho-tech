import React from "react";
import { Radar } from "react-chartjs";

const lang_Fr = {
  "labels": ["Realiste", "Investigatif", "Artistique", "Social", "Entrepreneur", "Conventionnel"],
}

const chartOptions = {
  animation: false,
  showTooltips: true,
  pointLabelFontSize: 20,
  pointLabelFontColor: "#000",
  scaleLineColor: "#000",
  responsive: true,
  // scaleOverride: true,
	// scaleSteps: 4,
	// scaleStepWidth: 10,
	// scaleStartValue: 0,
}

export const RadarChart = ({ sessions }) => (
  <div className="RadarChart">
    <Radar
      data = {({
        labels: lang_Fr["labels"],
        datasets: sessions != false ? sessions : [{ label:null, data:[0, 0, 0, 0, 0, 0] }]
      })}
      options = { chartOptions }
      redraw
      />
  </div>
)

export const ChartWithLegend = ({ sessions }) => (
  <div className="RadarChart">
    <Radar
      data = {({
        labels: lang_Fr["labels"],
        datasets: sessions != false ? sessions : [{ label:null, data:[0, 0, 0, 0, 0, 0] }]
      })}
      options = { chartOptions }
      redraw
      />
    <ul className="RadarChart-legend">
    { sessions.map(({ fillColor, label }) => (
      <li>
        <span style={{"background-color": fillColor}}></span>
        <span>{ label }</span>
      </li>
    ))}
    </ul>
  </div>
);
