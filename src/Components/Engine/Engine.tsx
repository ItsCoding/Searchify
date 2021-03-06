import React, { useEffect, useState } from "react";
import RecomendationOptions from "./RecommendationOptions";
import { Collapse, Button, message, Form, Row, Col, Tooltip, Slider, Spin, Alert } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SeedSearch from "./SeedSearch";
import axios from "axios";
import ResultTable from "./ResultTable";
import SeedTable from "./SeedTable";
import SeedRadar from "./SeedRadar.jsx";
import SpotifyPlayer from "react-spotify-web-playback";
import { SeedItem } from "../../Types/SeedItem";
import TrackItem from "../../Types/TrackItem";
import SpotifyAudioAnalysis from "../../Types/SpotifyAudioAnalysis";
import { RecommendationOptions } from "../../Types/RecommendationOptions";
import SpotifyArtist from "../../Types/SpotifyArtist";
import SpotifyTrack from "../../Types/SpotifyTrack";
import SeedDetailItem from "../../Types/SeedDetailItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faClover, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { Steps, Hints } from 'intro.js-react';
import { steps } from "../System/steps"
import Footer from "../System/Footer"
const { Panel } = Collapse;

// const steps = [
//   {
//     element: '.selector1',
//     intro: 'test 1',
//     position: 'right',
//     tooltipClass: 'myTooltipClass',
//     highlightClass: 'myHighlightClass',
//   },
//   {
//     element: '.selector2',
//     intro: 'test 2',
//   },
//   {
//     element: '.selector3',
//     intro: 'test 3',
//   },
// ];

type EngineProps = {
  token: string
}

type AllCount = {
  max: number,
  count: number
}

const Engine = ({ token }: EngineProps) => {
  const [options, setOptions] = useState<RecommendationOptions>({});
  // const [playSong, setPlaySong] = useState([]);
  const [seed, setSeed] = useState<Array<SeedItem>>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Array<TrackItem>>([]);
  const [seedDetails, setSeedDetails] = useState<Array<SeedDetailItem>>([]);
  const [tableDetail, setTableDetail] = useState<Array<TrackItem>>([]);
  // const [clickedTableDetail, setClickedTableDetail] = useState([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [addAllLoading, setAddAllLoading] = useState<boolean>(false);
  const [addAllCount, setAddAllCount] = useState<AllCount>({ max: 0, count: 0 });
  const [matchRange, setMatchRange] = useState<number>(0);
  const [firstOpenMenu, setFirstOpenMenu] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [collapseActiveKey, setCollapseActiveKey] = useState<string | string[]>(["0"]);
  const [focusedByTutorial, setFocusedByTutorial] = useState<number>(0);
  const [loadingTurorial, setLoadingTutorial] = useState<boolean>(false)
  useEffect(() => {
    if (window.localStorage.getItem("tutorial_done") !== "true") {
      startGuide();
      window.localStorage.setItem("tutorial_done", "true")
    }

  }, [])

  const rangeHelp = "Slider to adjust the deviation of you search. If you have just one track in the seed table, you can search for the mood values +- the deviation. To do this adjust the slider and click the blue 'Exact match' button. Everything under 0.2 deviation might bring no results."

  const startGuide = () => {
    console.log("Guide started")
    setLoadingTutorial(true);
    setExpanded(true);
    setCollapseActiveKey("2")
    setTimeout(() => {
      setLoadingTutorial(false)
      setTimeout(() => {
        setShowGuide(true)
      }, 50);
    }, 500);

  }


  const stepHandler = (nextStep: number) => {
    console.log(nextStep, "STEP")
    setFocusedByTutorial(nextStep);
    switch (nextStep) {
      case 2:
        if (seed.length < 1 || !seed.find(se => se.type === "track")) {
          message.info("Please select a track that you like to continue this tutorial ???? ")
          return false;
        }
        break;
    }
  }
  // console.log(steps)


  /**
   * It takes the seed array and converts it into a query string that can be used to make a request to
   * the Spotify API
   * @returns A string that is a query string that can be used to make a request to the Spotify API.
   */
  const generateSeedQuery = () => {
    let artists = "";
    let genres = "";
    let tracks = "";
    seed.forEach((item) => {
      if (item.type === "artist") {
        artists += item.spotifyseed.split(":")[2] + ",";
      } else if (item.type === "genre") {
        genres += item.spotifyseed + ",";
      } else if (item.type === "track") {
        tracks += item.spotifyseed.split(":")[2] + ",";
      }
    });
    let retQuery = "";
    if (artists.length > 0) {
      retQuery += "&seed_artists=" + artists;
    }
    if (genres.length > 0) {
      retQuery += "&seed_genres=" + genres;
    }
    if (tracks.length > 0) {
      retQuery += "&seed_tracks=" + tracks;
    }
    //replace first & with ?
    return retQuery.replace("&", "?");
  };

  const stayOne = (x: number, add: number) => {
    let ret = x + add;
    if (ret > 1) {
      ret = 1;
    } else if (ret < 0) {
      ret = 0;
    }
    return ret;
  }

  const exactMatch = () => {

    if (seed.length === 0) {
      message.warn("You must have at least one seed item");
      return;
    }
    if (seedDetails.length > 1 || seed[0]?.type !== "track") {
      message.warn("You can only use exact match with one track seed item");
      return;
    } else {
      console.log("Setting settings...");
      let newOptions: RecommendationOptions = {};
      [
        "acousticness",
        "danceability",
        "energy",
        "instrumentalness",
        "liveness",
        "speechiness",
        "valence",
      ].forEach(feature => {
        let value = seedDetails[0][feature] ?? 0;
        newOptions[feature] = {
          enabled: true,
          target: parseFloat(parseFloat(value.toString()).toFixed(2)),
          range: [parseFloat(stayOne(parseFloat(value.toString() ?? "0"), -matchRange).toFixed(2)), parseFloat(stayOne(parseFloat(value?.toString() ?? "1"), matchRange).toFixed(2))]
        }
      })
      console.log("NEW SETTINGS ========>", newOptions);
      setOptions(newOptions);
      handleSearch(newOptions);
    }
  }



  /**
   * It takes the options object and returns a string that can be used as a query string for the API
   * @returns A string of the options that are enabled.
   */
  const generateOptions = (opts: RecommendationOptions) => {
    let retString = "";
    console.log("SEARCHING WITH OPTIONS:", opts);
    Object.keys(opts).forEach((key) => {
      if (opts[key].enabled) {
        retString += `&max_${key}=${opts[key].range[1]}&min_${key}=${opts[key].range[0]}&target_${key}=${opts[key].target}`;
      }
    });
    return retString;
  };


  const addAllToQueue = async () => {
    setAddAllCount({ max: searchResults.length, count: 0 });
    setAddAllLoading(true);

    try {
      for (let i in searchResults) {
        setAddAllCount({ max: searchResults.length, count: parseInt(i) + 1 });
        let item: TrackItem = searchResults[i];
        await axios({
          url: `https://api.spotify.com/v1/me/player/queue?uri=${item.uri}`,
          method: "post",
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      }
      message.success("Added all songs to queue");
    } catch (error) {
      message.error("Failed to add songs to queue");
    }
    setAddAllLoading(false);
  }



  const calculateSeedAVG = (key: string) => {
    let sum = 0;
    seedDetails.forEach(seed => {
      sum += parseFloat(seed[key]?.toString() ?? "0");
    })
    return (sum / seedDetails.length);
  }

  const calculateOverlapping = (track: TrackItem) => {
    let diffSum = 0;
    [
      "acousticness",
      "danceability",
      "energy",
      "instrumentalness",
      "liveness",
      "speechiness",
      "valence",
    ].forEach(key => {
      diffSum += Math.abs(parseFloat(track[key]?.toString() ?? "0") - calculateSeedAVG(key));
    })
    return ((1 - (diffSum / 7)) * 100);
  }

  /**
   * It takes the user's input, sends it to the Spotify API, and then takes the response and sends it to
   * the Spotify Audio Features API to get more information about the tracks
   */
  const handleSearch = (opts: RecommendationOptions = options) => {
    setShowGuide(false);
    if (seed.length === 0) {
      message.warn("You must have at least one seed item");
      return;
    }
    setSearching(true);
    console.log("Searching...");
    console.log("Searching for seeds: ", seed);
    // console.log(generateSeedQuery(), generateOptions());
    axios
      .get(
        "https://api.spotify.com/v1/recommendations" +
        generateSeedQuery() +
        generateOptions(opts) +
        "&limit=100",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        // console.log(result.data);
        if (result.data.tracks.length < 1) {
          setSearching(false)
          message.warn("Your search is to narrow! Couldn??t find anything that would match...")
          return;
        }
        const mappedResult: Array<TrackItem> = result.data.tracks.map((track: SpotifyTrack) => {
          const mappedTrack: TrackItem = {
            title: track.name,
            artists: track.artists.map((artist: SpotifyArtist) => artist.name).join(", "),
            album: track.album.name,
            cover: track.album.images[2].url,
            uri: track.uri,
            preview: track.preview_url,
            duration: track.duration_ms,
            key: track.uri,
            resultObject: true,
            url: track.external_urls.spotify,
            artistIDs: track.artists.map(art => art.id)
          }
          return mappedTrack;
        });
        const featuresQuery = mappedResult
          .map((track) => track.uri.split(":")[2])
          .join(",");
        // console.log("Features Query: ", featuresQuery);
        axios
          .get(
            "https://api.spotify.com/v1/audio-features?ids=" + featuresQuery,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
          .then((result) => {
            const sDetails: Array<SpotifyAudioAnalysis> = result.data.audio_features;
            // console.log("Audio Features: ", sDetails);
            let i = 0;
            sDetails.forEach((audioFeature) => {
              const track = mappedResult.find((t) => t.uri === audioFeature.uri);
              if (track) {
                track.toneKey = parseInt(audioFeature.key.toString());
                track.analysisData = audioFeature;
                // delete audioFeature.key;
                Object.keys(audioFeature).forEach((key) => {
                  if (key !== "key") track[key] = audioFeature[key];
                });
                track.overlapping = calculateOverlapping(track);
                i++;
                // console.log(i, track.name, track.key, track.tempo, audioFeature);
              }
            });
            setSearching(false);
            setSearchResults(mappedResult);
            // console.log(sDetails, "Analysis Result ######");
          });
      })
      .catch((err) => {
        console.log(err);
        message.error("Error searching for recommendations");
        setSearching(false);
      });
  };
  return (
    <Spin spinning={loadingTurorial} size="large" tip="Preparing tutorial...">
      <div style={{ paddingLeft: 15, paddingRight: 15 }}>
        <Steps
          enabled={showGuide}
          steps={steps}
          initialStep={0}
          onExit={() => { setShowGuide(false) }}
          onBeforeChange={stepHandler}

        />
        <Row>
          <Col span={expanded ? 16 : 23}>
            <div style={{ paddingBottom: 15 }}>
              <Form layout="inline">
                <Form.Item>
                  <SeedSearch
                    focusedByTutorial={focusedByTutorial}
                    token={token}
                    setSelectedSeeds={setSeed}
                    selectedSeeds={seed}
                  />
                </Form.Item>
                {/* <Form.Item>
               
              </Form.Item> */}
              </Form>
            </div>
            <div style={{ paddingBottom: 15 }}>
              <SeedTable
                seedDetails={seedDetails}
                setSeedDetails={setSeedDetails}
                seeds={seed}
                token={token}
                setSeed={setSeed}
              />
            </div>

            <Collapse style={{ marginBottom: 15 }} activeKey={collapseActiveKey} onChange={(changeKey) => setCollapseActiveKey(changeKey)}>
              {/* <Panel header="Seed Details" key="1">
            
        </Panel> */}
              <Panel header="Search parameter" key="2">
                <RecomendationOptions
                  expanded={expanded}
                  setOptions={setOptions}
                  options={options}
                />
              </Panel>
            </Collapse>
            <Row style={{
              marginBottom: 15,
            }}>
              <Col span={12}>
                <Form layout="inline" >
                  <Form.Item>
                    <Button
                      id="wish_me_luck"
                      style={{
                        backgroundColor: "#2e7d32",
                        borderColor: "#2e7d32",
                      }}
                      loading={searching}
                      type="primary"
                      onClick={() => handleSearch()}
                    >
                      <FontAwesomeIcon icon={faClover} style={{ marginRight: 5 }} />Wish me luck!
                    </Button>
                  </Form.Item>
                  {/* <div id="exact_match_tools"> */}
                  <Form.Item>
                    <Button
                      className="exact_match_tools"
                      loading={searching}
                      type="primary"
                      onClick={exactMatch}
                    >
                      <FontAwesomeIcon icon={faMapPin} style={{ marginRight: 5 }} />Exact match
                    </Button>
                  </Form.Item>
                  <Form.Item style={{ minWidth: 150 }} label={<Tooltip placement="bottom" title={rangeHelp}>Range</Tooltip>}>
                    <Slider className="exact_match_tools" min={0} max={1} step={0.01} defaultValue={0.1} onChange={val => setMatchRange(val)} />
                  </Form.Item>
                  {/* </div> */}

                </Form>
              </Col>
              <Col offset={10} span={2}>

                <Button type="default"
                  loading={addAllLoading}
                  onClick={addAllToQueue}
                  style={{ float: "right" }}>
                  {addAllLoading ? `Adding ... ${addAllCount.count}/${addAllCount.max}` : "Add all to Queue"}
                </Button>

              </Col>
            </Row>





            <ResultTable
              // tableDetail={tableDetail}
              setTableDetail={setTableDetail}
              data={searchResults}
              seeds={seed}
              setSeed={setSeed}
              token={token}
              seedDetails={seedDetails}
            // setPlaySong={setPlaySong}
            />
          </Col>
          {/* <Tooltip placement="topRight" title={"Open Me :)"} visible={firstOpenMenu} trigger={"contextMenu"}> */}
          <Button
            style={{
              position: "fixed",
              top: "45vh",
              right: expanded ? "" : "25px",
              left: expanded ? "67%" : "",
              zIndex: 100,
              width: "40px"
            }}
            onClick={() => {
              setFirstOpenMenu(false)
              setExpanded((prev) => !prev)
            }}>{!expanded ? <LeftOutlined /> : <RightOutlined />}</Button>
          {/* </Tooltip> */}


          {expanded ? (
            <Col span={8}>
              <div style={{ height: "100vh" }}>
                <div style={{ position: "fixed", top: "16vh", width: "33%" }}>
                  <div style={{ marginLeft: 15, marginRight: 15, marginTop: 45 }}>
                    <h3>Audio Features  <small style={{ color: "#545454" }}>provided by <FontAwesomeIcon icon={faSpotify} size={"sm"}></FontAwesomeIcon></small></h3>
                    <hr />
                  </div>
                  <SeedRadar selected={tableDetail} data={seedDetails} />
                  <div style={{ marginLeft: 15, marginTop: "50px" }}>
                    {/* <SpotifyPlayer
                      token={token}
                      showSaveIcon={true}
                      syncExternalDevice={true}
                      autoPlay={true}
                      name={"Searchify - WebPlayer"}
                      syncExternalDeviceInterval={10}
                      // uris={playSong}
                      styles={{
                        // height: 120,
                        activeColor: "#00000",
                        bgColor: "#0000",
                        color: "#fff",
                        loaderColor: "#fff",
                        sliderHandleColor: "#ffff",
                        sliderColor: "#1cb954",
                        trackArtistColor: "#ccc",
                        trackNameColor: "#fff",
                        errorColor: "#fff",
                      }}
                    /> */}
                    <Alert message="Spotify changed something on their side... Player is temporarily deactivated" type="warning"/>
                  </div>
                </div>
              </div>
            </Col>
          ) : (
            ""
          )}
        </Row>
        <Footer addition={<> | <a onClick={() => startGuide()}>Tutorial</a></>} />
      </div >
    </Spin>
  );
};

export default Engine;
