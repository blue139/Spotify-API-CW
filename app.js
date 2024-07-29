document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const artist = document.getElementById('artist').value;
    const country = document.getElementById('country').value;

    try {
        const response = await fetch(`/api/top-tracks?artist=${artist}&country=${country}`);
        const tracks = await response.json();
        displayTracks(tracks);
    } catch (error) {
        alert('Error fetching top tracks.');
    }
});

const displayTracks = (tracks) => {
    const results = document.getElementById('results');
    results.innerHTML = '<h2>Top 10 Tracks</h2>';
    tracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.innerHTML = `
            <p>${track.name} - ${track.artists[0].name}</p>
            <a href="${track.external_urls.spotify}" target="_blank">Listen on Spotify</a>
        `;
        results.appendChild(trackElement);
    });
};

// Chat functionality (basic implementation)
document.getElementById('send').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    if (message) {
        const messagesDiv = document.getElementById('messages');
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messagesDiv.appendChild(messageElement);
        document.getElementById('message').value = '';
    }
});
