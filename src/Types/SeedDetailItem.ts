import SpotifyAudioAnalysis from "./SpotifyAudioAnalysis";

type SeedDetailItem = Partial<SpotifyAudioAnalysis> & {
  cover: string,
  title: string;
  uri: string;

}

export default SeedDetailItem;
