
const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

const apiURL = 'https://api.lyrics.ovh';

// {
//     "id": 1493744472,
//     "readable": true,
//     "title": "Rihanna",
//     "title_short": "Rihanna",
//     "title_version": "",
//     "link": "http://www.deezer.com/track/1493744472",
//     "duration": 155,
//     "rank": 895143,
//     "explicit_lyrics": true,
//     "explicit_content_lyrics": 1,
//     "explicit_content_cover": 2,
//     "preview": "http://cdn-preview-e.deezer.com/stream/c-e7265e29e165093b0a75c7c07a84f0f4-3.mp3",
//     "md5_image": "95b1098d682d1c5d2bdb3d08f6c925ea",
//     "artist": {
//         "id": 455796,
//         "name": "Leto",
//         "link": "http://www.deezer.com/artist/455796",
//         "picture": "http://api.deezer.com/artist/455796/image",
//         "picture_small": "http://e-cdn-images.dzcdn.net/images/artist/4b828cf56032fcfbed4c4a48e480e241/56x56-000000-80-0-0.jpg",
//         "picture_medium": "http://e-cdn-images.dzcdn.net/images/artist/4b828cf56032fcfbed4c4a48e480e241/250x250-000000-80-0-0.jpg",
//         "picture_big": "http://e-cdn-images.dzcdn.net/images/artist/4b828cf56032fcfbed4c4a48e480e241/500x500-000000-80-0-0.jpg",
//         "picture_xl": "http://e-cdn-images.dzcdn.net/images/artist/4b828cf56032fcfbed4c4a48e480e241/1000x1000-000000-80-0-0.jpg",
//         "tracklist": "http://api.deezer.com/artist/455796/top?limit=50",
//         "type": "artist"
//     },
//     "album": {
//         "id": 258732932,
//         "title": "17%",
//         "cover": "http://api.deezer.com/album/258732932/image",
//         "cover_small": "http://e-cdn-images.dzcdn.net/images/cover/95b1098d682d1c5d2bdb3d08f6c925ea/56x56-000000-80-0-0.jpg",
//         "cover_medium": "http://e-cdn-images.dzcdn.net/images/cover/95b1098d682d1c5d2bdb3d08f6c925ea/250x250-000000-80-0-0.jpg",
//         "cover_big": "http://e-cdn-images.dzcdn.net/images/cover/95b1098d682d1c5d2bdb3d08f6c925ea/500x500-000000-80-0-0.jpg",
//         "cover_xl": "http://e-cdn-images.dzcdn.net/images/cover/95b1098d682d1c5d2bdb3d08f6c925ea/1000x1000-000000-80-0-0.jpg",
//         "md5_image": "95b1098d682d1c5d2bdb3d08f6c925ea",
//         "tracklist": "http://api.deezer.com/album/258732932/tracks",
//         "type": "album"
//     },
//     "type": "track"
// },


async function getSongsList(searchTerm){
    const response = await fetch(`${apiURL}/suggest/${searchTerm}`);
    const data = await response.json();

    // Display rsponse in DOM

        main.innerHTML = `
            <ul class="songs">
            ${data.data.map(
                song => `<li>
                    <div style="">
                        <img src="${song.album.cover_small}" alt="${song.title}">
                    </div>
                    <div style="">
                        <span><strong> ${song.title}</strong> - ${song.artist.name}</span>
                    </div>
                    <div style="">
                        <audio controls>
                            <source src="${song.preview}" type="audio/ogg">
                            <source src="horse.mp3" type="audio/mpeg">
                            Your browser does not support the audio tag.
                        </audio>
                    </div>
                    <div style="">
                        <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
                    </div>
                    </li>`
                    )
                .join('')}
            </ul>
        `;
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
  
     if (data.error) {
          main.innerHTML = data.error;
     } else {
          const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  
          main.innerHTML = `
              <h2><strong>${artist}</strong> - ${songTitle}</h2>
              <span>${lyrics}</span>
          `;
    }
  
    more.innerHTML = '';
}


// On Submit Search Song
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value.trim()

    if(searchTerm && searchTerm !== '') {
        getSongsList(searchTerm);

        search.value = ''
    } else {
        window.location.reload()
    }
})

// Get lyrics button click
main.addEventListener('click', e => {
    const clickedEl = e.target;
  
    if (clickedEl.tagName === 'BUTTON') {
      const artist = clickedEl.getAttribute('data-artist');
      const songTitle = clickedEl.getAttribute('data-songtitle');
  
      getLyrics(artist, songTitle);
    }
});