/**
 * It takes a key(0-11) and returns the corresponging pitch class
 * @param key - The estimated key of the song.
 * @returns The pitch class of the key.
 */
const keyToPitchClass = (key: number | undefined) => {
    if(key === undefined) {
        return "No key provided";
    }       
    switch (key) {
        case 0:
        return "C";
        case 1:
        return "C#";
        case 2:
        return "D";
        case 3:
        return "D#";
        case 4:
        return "E";
        case 5:
        return "F";
        case 6:
        return "F#";
        case 7:
        return "G";
        case 8:
        return "G#";
        case 9:
        return "A";
        case 10:
        return "A#";
        case 11:
        return "B";
        case -1: 
        return "No key detected";
        default:
        return "";
    }
}


const PitchClass = {keyToPitchClass};

export default PitchClass;