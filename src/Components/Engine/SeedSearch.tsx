import {
  Input,
  AutoComplete,
  message,
} from "antd";
import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import axios from "axios";
import SpotifyTrack from "../../Types/SpotifyTrack";
import SpotifyArtist from "../../Types/SpotifyArtist";
import { SeedItem } from "../../Types/SeedItem";
import debounce from 'lodash.debounce';
const renderTitle = (title: string) => <span>{title}</span>;

/* A list of genres that are used to search for songs. */
const genres = [
  "acoustic",
  "afrobeat",
  "alt-rock",
  "alternative",
  "ambient",
  "anime",
  "black-metal",
  "bluegrass",
  "blues",
  "bossanova",
  "brazil",
  "breakbeat",
  "british",
  "cantopop",
  "chicago-house",
  "children",
  "chill",
  "classical",
  "club",
  "comedy",
  "country",
  "dance",
  "dancehall",
  "death-metal",
  "deep-house",
  "detroit-techno",
  "disco",
  "disney",
  "drum-and-bass",
  "dub",
  "dubstep",
  "edm",
  "electro",
  "electronic",
  "emo",
  "folk",
  "forro",
  "french",
  "funk",
  "garage",
  "german",
  "gospel",
  "goth",
  "grindcore",
  "groove",
  "grunge",
  "guitar",
  "happy",
  "hard-rock",
  "hardcore",
  "hardstyle",
  "heavy-metal",
  "hip-hop",
  "holidays",
  "honky-tonk",
  "house",
  "idm",
  "indian",
  "indie",
  "indie-pop",
  "industrial",
  "iranian",
  "j-dance",
  "j-idol",
  "j-pop",
  "j-rock",
  "jazz",
  "k-pop",
  "kids",
  "latin",
  "latino",
  "malay",
  "mandopop",
  "metal",
  "metal-misc",
  "metalcore",
  "minimal-techno",
  "movies",
  "mpb",
  "new-age",
  "new-release",
  "opera",
  "pagode",
  "party",
  "philippines-opm",
  "piano",
  "pop",
  "pop-film",
  "post-dubstep",
  "power-pop",
  "progressive-house",
  "psych-rock",
  "punk",
  "punk-rock",
  "r-n-b",
  "rainy-day",
  "reggae",
  "reggaeton",
  "road-trip",
  "rock",
  "rock-n-roll",
  "rockabilly",
  "romance",
  "sad",
  "salsa",
  "samba",
  "sertanejo",
  "show-tunes",
  "singer-songwriter",
  "ska",
  "sleep",
  "songwriter",
  "soul",
  "soundtracks",
  "spanish",
  "study",
  "summer",
  "swedish",
  "synth-pop",
  "tango",
  "techno",
  "trance",
  "trip-hop",
  "turkish",
  "work-out",
  "world-music",
];
const renderGenre = (title: string) => ({
  value: title.charAt(0).toUpperCase() + title.slice(1),
  spotifyseed: title,
  key: title,
  type: "genre",
  label: (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {title.charAt(0).toUpperCase() + title.slice(1)}
    </div>
  ),
} as SeedItem);

const renderTrack = (track: SpotifyTrack) => ({
  value:
    track.name + " - " + track.artists.map((artist) => artist.name).join(", "),
  spotifyseed: track.uri,
  key: track.uri,
  type: "track",
  uri: track.external_urls.spotify,
  sthumb: track.album.images[2].url,
  artistIDs: track.artists.map(art => art.id),
  label: (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {track.name +
        " - " +
        track.artists.map((artist) => artist.name).join(", ")}
      {/* <small>{track.artists.map((artist) => artist.name).join(", ")}</small> */}
      <span>
        <img
          src={track.album.images[2].url}
          alt="Spotify Thumbnail"
          style={{ height: 32, width: 32 }}
        />
      </span>
    </div>
  ),
} as SeedItem);


const renderArtist = (artist: SpotifyArtist) => ({
  value: artist.name,
  spotifyseed: artist.uri,
  key: artist.uri,
  type: "artist",
  sthumb: (artist.images.length > 0 ? artist.images[2].url : "" ),
  uri: artist.external_urls.spotify,
  artistIDs: [artist.id],
  label: (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {artist.name}
      {/* <small>{track.artists.map((artist) => artist.name).join(", ")}</small> */}
      <span>
        <img
          src={(artist.images.length > 0 ? artist.images[2].url : "" )}
          alt="Spotify Thumbnail"
          style={{ height: 32, width: 32 }}
        />
      </span>
    </div>
  ),
} as SeedItem);

type SeedSearchProps = {
  token: string,
  setSelectedSeeds: Dispatch<SetStateAction<SeedItem[]>>,
  selectedSeeds: SeedItem[],
  focusedByTutorial: number
}

type SearchOption = {
  label: JSX.Element,
  options: Array<SeedItem>
}

const SeedSearch = ({ token, setSelectedSeeds, selectedSeeds, focusedByTutorial }: SeedSearchProps) => {
  const [options, setOptions] = useState<SearchOption[]>([]);

  /**
   * It takes a search term and a type of search (artist, album, track, playlist) and returns a promise
   * that resolves to an array of search results
   * @param term - The search term
   * @param type - The type of item to return. One of album , artist , playlist , or track .
   * @returns An array of objects.
   */
  const getArtistSearch = (term: string): Promise<SpotifyArtist[]> => {
    return new Promise((resolve) => {
      axios
        .get(
          `https://api.spotify.com/v1/search?q=${term}&type=artist&limit=5`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((result) => {
          const res = result.data[Object.keys(result.data)[0]].items;
          // console.log("Got Result from Spotify ARTISTS", res);
          resolve(res);
        });
    });
  };

  const getTrackSearch = (term: string): Promise<SpotifyTrack[]> => {
    return new Promise((resolve) => {
      axios
        .get(
          `https://api.spotify.com/v1/search?q=${term}&type=track&limit=5`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((result) => {
          const res = result.data[Object.keys(result.data)[0]].items;
          // console.log("Got Result from Spotify TRACKS", res);
          resolve(res);
        });
    });
  };

  /**
   * It takes a term as an argument, finds all the genres that match the term, and returns the matches
   * @param term - the term that the user is searching for
   * @returns An array of objects
   */
  const getGenre = (term: string) => {
    //find all genres that match the term
    const matches = genres.filter((genre) => {
      if (genre.toLowerCase().includes(term.toLowerCase())) {
        return genre;
      }
    });
    //return all the matches
    return matches.map((match) => renderGenre(match));
  };

  /**
   * It takes a search term, and returns an array of objects, each object containing a label and an
   * array of options
   * @param searchTerm - The search term that the user has entered.
   */
  const getSearchOptions = async (searchTerm: string) => {
    // console.log(searchTerm, "SearchTerm");
    const opts: SearchOption[] = [
      {
        label: renderTitle("Songs"),
        options: (await getTrackSearch(searchTerm)).map((track) =>
          renderTrack(track)
        ),
      },
      {
        label: renderTitle("Artists"),
        options: (await getArtistSearch(searchTerm)).map((artist) =>
          renderArtist(artist)
        ),
      },
      {
        label: renderTitle("Genres"),
        options: getGenre(searchTerm),
      },
    ];
    // console.log("Generated Options", opts);
    setOptions(opts);
  };


  const debouncedChangeHandler = useCallback(
    debounce(getSearchOptions, 300)
    , []);

  /**
   * If the user has selected less than 5 seeds, and the seed they are trying to select is not already
   * in the selectedSeeds array, then add the seed to the selectedSeeds array
   * @param value - The value of the selected option.
   * @param option - the option that was selected
   */
  const onSelect = (value: string, option: any) => {
    const seedOption: SeedItem = option;
    // console.log(value, seedOption, "OPTION DEBUG");
    if (selectedSeeds.length < 5) {
      if (!selectedSeeds.find((seed) => seed.key === seedOption.key)) {
        setSelectedSeeds([...selectedSeeds, seedOption]);
        // setSeed([...selectedSeeds, option]);
      } else {
        message.warning("You can only select one of each");
      }
    } else {
      message.warning("Only five artists, songs or genres can be selected");
    }
  };

  return (
    <AutoComplete
      dropdownClassName="certain-category-search-dropdown"
      dropdownMatchSelectWidth={700}
      options={options}
      onSelect={onSelect}
      className="seed_search"
      style={{
        zIndex: focusedByTutorial === 1? "110" : "90"
      }}
    >
      <Input
        className="seed_search"
        data-intro='Hello step one!'
        onChange={(e) => debouncedChangeHandler(encodeURIComponent(e.target.value))}
        placeholder="Track,Gerne,Artist..."
        style={{ width: 700, zIndex: focusedByTutorial === 1? "110" : "90" }}
      />
    </AutoComplete>
  );
};

export default SeedSearch;
