type SpotifyArtist = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  images: {
    url: string;
  }[]
  genres: string[];
};

export default SpotifyArtist;
