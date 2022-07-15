import axios from "axios";
import { result } from "lodash";
import React from "react";
import SpotifyArtist from "../../Types/SpotifyArtist";


type GenrePopoverType = {
    artistIDs: string[],
    token: string
}

const GenrePopover = ({ artistIDs, token }: GenrePopoverType) => {

    const [genres, setGenres] = React.useState<string>("")



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
        let results: string[] = [];
        axiosResult.data.artists.forEach((art: SpotifyArtist) => {
            results = [...results, ...art.genres]
        })
        if(result.length < 1){
            return "No genre found 😪"
        }
        return results.map(it => it.toLocaleUpperCase()).join(", ");
    }


    React.useEffect(() => {
        console.log("Got triggerd :3")
        getGenresForTrack(artistIDs).then(res => {
            setGenres(res)
        })
    }, [])


    return (<>
        {genres}
    </>
    );
};


export default GenrePopover
