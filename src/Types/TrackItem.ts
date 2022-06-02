type TrackItem = {
    title: string,
    artists: string,
    album: string,
    uri: string,
    cover: string,
    preview: string,
    duration: number,
    key: string,
    resultObject: boolean,
    url: string,
    toneKey?: number,
    analysisData?: any,
    mode?: number,
    tempo?: number,
    time_signature?: number,
    fromHover?: boolean,
    overlapping?: number,
    [key: string]: string | number | boolean | undefined;
}

export default TrackItem;