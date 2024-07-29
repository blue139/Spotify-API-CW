document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const searchForm = document.getElementById('searchForm');
    const artistInput = document.getElementById('artist');
    const countryInput = document.getElementById('country');
    const resultsDiv = document.getElementById('results');
    const messagesDiv = document.getElementById('messages');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send');
    const usernameDisplay = document.getElementById('username');
    
    const logo = document.querySelector('.spotify-logo');

    // Handle search form submission
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // Play spinning animation on logo while request takes place
        logo.classList.add('spin');

        const artist = artistInput.value.trim();
        const country = countryInput.value.trim();

        try {
            const response = await fetch(`/api/top-tracks?artist=${encodeURIComponent(artist)}&country=${encodeURIComponent(country)}`);
            const tracks = await response.json();

            resultsDiv.innerHTML = tracks.map(track => `<p>${track.name} by ${track.artists[0].name}</p>`).join('');
        } catch (error) {
            resultsDiv.innerHTML = 'Error fetching tracks.';
        } finally {
            logo.classList.remove('spin');
        }
    });

    // Handle chat messages
    socket.on('name', (name) => {
        usernameDisplay.textContent = name;

        sendButton.addEventListener('click', () => {
            const msg = messageInput.value;
            socket.emit('chat message', msg);
            messageInput.value = '';
        });

        socket.on('chat message', ({ name, msg }) => {
            const messageElem = document.createElement('p');
            messageElem.textContent = `${name}: ${msg}`;
            messagesDiv.appendChild(messageElem);
        });
    });
});
