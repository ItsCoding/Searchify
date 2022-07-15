import SpotifyAudioAnalysis from "./SpotifyAudioAnalysis";

type SeedDetailItem = Partial<SpotifyAudioAnalysis> & {
  cover: string;
  title: string;
  uri: string;
  artistIDs: string[];
}

export default SeedDetailItem;
