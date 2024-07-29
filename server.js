//Setup libraries
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//Hardcode Spotify API parameters
const Spotify_Key = 'SANTIS_API_KEY';
const Spotify_URL = 'https://api.spotify.com/v1';
let searchHistory = [];


//Helper function to get track data from Spotify
const FetchFromSpotify = async (endpoint, params = {}) => {
  const url = `${Spotify_URL}${endpoint}`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${Spotify_Key}` },
    params,
  });
  return response.data;
};

app.get('/api/top-tracks', async (req, res) => {
  const { artist, country } = req.query;
  if (!artist) return res.status(400).send('name is required');

  const market = country || 'GB';
  try {
    const data = await FetchFromSpotify(`/search`, {
      q: `artist:${artist}`,
      type: 'track',
      market,
      limit: 10,
    });

    searchHistory.push({ artist, country: market, tracks: data.tracks.items.length });

    if (searchHistory.length > 20) {
      searchHistory.shift();
    }

    res.json(data.tracks.items);
  } catch (error) {
    res.status(500).send('Error with Spotify API request.');
  }
});

app.get('/api/search-history', (req, res) => {
  res.json(searchHistory);
});

const server = http.createServer(app);
const io = socketIo(server);

//Handle chat functionality, assign random usernames from NATO alphabet
io.on('connection', (socket) => {
  //Pick random name
  const names = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'];
  const name = names[Math.floor(Math.random() * names.length)];
  socket.emit('name', name);

  socket.on('chat message', (msg) => {
    io.emit('chat message', { name, msg });
  });
});

server.listen(port, () => console.log(`Server is running on... http://localhost:${port}`));
