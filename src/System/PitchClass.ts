const pitchArray = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
];

/**
 * It takes a key(0-11) and returns the corresponging pitch class
 * @param key - The estimated key of the song.
 * @returns The pitch class of the key.
 */
const keyToPitchClass = (key: number | undefined) => {
    if(key === undefined || key < 0) {
        return "No key provided";
    }       
    return pitchArray[key];
}


const PitchClass = {keyToPitchClass};

export default PitchClass;