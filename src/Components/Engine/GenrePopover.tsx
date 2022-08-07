import { Badge, Typography } from "antd";
import axios from "axios";
import { result } from "lodash";
import React from "react";
import SpotifyArtist from "../../Types/SpotifyArtist";
const { Text } = Typography;

type GenrePopoverType = {
    artistIDs: string[],
    token: string
}

type GenreArtist = {
    name: string,
    genres: string[]
}

const GenrePopover = ({ artistIDs, token }: GenrePopoverType) => {

    const [genres, setGenres] = React.useState<GenreArtist[]>([])



    const getGenresForTrack = async (artistID: string | string[]) => {
        if(genres.length > 0) return genres;
        // console.log(artistID, "ARTISTS SEARCH")
        // if(artistID[0] === "-") return ""
        if (artistID.length < 1) return "No genre for this item"
        let artists = Array.isArray(artistID) ? artistID : [artistID];

        let axiosResult = await axios.get(
            `https://api.spotify.com/v1/artists?ids=${artists.join(",")}`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
            }
        )
        // console.log(axiosResult)
        let results: GenreArtist[] = [];
        axiosResult.data.artists.forEach((art: SpotifyArtist) => {
            results.push({
                name: art.name,
                genres: art.genres
            } as GenreArtist)
        })
        if(result.length < 1){
            return "No genre found 😪"
        }
        return results;
    }


    React.useEffect(() => {
        console.log("Got triggerd :3")
        getGenresForTrack(artistIDs).then(res => {
            if(typeof res !== "string"){
                console.log(res)
                setGenres(res)
            }
        })
    }, [])
    return (<>
        <ul>
            {genres.map(gen => (
                <li>
                    <b>{gen.name}</b>: {gen.genres.length > 0 ? gen.genres.map(g => g.toLocaleUpperCase()).join(", ") : (<Badge count={"No data available"} style={{ backgroundColor: '#f5222d',paddingLeft: 5 }} />)} 
                </li>
            ))}
        </ul>
        <Text disabled>Spotify only has genres data about artists not tracks</Text>
    </>
    );
};


export default GenrePopover
