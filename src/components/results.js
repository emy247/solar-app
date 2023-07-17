import React from "react";
import "./results.css";
import sun from "./media/sun.png";
import location_energy from "./media/location_energy.png";
import "./results.css";
const Results = ({
  data,
  handleBack,
  city,
  peakpower,
  angle,
  aspect,
  optimal,
}) => {
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const panelInclination =
    90 +
    Number(optimal ? data.inputs.mounting_system.fixed.slope.value : angle);
  const barInclination = {
    "--bar-inclination": `rotate(${panelInclination}deg)`,
  };
  const maxMonth = Math.max(
    ...data.outputs.monthly.fixed.map((obj) => obj.E_m)
  );
  console.log(maxMonth);

  return (
    <div className="results">
      <div className="results-title">Results analysis</div>
      <button className="show-results back" onClick={handleBack}>
        Back
      </button>

      <div className="location-output">
        <div className="city-output">Location: {city}, Romania</div>
      </div>

      <div className="system-output">
        <img
          src={location_energy}
          alt=""
          className="location-energy-icon"
        ></img>
        <div className="peak-output">
          System capacity:<span className="peak-value">{peakpower}kW</span>
        </div>
      </div>

      <div className="info">
        <div className="annual-energy-title">Annual PV energy production</div>
        <div className="annual-energy">
          <div className="annual-energy-output">
            {" "}
            {data.outputs.totals.fixed.E_y > 1000
              ? `${(data.outputs.totals.fixed.E_y / 1000).toFixed(2)} MWh`
              : `${data.outputs.totals.fixed.E_y} kWh`}
          </div>
          <div className="annual-energy-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="9rem"
              height="9rem"
            >
              <defs>
                <linearGradient id="GradientColor">
                  <stop offset="0%" stop-color="#FF4500" />
                  <stop offset="100%" stop-color="#f0811a" />
                </linearGradient>
              </defs>
              <circle
                id="loadingCircle"
                cx="70"
                cy="70"
                r="60"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="panel-animation">
          <img className="sun" alt="" src={sun}></img>
          <div className="blue-bar" style={barInclination}></div>
          <div className="gray-bar"></div>
          <div className="brown-bar"></div>
          <div className="support-bar"></div>
        </div>

        <ul className="outputs">
          <li className="inclination1:">
            Inclination:{" "}
            <span className="output-angle inc">
              {optimal ? data.inputs.mounting_system.fixed.slope.value : angle}°
            </span>
          </li>
          <li className="azimuth1:">
            Azimuth:{" "}
            <span className="output-angle azi">
              {optimal
                ? data.inputs.mounting_system.fixed.azimuth.value
                : aspect}
              °
            </span>
          </li>
          <li className="total-loss1:">
            Total system loss:{" "}
            <span className="output-angle tot">
              {data.outputs.totals.fixed.l_total * -1}%
            </span>
          </li>
        </ul>
      </div>

      <div className="monthly-results">
        {data.outputs.monthly.fixed.map((item) => {
          const barHeight = 25 - (item.E_m / maxMonth) * 25;
          const bar = { "--bar-height": `${barHeight}rem` };

          return (
            <div key={item.month}>
              <div
                className="month-outputs"
                style={{ color: "rgba(255, 255, 255, 0)" }}
              >
                {item.E_m}kW
              </div>

              <div className="month-diagram-empty">
                <div className="month-output">
                  {item.E_m / 10 > 1000
                    ? `${(item.E_m / 1000).toFixed(2)}MWh`
                    : `${item.E_m}kWh`}
                </div>
              </div>
              <div className="month-diagram" style={bar}>
                <p className="month-name">{monthNames[item.month - 1]} </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
