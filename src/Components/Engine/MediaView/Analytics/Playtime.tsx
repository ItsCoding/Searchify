import { Card } from "antd";
import { StringNullableChain } from "lodash";
import TrackItem from "../../../../Types/TrackItem";

type PlayTimeProps = {
    data: TrackItem[] | null,
    loading: boolean
}

const msToHMS = (ms: number) => {
    let seconds = ms / 1000;
    const hours = seconds / 3600;
    seconds = seconds % 3600;
    const minutes = seconds / 60;
    return hours.toFixed(0) + ":" + minutes.toFixed(0);
}

const millisToMinutesAndSeconds = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseFloat(seconds) < 10 ? "0" : "") + seconds;
  };

export const PlayTime = ({ data,loading }: PlayTimeProps) => {

    const totalDuration = data ? data.reduce((acc, curr) => acc + curr.duration, 0) : 0;
    const avgTrackDuration = totalDuration / (data ? data.length : 1);

    return (
        <Card title="Time">
            <p>Total playtime: {msToHMS(totalDuration)} std.</p>
            <p>Avg Trackduration: {millisToMinutesAndSeconds(avgTrackDuration)} min</p>
        </Card>
    )
}