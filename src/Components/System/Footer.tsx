import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type FooterProps = {
    addition?: JSX.Element
}


const Footer = ({ addition }: FooterProps) => (
    <div
        style={{
            textAlign: "center",
            paddingTop: 15,
        }}>
        <p>Coded with ❤ | See on <a href="https://github.com/ItsCoding/Searchify" rel="noreferrer" target="_blank" >Github</a> | {addition} </p> <small style={{ color: "#545454" }}>
            metadata provided by <FontAwesomeIcon icon={faSpotify} size={"lg"} />
            {/* <img style={{ height: 15, marginLeft: 5 }} src="Spotify_Logo_CMYK_White.png"></img> */}
        </small>
    </div>)
export default Footer;