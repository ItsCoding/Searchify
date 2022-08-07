import SpotifyTrack from "./SpotifyTrack";
import { arrayMapper, expectString, objectMapper } from "@daniel-faber/json-ts"
export class SpotifyPlaylist {

    constructor(
        public id: string,
        public name: string,
        public uri: string,
        public image: string,
        public ownerID: string,
        public ownerName: string,
        public trackURL: string,
        public description: string
    ) { }

    public static fromJSON(jsonObj: any) {
        return new SpotifyPlaylist(
            jsonObj.id,
            jsonObj.name,
            jsonObj.uri,
            jsonObj.images[jsonObj.images.length - 1].url,
            jsonObj.owner.id,
            jsonObj.owner.display_name,
            jsonObj.tracks.href,
            jsonObj.description
        )
    }
}