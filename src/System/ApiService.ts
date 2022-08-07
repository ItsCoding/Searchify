import { SpotifyPlaylist } from "../Types/SpotifyPlaylist";
import SpotifyTrack from "../Types/SpotifyTrack";

export class ApiService {
    constructor(
        private token: string
    ) { }

    public async getPlaylists(): Promise<SpotifyPlaylist[]> {
        const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=50`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const json = await response.json();
        return json.items.map((item: any) => SpotifyPlaylist.fromJSON(item));
    }

    public async getTracksDirect(directURL: string) {
        let gotAll = false;
        let responses: { track: SpotifyTrack , is_local: boolean}[] = []
        while (!gotAll) {
            const response = await fetch(directURL, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            const json = await response.json();
            if(json.next){
                directURL = json.next;
            }else{
                gotAll = true;
            }
            responses = [...responses, ...json.items];
        }
        return responses
    }

    public async getAudioFeatures(trackIDs: string) {
        const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIDs}`, {
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
        const json = await response.json();
        return json;
    }
}