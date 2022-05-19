import React from "react";
import { Tooltip } from "antd";

/* An object that contains the help text for each audio feature. */
type RecomendationHelps = {
  [option: string]: string | React.ReactNode;
}


// const keyHelp: React.ReactElement = 


const recomendationHelps: RecomendationHelps = {
  acousticness:
    "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.",
  danceability:
    "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.",
  energy:
    "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
  instrumentalness:
    'Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.',
  key: (
    <div>
      The key the track is in. Integers map to pitches using standard{" "}
      <a href="https://en.wikipedia.org/wiki/Pitch_class" target="_blank" rel="noreferrer">
        Pitch Class notation
      </a>
      . E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on. If no key was detected, the
      value is -1.
    </div>
  ),
  liveness:
    "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.",
  mode: "Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0.",
  popularity:
    "The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist's popularity is calculated from the popularity of all the artist's tracks.",
  speechiness:
    "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.",
  tempo:
    "The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.",
  time_signature:
    'An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4".',
  valence:
    "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
};
/**
 * It takes a title and a key, and returns a tooltip with the title and the help text from the
 * recomendationHelps object
 * @param title - The title of the column
 * @param [key=null] - The key of the help text in the recomendationHelps object.
 * @returns A React component that displays a tooltip with the title of the column and the help text
 * for that column.
 */

const mapTitleToHelp = (title: string, key: string | null = null) => {
  return (
    <>
      {" "}
      <Tooltip zIndex={100} placement="top" title={recomendationHelps[key || title.toLowerCase()]}>
        {title}
      </Tooltip>
    </>
  );
};

const Help = {
  recomendationHelps,
  mapTitleToHelp
};

export default Help;
