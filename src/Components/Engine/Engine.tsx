import React, { useState } from "react";
import RecomendationOptions from "./RecommendationOptions";
import { Collapse, Button, message, Form, Row, Col } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import SeedSearch from "./SeedSearch";
import axios from "axios";
import ResultTable from "./ResultTable";
import SeedTable from "./SeedTable";
import SeedRadar from "./SeedRadar.jsx";
import SpotifyPlayer from "react-spotify-web-playback";
import {SeedItem} from "../../Types/SeedItem";
import TrackItem from "../../Types/TrackItem";
import SpotifyAudioAnalysis from "../../Types/SpotifyAudioAnalysis";
import {RecommendationOptions} from "../../Types/RecommendationOptions";
import SpotifyArtist from "../../Types/SpotifyArtist";
import SpotifyTrack from "../../Types/SpotifyTrack";
import SeedDetailItem from "../../Types/SeedDetailItem";

const { Panel } = Collapse;

type EngineProps = {
  token: string
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

  /**
   * It takes the options object and returns a string that can be used as a query string for the API
   * @returns A string of the options that are enabled.
   */
  const generateOptions = () => {
    let retString = "";
    Object.keys(options).forEach((key) => {
      if (options[key].enabled) {
        retString += `&max_${key}=${options[key].range[1]}&min_${key}=${options[key].range[0]}&target_${key}=${options[key].target}`;
      }
    });
    return retString;
  };

  /**
   * It takes the user's input, sends it to the Spotify API, and then takes the response and sends it to
   * the Spotify Audio Features API to get more information about the tracks
   */
  const handleSearch = () => {
    setSearching(true);
    console.log("Searching...");
    // console.log(generateSeedQuery(), generateOptions());
    axios
      .get(
        "https://api.spotify.com/v1/recommendations" +
        generateSeedQuery() +
        generateOptions() +
        "&limit=100",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        // console.log(result.data);

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
                track.toneKey = audioFeature.key;
                track.analysisData = audioFeature;
                // delete audioFeature.key;
                Object.keys(audioFeature).forEach((key) => {
                  if (key !== "key") track[key] = audioFeature[key];
                });
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
    <div style={{ paddingLeft: 15, paddingRight: 15 }}>
      <Row>
        <Col span={expanded ? 16 : 23}>
          <div style={{ paddingBottom: 15 }}>
            <Form layout="inline">
              <Form.Item>
                <SeedSearch
                  token={token}
                  setSelectedSeeds={setSeed}
                  selectedSeeds={seed}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  loading={searching}
                  type="primary"
                  onClick={handleSearch}
                >
                  Wish me luck!
                </Button>
              </Form.Item>
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

          <Collapse style={{ marginBottom: 15 }} defaultActiveKey={[1]}>
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

          <ResultTable
            // tableDetail={tableDetail}
            setTableDetail={setTableDetail}
            data={searchResults}
            seeds={seed}
            setSeed={setSeed}
            token={token}
            // setPlaySong={setPlaySong}
          />
        </Col>
        <Button
          style={{
            position: "fixed",
            top: "45vh",
            right: expanded ? "" : "25px",
            left: expanded ? "67%" : "",
            zIndex: 100,
          }}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {!expanded ? <LeftOutlined /> : <RightOutlined />}
        </Button>
        {expanded ? (
          <Col span={8}>
            <div style={{ height: "100vh" }}>
              <div style={{ position: "fixed", top: "16vh", width: "33%" }}>
                <div style={{ marginLeft: 15, marginRight: 15, marginTop: 45 }}>
                  <h3>Audio Features</h3>
                  <hr />
                </div>
                <SeedRadar selected={tableDetail} data={seedDetails} />
                <div style={{ marginLeft: 15, marginTop: "50px" }}>
                  <SpotifyPlayer
                    token={token}
                    showSaveIcon={true}
                    syncExternalDevice={true}
                    autoPlay={true}
                    name={"Searchify - WebPlayer"}
                    syncExternalDeviceInterval={1}
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
                  />
                </div>
              </div>
            </div>
          </Col>
        ) : (
          ""
        )}
      </Row>
    </div>
  );
};

export default Engine;
