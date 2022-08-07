import { Card, Col, message, Row, Skeleton, Spin, Table } from "antd"
import { Dispatch, SetStateAction, useState } from "react"
import { ApiService } from "../../../System/ApiService"
import SeedDetailItem from "../../../Types/SeedDetailItem"
import { SeedItem } from "../../../Types/SeedItem"
import SpotifyAudioAnalysis from "../../../Types/SpotifyAudioAnalysis"
import { SpotifyPlaylist } from "../../../Types/SpotifyPlaylist"
import SpotifyTrack from "../../../Types/SpotifyTrack"
import TrackItem from "../../../Types/TrackItem"
import { BpmChange } from "./Analytics/BpmChange"
import { FeaturesOverview } from "./Analytics/FeaturesOverview"
import { PlayTime } from "./Analytics/Playtime"
import MediaTable from "./Overview/MediaTable"
import { TreeSidebar } from "./Overview/TreeSidebar"

type MediaViewProps = {
    token: string,
    seeds: Array<SeedItem>,
    setSeed: Dispatch<SetStateAction<SeedItem[]>>,
    seedDetails: Array<SeedDetailItem>,
    visible: boolean
}



export const MediaView = ({ token, seeds, setSeed, seedDetails, visible }: MediaViewProps) => {
    const apiService = new ApiService(token);
    const [focusedPlaylist, setFocusedPlaylist] = useState<SpotifyPlaylist | null>(null);
    const [playlistData, setPlaylistData] = useState<TrackItem[] | null>([]);
    const [loading, setLoading] = useState(false);


    const convertToTrackItem = async (data: { track: SpotifyTrack, is_local: boolean }[]) => {

        const trackItems: TrackItem[] = [];
        const analyticsDict: { [key: string]: SpotifyAudioAnalysis } = {}

        let analyticsResult: SpotifyAudioAnalysis[] = [];
        const trackIDs = data.map(track => track.track.id);
        //loop over trackIDs in 100 chunks
        for (let i = 0; i < trackIDs.length; i += 100) {
            const chunk = trackIDs.slice(i, i + 100);
            const result = await apiService.getAudioFeatures(chunk.join(","));
            analyticsResult = [...analyticsResult, ...result.audio_features];
        }

        analyticsResult.forEach(analytics => {
            if (analytics) analyticsDict[analytics.id] = analytics;
        })
        console.log("ANALYTICS", analyticsDict)

        data.forEach(dataTrack => {
            const track = dataTrack.track;
            const convertedTrack: TrackItem = {
                title: track.name,
                artists: track.artists.map(artist => artist.name).join(", "),
                album: track.album.name,
                duration: track.duration_ms,
                cover: track.album.images[0]?.url,
                uri: track.uri,
                preview: track.preview_url,
                key: track.id,
                artistIDs: track.artists.map(artist => artist.id),
                analysisData: analyticsDict[track.id],
                toneKey: parseInt(`${analyticsDict[track.id]?.key}`),
                resultObject: true,
                url: track.external_urls.spotify,
                mode: analyticsDict[track.id]?.mode,
                tempo: analyticsDict[track.id]?.tempo,
                time_signature: analyticsDict[track.id]?.time_signature,
            }
            if (!dataTrack.is_local) trackItems.push(convertedTrack)
        });
        return trackItems;
    }

    const setPlaylist = async (playlist: SpotifyPlaylist) => {
        if (loading) {
            message.info("Please wait until the current playlist is loaded")
            return;
        }
        setLoading(true);
        setPlaylistData(null);
        setFocusedPlaylist(playlist);
        const data = await apiService.getTracksDirect(playlist.trackURL);
        console.log(data, "Audio Data");
        const convertedData = await convertToTrackItem(data);
        console.log(convertedData)
        setPlaylistData(convertedData);
        setLoading(false)
    }
    return (
        <div style={{
            margin: "10px",
            display: visible ? "block" : "none"
        }}>


            <Row gutter={24}>
                <Col span={6}>
                    <TreeSidebar selectPlaylist={setPlaylist} token={token} />
                </Col>
                <Col span={18}>
                    {playlistData ? <h1>{focusedPlaylist?.name}</h1> : null}
                    {focusedPlaylist?.description ? <p>{focusedPlaylist.description}</p> : null}
                    {/* <Row gutter={24}>
                        <Col span={4}>
                            <PlayTime data={playlistData} />
                        </Col>
                        <Col span={4}>
                           
                        </Col>
                    </Row> */}
                    <FeaturesOverview loading={loading} data={playlistData} />
                    <br />
                    <BpmChange loading={loading} data={playlistData} />
                    <br />
                    <MediaTable
                        setGraphItem={() => { console.log("graph") }}
                        seeds={seeds}
                        setSeed={setSeed}
                        seedDetails={seedDetails} data={playlistData} />

                </Col>
            </Row>
        </div>

    )
}