const artistName = 'Coldplay';
const requestUrl = `https://musicbrainz.org/ws/2/artist?query=${artistName}&fmt=json`;

fetch(requestUrl)
    .then(response => response.json())
    .then(data => {
        // Handle the returned data
        console.log(data);
        // Process the data as needed
    })
    .catch(error => {
        // Handle any errors that occur during the request
        console.error(error);
    });