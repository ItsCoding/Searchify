import React from "react";
import PropTypes from 'prop-types';
// import ReactDOM from "react-dom";
import { Result } from "antd";
import { Radar } from "@ant-design/plots";

const SeedRadar = ({ data, selected = [] }) => {
  //   const [data, setData] = useState([]);

  //   useEffect(() => {
  //     asyncFetch();
  //   }, []);

  //   const asyncFetch = () => {
  //     fetch('https://gw.alipayobjects.com/os/antfincdn/svFjSfJkYy/radar.json')
  //       .then((response) => response.json())
  //       .then((json) => setData(json))
  //       .catch((error) => {
  //         console.log('fetch data failed', error);
  //       });
  //   };
  /* The configuration for the radar chart. */

  // const selectedArea = selected.length
  //   ? {
  //       style: (x, y, series) => {
  //         return {
  //           fill: series === selected.title ? "#7efff5" : "#273c75",
  //         };
  //       },
  //     }
  //   : {};

  const config = {
    theme: {
      theme: "dark",
      colors10: [
        "#2e7d32", 
        "#c62828",
        "#4834d4",
        "#be2edd",
        "#f0932b",
        "#7efff5",
      ],
    },
    xField: "item",
    yField: "score",
    seriesField: "track",
    meta: {
      score: {
        alias: "Unknown",
        min: 0,
        max: 1,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
      grid: {
        line: {
          style: {
            lineDash: null,
          },
        },
      },
    },
    // height: 900,
    // width: 100,

    legend: false,
    area: {
      //...selectedArea
    },
    height: 450,
    point: {
      size: 2,
    },
    domStyles: {
      "g2-tooltip": {
        zIndex : 1000
      }
    }
  };

  /**
   * It takes an array of objects, and returns an array of objects with the same keys, but with the
   * values of the keys being the values of the keys in the original array
   * @param dt - the data that we're going to convert
   * @returns An array of objects with the following keys: item, track, score
   */
  const convertData = (dt) => {
    const result = [];
    dt.forEach((item) => {
      [
        "acousticness",
        "danceability",
        "energy",
        "instrumentalness",
        "liveness",
        "speechiness",
        "valence",
      ].forEach((key) => {
        result.push({
          item: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
          track: item.title,
          score: item[key],
        });
      });
    });
    return result;
  };

  return (
    <div>
      {data.length < 1 ? (
        <div className="center-content">
          <Result title="Select a trackseed to see the audio features" />
        </div>
      ) : (
        <>
          <Radar
            appendPadding={30}
            data={convertData([...data, ...selected])}
            {...config}
          />
        </>
      )}
    </div>
  );
};

SeedRadar.propTypes = {
  data: PropTypes.array,
  selected: PropTypes.array,
};

export default SeedRadar;
