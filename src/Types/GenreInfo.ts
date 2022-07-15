type GenreInfo = {
    artistID: string,
    genres: string[]
}

type GenreDict = Map<string,GenreInfo>

export {
    type GenreDict,
    type GenreInfo
};