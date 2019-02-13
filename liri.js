// Run required nodes for the program.
require("dotenv").config();

const axios = require("axios");
const Spotify = require('node-spotify-api');
const fs = require("fs");
const moment = require("moment");
const keys = require("./keys.js");

// Turns command lines into variables for functions.
var action = process.argv[2];

process.argv.splice(0, 3);
var search = process.argv;

// Grabs Spotify keys to use API.
const spotify = new Spotify(keys.spotify);
var omdb = "";
var band = "";

// Axios URLs for the omdb and bandsintown APIs.
function setUrls() {
    omdb = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
    band = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
}

// Set URLs
setUrls();

// Run the LIRI function.
runLIRI();

// // LIRI listens to the actions and runs the appropriate function.
// function runLIRI() {
//     if (action === "concert-this") {
//         concertThis();
//     };

//     if (action === "movie-this") {
//         movieThis();
//     }
//     // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
//     else if (search === "") {
//         search = "Mr. Nobody";
//         movieThis();
//     };

//     if (search && action === "spotify-this-song") {
//         spotifyThis();
//     }
//     // If no song is provided then your program will default to "The Sign" by Ace of Base.
//     else if (!search) {
//         search = "The Sign"
//         spotifyThis();
//     };

//     if (action === "do-what-it-says") {
//         doWhat();
//     }
// }

function runLIRI() {


    switch (action) {
        case "movie-this":
            if (search.length === 0) {
                search = ["Mr. Nobody"];
                setUrls();
            }
            movieThis();
            break;
        case "spotify-this-song":
            if (search.length === 0) {
                search = ["The Sign The Ace of Base"];
                setUrls();
            }
            spotifyThis();
            break;
        case "concert-this":
            concertThis();
            break;
        case "do-what-it-says":
            doWhat();
            break;
    }
}

// node liri.js concert-this <artist/band name here>
// This will search the Bands in Town Artist Events API
function concertThis() {
    axios.get(band).then(
        function (response) {

            for (let i = 0; i < 5; i++) {
                console.log("===================")
                // Name of the venue
                console.log("Venue: " + response.data[i].venue.name);
                // Venue location
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[0].venue.country);
                // Date of the Event (use moment to format this as "MM/DD/YYYY")
                var formatDate = moment(response.data[i].datetime).format("MM/DD/YYYY");
                console.log("Date: " + formatDate);
            };

        });
};

// node liri.js movie-this '<movie name here>'
// This will output the following information to your terminal/bash window:
function movieThis() {
    axios.get(omdb).then(
        function (response) {
            //   * Title of the movie.
            console.log("Title: " + response.data.Title);
            //   * Year the movie came out.
            console.log("Year: " + response.data.Year);
            //   * IMDB Rating of the movie.
            console.log(response.data.Ratings[0].Source + ": " + response.data.Ratings[0].Value);
            //   * Rotten Tomatoes Rating of the movie.
            console.log(response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value);
            //   * Country where the movie was produced.
            console.log("Country: " + response.data.Country);
            //   * Language of the movie.
            console.log("Languages: " + response.data.Language);
            //   * Actors in the movie.
            console.log("Actors: " + response.data.Actors);
            //   * Plot of the movie.
            console.log("Plot: " + response.data.Plot);

        }
    )
};

// node liri.js spotify-this-song '<song name here>'
// This will show the following information about the song in your terminal/bash window
function spotifyThis() {
    spotify.search({ type: 'track', query: search }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // fs.writeFile("spotify.json", JSON.stringify(data, null, 2), function (err) {
        //     console.log("Made File.");
        // })

        // Artist(s)
        console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
        // The song's name
        console.log("Name: " + data.tracks.items[0].name);
        // A preview link of the song from Spotify
        console.log("Album: " + data.tracks.items[0].album.name);
        // The album that the song is from
        console.log("Link: " + data.tracks.items[0].external_urls.spotify);
    });
};

// node liri.js do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
function doWhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.

        var random = data.split(",");
        action = random[0];
        search = random[1];

        console.log(action);
        console.log(search);

    });
};
