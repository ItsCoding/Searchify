import { Box, Line } from "@ant-design/plots";
import { Card } from "antd";
import TrackItem from "../../../../Types/TrackItem";

type FeaturesOverviewProps = {
    data: TrackItem[] | null,
    loading: boolean
}


export const FeaturesOverview = ({ data, loading }: FeaturesOverviewProps) => {

    const makeGraphData = () => {
        if (!data || data.length < 1) return [];
        let dataPoints: { key: string, min: number, max: number, avg: number }[] = [];
        [
            "acousticness",
            "danceability",
            "energy",
            "instrumentalness",
            "liveness",
            "speechiness",
            "valence",
        ].forEach(featureKey => {
            const min = data?.reduce((acc, curr) => {
                if (curr.analysisData && curr.analysisData[featureKey]) {
                    return Math.min(acc, curr.analysisData[featureKey])
                } else {
                    return acc;
                }
            }, Number.MAX_VALUE);
            const max = data?.reduce((acc, curr) => {
                if (curr.analysisData && curr.analysisData[featureKey]) {
                    return Math.max(acc, curr.analysisData[featureKey])
                } else {
                    return acc;
                }
            }, Number.MIN_VALUE);
            const avg = (data?.reduce((acc, curr) => {
                if (curr.analysisData && curr.analysisData[featureKey]) {
                    return (acc ?? 0) + curr.analysisData[featureKey]
                } else {
                    return acc;
                }
            }, 0) ?? 0) / (data?.length ?? 1);
            dataPoints.push({
                key: featureKey,
                min: min ?? 0,
                max: max ?? 0,
                avg
            })
        })

        return dataPoints;
    }

    return (
        <Card title="AudioFeatures" loading={loading}>
            <Box data={makeGraphData()}
                padding={"auto"}
                xField={"key"}
                yField={['min', 'max', 'avg']}
                
                xAxis={{
                    tickCount: 5,
                }}

            />
        </Card>)
}