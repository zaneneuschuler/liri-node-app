# liri-node-app
Basic node app for your desktop to find info about movies, songs, or just your past 20 tweets. 

## Usage

First, you need to give liri a `.env` file with all of your keys, formatted thus:
```js
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

# Twitter API keys

TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

```

Afterwards, run the app with `node liri <your command> "<your parameter>"` to get going!

### List of commands:

`my-tweets`: Self explanatory. Uses your twitter access keys to get your twitter profile and shows your last 20 tweets. *Doesn't require parameter*

`spotify-this-song`: Takes your search query and uses it to fetch info on spotify. *Can use a parameter*

`movie-this`: Takes a search query and uses it to fetch info from [OMDB](https://omdbapi.com/). *Can use a parameter*

`do-what-it-says`: Takes formatted input from `random.txt` to perform a request. *Requires random.txt, sample in repo*
