import { Line } from "@ant-design/plots";
import { Card } from "antd";
import TrackItem from "../../../../Types/TrackItem";
import { TooltipAttr } from "@antv/g2plot/lib/types/attr"
type BpmChangeProps = {
    data: TrackItem[] | null,
    loading: boolean
}


export const BpmChange = ({ data, loading }: BpmChangeProps) => {

    const makeGraphData = () => {
        let dataPoints: { position: number, BPM: number, track: string }[] = [];
        data?.forEach((track, i) => {
            dataPoints.push({
                position: i,
                BPM: parseInt(track.tempo?.toFixed(0) ?? "0"),
                track: track.title
            })
        })
        return dataPoints;
    }

    return (
        <Card title="BPM Timeline" loading={loading}>
            <Line data={makeGraphData()}
                padding={"auto"}
                xField={"position"}
                yField={"BPM"}
                xAxis={{
                    label: {
                        formatter(text, item, index) {
                            if (data) return data[index].title;
                        },
                    },
                    tickCount: 5,
                }}
                tooltip={{
                    formatter: (record) => {
                        console.log(record, "TEXT")
                        if (data && data[record.position]) {
                            return {
                                name: "Tempo",
                                value: record.BPM + " BPM"
                            }
                        }else{
                            return {
                                name: "Unknown",
                                value: 0
                            }
                        }
                    },
                    title: "track"
                }}
            />
        </Card>)
}