# Searchify

Spotify has an very powerfull recommendation API. The bummer is, you bascily have no access to all the nice features trough the Spotify client itself. Here comes Searchify. An simple UI made to help you, find the music you wanna listen to. 

## [Try it out ](https://itscoding.github.io/Searchify/ "here")

If you wanna read more about the API im using go [here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recommendations "here")

Special Thanks to the following Libarys/Companys:
- [Spotify Developer](https://developer.spotify.com "Spotify Developer") - Providing all the Data
- [React](https://reactjs.org "React") - UI Framework
- [Typescript](https://www.typescriptlang.org "Typescript") - Makes things better and more stable :D
- [Ant Design](https://ant.design "Ant Design") - Component library of choice
- [Axios](https://axios-http.com "Axios") - Making HTTP(s) request a lot easier
- [@daniel-faber/json-ts](https://www.npmjs.com/package/@daniel-faber/json-ts "@daniel-faber/json-ts") - JSON validation and parsing for TypeScript
- [Lodash](https://lodash.com "Lodash") - Debouncing search input
- [Fontawsome](https://fontawesome.com "Fontawsome") - Icon libary
- [MUI](https://mui.com "MUI") - The only ones with a multi dot slider 
- [Intro.JS/Intro.JS-React](https://github.com/HiDeoo/intro.js-react "Intro.JS-React") - Intro guide and react wrapper

## Building yourself

1. You need a Spotify developer client token. Can be generated in Spotify´s dev dashboard [here](https://developer.spotify.com/dashboard/login "here")
2. Rename/move the `template.env` file to `.env` and add your client token under `SPOTIFY_CLIENT_KEY`
3. If you plan to go live/make a production build also change `LIVE_URI` to your URL
4. Run `yarn` if you haven´t allready
5. Run `yarn build` to make a production build. This will be available in the `/build` subdirectory

