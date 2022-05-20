enum SeedType  {
    Artist = 'artist',
    Genre = 'genre',
    Track = 'track',
}


type SeedItem = {
    type: SeedType
    spotifyseed: string,
    key: string,
    value: string,
    sthumb: string,
    label: string | JSX.Element,
    uri?: string,
}

export {
    type SeedItem,
    SeedType
}