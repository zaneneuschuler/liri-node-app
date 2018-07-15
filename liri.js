//import everything, ever
require("dotenv").config();
var fs = require('fs');
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var request = require('request');

// make argv[2] a- actually before we do that, check if there's more than 2 arguments
if (process.argv.length > 4) {
    console.log("Hey please only put in your command and the parameter you're searching for in quotes.");
    console.log("For example: spotify-this-song '<song name here>'")
    console.log(`How to use app: "node liri <command> '<parameter>'\n
    List of commands:\n
    my-tweets (no parameter): Lists your last 20 tweets.\n
    spotify-this-song <name of song>: Brings up song information.\n
    movie-this <name of movie>: Brings up movie information from IMDB.\n
    do-what-it-says: Takes text from random.txt and does a command. `);
    return;
    
}
//set command and param and pass to switch
var command = process.argv[2];
var parameter = process.argv[3];
commandSwitch(command, parameter);

function commandSwitch(command, parameter) {
    //switch is inside function so that i can recursive call if do-what-it-says is called.
    debugger;
    switch (command) {
        case "my-tweets":
            myTweets();
            break;

        case "spotify-this-song":
            let songName = parameter;
            if (songName == undefined) {
                songName = "The Sign Ace of Base"
            }
            mySong(songName);
            break;

        case "movie-this":
            let movieName = parameter;
            if (movieName == undefined) {
                movieName = "Mr. Nobody"
            }
            myMovie(movieName);
            break;

        case "do-what-it-says":
            fs.readFile('random.txt', 'utf8', (err, data)=>{
                let dataSplit = data.split(",");
                commandSwitch(dataSplit[0], dataSplit[1]);
            });
        break;

        default:
            console.log(`How to use app: "node liri <command> '<parameter>'\n
    List of commands:\n
    my-tweets (no parameter): Lists your last 20 tweets.\n
    spotify-this-song <name of song>: Brings up song information.\n
    movie-this <name of movie>: Brings up movie information from IMDB.\n
    do-what-it-says: Takes text from random.txt and does a command. `);
            break;
    };

    
}

function myTweets() {
    client.get('statuses/user_timeline',function (error, tweets, response) {
        if (!error) {
            tweets.forEach(tweet => {
                console.log(`@${tweet.user.screen_name}: ${tweet.text} | tweeted at ${tweet.created_at}\n`)
                
            });
            fs.appendFile("log.txt", "my-tweets successfully called \n", "utf8", (err) => {
                if (err) throw err;
            });
        }else{
            console.log("Whoops, we got an error. Error: " + error)
            fs.appendFile("log.txt", "my-tweets had error: " + error + "\n", "utf8", (err) => {
                if (err) throw err;
            });
        }
    });
    
}

function mySong(song) {
    spotify.search({
        type: 'track',
        query: song,
        limit: 1
    }, function (err, data) {
        
        if (err) {
              fs.appendFile("log.txt", `spotify-this-song had error: ${err} on song search "${song}"\n`, "utf8", (err) => {
                  if (err) throw err;
              });
            return console.log('Error occurred: ' + err);
          
        }
        let song = data.tracks.items[0];
        console.log(`
        Song title: ${song.name}\n
        Artist name: ${song.artists[0].name}\n
        Album name: ${song.album.name}\n
        Spotify url: ${song.external_urls.spotify}`);
        
    });
   fs.appendFile("log.txt", `spotify-this-song ran successfully on song search "${song}"\n`, "utf8", (err) => {
       if (err) throw err;
   });
}

function myMovie(movie) {
    
    let queryURL = `http://www.omdbapi.com/?t=${movie}&apikey=trilogy`;
    request(queryURL, function (error, response, body) {
        debugger;
        let omdb = JSON.parse(body);
        let rottenRating;
       if(error == null){
           if (omdb.Ratings[1] == undefined){
               rottenRating = "Not in Rotten Tomatoes" 
           } else{
               rottenRating = omdb.Ratings[1].Value
           }
        console.log(`
        Movie title: ${omdb.Title}\n
        Year: ${omdb.Year}\n
        IMDB score: ${omdb.Ratings[0].Value}\n
        Rotten Tomatoes Score: ${rottenRating}\n
        Country(s): ${omdb.Country}\n
        Language: ${omdb.Language}\n
        Plot: ${omdb.Plot}\n
        Actors: ${omdb.Actors}
        `);
       }else{
           console.log("Error occurred! " + error);
             fs.appendFile("log.txt", `movie-this had error: ${error} on movie search "${movie}"\n`, "utf8", (err) => {
                 if (err) throw err;
             });
       }
    });
    
}