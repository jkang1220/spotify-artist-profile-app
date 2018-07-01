window.onload = function() {
  //GET A OAUTH TOKEN FROM SPOTIFY AND REPLACE THE STRING BELOW
  const OAUTH_TOKEN = "";

  //** START OF HELPER FUNCTIONS **
  const createElementNode = (elementStr, textStr) => {
    let elementNode = document.createElement(elementStr);
    if (textStr !== undefined) {
      let textNode = document.createTextNode(textStr);
      elementNode.appendChild(textNode);
    }
    return elementNode;
  };

  const createImageNode = (url, height, width) => {
    let imgNode = document.createElement("img");
    imgNode.src = url;
    imgNode.height = JSON.stringify(height);
    imgNode.width = JSON.stringify(width);
    return imgNode;
  };

  const appendChildren = (parent, childrenNodeArr) => {
    for (let i = 0; i < childrenNodeArr.length; i++) {
      parent.appendChild(childrenNodeArr[i]);
    }
    return parent;
  };

  const addClass = (node, classStr) => node.classList.add(classStr);

  const promiseGenerator = url =>
    new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.setRequestHeader("Authorization", `Bearer ${OAUTH_TOKEN}`);
      xhr.send(null);
    });
  //** END OF HELPER FUNCTIONS **

  //** START OF SPOTIFY API DATA REQUEST FUNCTIONS **
  const fetchArtistById = id => promiseGenerator(`https://api.spotify.com/v1/artists/${id}`);
  const fetchRelatedArtistById = id =>
    promiseGenerator(`https://api.spotify.com/v1/artists/${id}/related-artists`);
  const fetchArtistTopTracks = id =>
    promiseGenerator(`https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`);
  //** END OF SPOTIFY API DATA REQUEST FUNCTIONS **

  //** START OF DOM NODES **
  let artist_block_section = document.getElementById("artist-block-container");
  let related_artists_list = document.getElementById("related-artists-list");
  let artist_top_ten_list = document.getElementById("artist-top-ten-list");
  let artist_top_ten_container = document.getElementById("artist-top-ten-container");
  let song_title_header = document.getElementById("song-title-header");
  let song_player = document.getElementById("song-player");
  //** END OF DOM NODES **

  //** START OF RENDER FUNCTIONS **
  const renderArtistBlockView = (id = "4dpARuHxo51G3z768sgnrY") => {
    artist_block_section.innerHTML = "";
    fetchArtistById(id)
      .then(data => {
        let parsed_data = JSON.parse(data);
        let artistData = {
          full_name: parsed_data.name,
          artist_image: parsed_data.images[0].url,
          followers: parsed_data.followers.total,
          artist_url: parsed_data.external_urls.spotify
        };

        let $full_name = createElementNode("h1", artistData.full_name);
        let $large_image_url = createElementNode("img", artistData.artist_image);
        let $artist_image = createImageNode(artistData.artist_image, 250, 250);
        let $followers = createElementNode("p", `Followers: ${artistData.followers}`);
        let $artist_button = createElementNode(
          "button",
          `See ${artistData.full_name}'s Spotify Profile`
        );
        $artist_button.onclick = function(e) {
          e.preventDefault();
          window.open(artistData.artist_url);
        };
        appendChildren(artist_block_section, [
          $full_name,
          $artist_image,
          $followers,
          $artist_button
        ]);
      })
      .catch(err => {
        console.error("ERROR FETCHING ARTIST BY ID: ", err);
      });
  };

  const renderArtistTopTenView = (id = "4dpARuHxo51G3z768sgnrY") => {
    artist_top_ten_list.innerHTML = "";
    fetchArtistTopTracks(id)
      .then(data => {
        data = JSON.parse(data);
        let $top_ten_tracks = data.tracks.map(track => {
          let $top_ten_track_item = createElementNode("li");
          addClass($top_ten_track_item, "artist-top-ten-list-item");
          let $song_name = createElementNode("p", track.name);
          let $preview_button = createElementNode("button", "Listen to Preview");
          $preview_button.onclick = function(e) {
            e.preventDefault();
            song_player.src = track.preview_url;
            song_title_header.innerText = `You are now listening to a preview of ${
              track.name
            } by: ${track.artists[0].name}`;
          };
          return appendChildren($top_ten_track_item, [$song_name, $preview_button]);
        });
        appendChildren(artist_top_ten_list, $top_ten_tracks);
      })
      .catch(err => {
        console.error("Error fetching the Top 10 Tracks", err);
      });
  };

  const renderRelatedArtistsView = (id = "4dpARuHxo51G3z768sgnrY") => {
    related_artists_list.innerHTML = "";
    fetchRelatedArtistById(id)
      .then(data => {
        data = JSON.parse(data);
        if (data.artists && data.artists.length > 0) {
          let related_artists = data.artists.map(artist => {
            let $artist_line_item = createElementNode("li");
            addClass($artist_line_item, "related-artists-list-item");
            let $artist_name = createElementNode("p", artist.name);
            let $artist_block = createElementNode("div");
            let $artist_image = createImageNode(artist.images[0].url, 125, 125);
            let $artist_button = createElementNode("button", `See ${artist.name}`);
            $artist_button.onclick = function(e) {
              e.preventDefault();
              song_player.removeAttribute("src");
              renderApp(artist.id);
            };
            appendChildren($artist_block, [$artist_image, $artist_button]);
            return appendChildren($artist_line_item, [$artist_name, $artist_block]);
          });
          appendChildren(related_artists_list, related_artists);
        } else {
          alert("This artist has no related artists!");
          let $no_relevant_artist = createElementNode("p", "No related Artists");
          related_artists_list.appendChild($no_relevant_artist);
        }
      })
      .catch(err => {
        console.error("ERROR FETCHING RELATED ARTIST BY ID: ", err);
      });
  };
  //** END OF RENDER FUNCTIONS **

  //RENDERING APP
  function renderApp(id) {
    renderArtistBlockView(id);
    renderArtistTopTenView(id);
    renderRelatedArtistsView(id);
  }
  renderApp();
};
