import React from "react";
import { Result, Button } from "antd";

type LoginProps = {
  fqdn: string,
  stateKey: string
}
const Login: React.FunctionComponent<LoginProps> = ({ fqdn, stateKey }) => {


  /**
   * Create a random string
   * @param {number} length - number - The length of the string you want to generate.
   * @returns A random string of characters.
   */
  const makeid = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  /**
   * Redirect the user to the Spotify login page with the correct parameters.
   * @returns A redirect to the Spotify login page.
   */

  const redirectToSpotify = () => {
    const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_KEY;
    const redirect_uri = fqdn;

    //Create a state and store it localy, so we can validate spotifys resposnse it later.
    const state = makeid(100);
    localStorage.setItem(stateKey, state);

    //Declare OAuth scopes we need for spotify
    const scope =
    "streaming \
            user-read-private \
            user-read-playback-state \
            user-modify-playback-state \
            user-library-read \
            user-library-modify";

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id ?? "");
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location.href = url;
  }

  return (
    <div className="App">
      <div className="centerd-content"> {/* Center the content, maybe bricks idk */}
        <Result
          title="You need to be logged in to use Searchify!"
          extra={
            <Button
              type="primary"
              key="console"
              // href={fqdn + "/auth/login"}
              onClick={() => redirectToSpotify()}
              >
              Login with Spotify
            </Button>
          }
        />
      </div>
    </div>
  );
}

export default Login;
