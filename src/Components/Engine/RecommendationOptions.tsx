import React, { useState, Dispatch, ReactNode } from "react";
import { Row, Form, Col, Card, Checkbox, Tooltip } from "antd";
import PitchClass from "../../System/PitchClass";
import { recomendationHelps } from "../../System/Help";
import { RecommendationOption, RecommendationOptions } from "../../Types/RecommendationOptions";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import Slider from "@mui/material/Slider";
// const recomendationHelps = Help.recomendationHelps;

/* A list of all the options that can be used to filter the recomendations. */
const recomendationOptions = [
  "acousticness",
  "danceability",
  "energy",
  "instrumentalness",
  "key",
  "liveness",
  "mode",
  "popularity",
  "speechiness",
  "tempo",
  "time_signature",
  "valence",
];


/* A dictionary that contains the min, max, and step values for the sliders. */

type recommendationSpecials = {
  [key: string]: {
    from: number;
    to: number;
    step: number;
    tooltip: (value: number | undefined,index: number) => string;
  }
}

const defaultFormatter = (s: number | undefined): string => {
  if (s === undefined) {
    return "undefined"
  }
  return s.toFixed(2);
};

const recomendationOptionsSpecials: recommendationSpecials = {
  key: {
    from: 0,
    to: 11,
    step: 1,
    tooltip: (value,index) => PitchClass.keyToPitchClass(value),
  },
  popularity: {
    from: 0,
    to: 100,
    step: 1,
    tooltip: (value,index) => defaultFormatter(value)
  },
  tempo: {
    from: 0,
    to: 200,
    step: 1,
    tooltip: (value,index) => defaultFormatter(value)
  },
  time_signature: {
    from: 3,
    to: 7,
    step: 1,
    tooltip: (value,index) => defaultFormatter(value)
  },
};

type RecomendationOptionProps = {
  option: string,
  optionDict: RecommendationOptions,
  changeOption: (option: string, value: RecommendationOption) => void,
}

type RecomendationOptionsProps = {
  setOptions: Dispatch<RecommendationOptions>,
  expanded: boolean,
  options: RecommendationOptions
}


const RecomendationOption = ({ option, changeOption, optionDict }: RecomendationOptionProps) => {
  const [target, setTarget] = useState(0);
  const [range, setRange] = useState([0, 0]);
  const [enabled, setEnabled] = useState(false);

  React.useEffect(() => {
    if (enabled != optionDict[option]?.enabled) {
      setEnabled(optionDict[option]?.enabled);
    }
  }, [optionDict])


  const onCheckChange = (e: CheckboxChangeEvent) => {
    setEnabled(e.target?.checked);
    //check if the option is in the dictionary
    if (optionDict[option]) {
      changeOption(option, {
        enabled: e.target.checked,
        target: target,
        range: range,
      });
    }else{
      changeOption(option, {
        enabled: e.target.checked,
        target: 0.5,
        range: [0,1],
      });
    }
    
  };

  // const onTargetChange = (value: number) => {
  //   setTarget(value);
  //   changeOption(option, {
  //     enabled: enabled,
  //     target: value,
  //     range: range,
  //   });
  // };

  const onRangeChange = (value: number[]) => {
    if (Array.isArray(value)) {
      setRange(value);
      changeOption(option, {
        enabled: enabled,
        target: value[1],
        range: [value[0], value[2]],
      });
    }

  };

  const valuetext = (value: number) => {
    return `${value}`;
  }


  return (
    <div>
      <Card
        size="small"
        title={
          <>
            <Tooltip placement="top" title={<p>{recomendationHelps[option]} - <a href="https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features" rel="noreferrer" target={"_blank"}>by Spotify</a></p>}>
              {option.charAt(0).toUpperCase() +
                option.slice(1).replace("_", " ")}
            </Tooltip>
          </>
        }
        style={{ marginBottom: 15 }}
        bodyStyle={{
          paddingLeft: 20,
          paddingRight: 20
        }}
        key={option + "-card"}
        extra={
          <Checkbox checked={enabled} onChange={onCheckChange}>
            Enabled
          </Checkbox>
        }
      >
        {enabled ? (
          <>
              <Slider
                
                // defaultValue={[0,0.5,1]}
                valueLabelDisplay="auto"
                getAriaValueText={recomendationOptionsSpecials[option]?.tooltip}
                onChange={(event, value) => {
                  if (Array.isArray(value)) {
                    onRangeChange(value)
                    // console.log(value)
                  }
                }}
                value={[optionDict[option]?.range[0], optionDict[option]?.target, optionDict[option]?.range[1]]}
              
                max={
                  recomendationOptionsSpecials[option]
                    ? recomendationOptionsSpecials[option].to
                    : 1
                }
                min={
                  recomendationOptionsSpecials[option]
                    ? recomendationOptionsSpecials[option].from
                    : 0
                }
                step={
                  recomendationOptionsSpecials[option]
                    ? recomendationOptionsSpecials[option].step
                    : 0.01
                }
              />
            {/* <Form.Item label="Min/Max">
              <Slider
                tipFormatter={
                  recomendationOptionsSpecials[option]?.tooltip
                }
                onChange={onRangeChange}
                range={{ draggableTrack: true }}
                value={[optionDict[option]?.range[0], optionDict[option]?.range[1]]}
                max={
                  recomendationOptionsSpecials[option]
                    ? recomendationOptionsSpecials[option].to
                    : 1
                }
                min={
                  recomendationOptionsSpecials[option]
                    ? recomendationOptionsSpecials[option].from
                    : 0
                }
                step={
                  recomendationOptionsSpecials[option]
                    ? recomendationOptionsSpecials[option].step
                    : 0.01
                }
              />
            </Form.Item> */}
          </>
        ) : null}
      </Card>
    </div>
  );
};

const RecomendationOptions = ({ setOptions, expanded, options }: RecomendationOptionsProps) => {
  // const [optionDict, setOptionDict] = useState({});

  const changeOption = (option: string, value: RecommendationOption) => {
    // console.log({
    //   ...optionDict,
    //   [option]: value,
    // });
    // setOptionDict({
    //   ...optionDict,
    //   [option]: value,
    // });
    setOptions({
      ...options,
      [option]: value,
    });
  };

  const sortOptions = (a: string, b: string) => {
    if (options[a]?.enabled && !options[b]?.enabled) {
      return -1;
    } else {
      return 1;
    }
    // if (!optionDict[a]?.enabled && optionDict[b]?.enabled) {
    //   return 1;
    // }
  };

  return (
    <div  id="recommendation_options">
      <Row gutter={16}>
        {recomendationOptions.sort(sortOptions).map((option) => {
          return (
            <Col className="gutter-row" span={!expanded ? 4 : 6} key={option + "-col"}>
              <RecomendationOption
                optionDict={options}
                changeOption={changeOption}
                option={option}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default RecomendationOptions;
