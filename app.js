window.onload = function() {
  //GET A OAUTH TOKEN FROM SPOTIFY AND REPLACE THE STRING BELOW
  const OAUTH_TOKEN = "";

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

  const promiseGenerator = url =>
    new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.setRequestHeader("Authorization", `Bearer ${OAUTH_TOKEN}`);
      xhr.send(null);
    });

  const fetchArtistById = id =>
    promiseGenerator(`https://api.spotify.com/v1/artists/${id}`);
  const fetchRelatedArtistById = id =>
    promiseGenerator(
      `https://api.spotify.com/v1/artists/${id}/related-artists`
    );
  const fetchArtistTopTracks = id =>
    promiseGenerator(
      `https://api.spotify.com/v1/artists/${id}/top-tracks?country=US`
    );

  let artist_block_section = document.getElementById("artist-block-container");
  let related_artists_list = document.getElementById("related-artists-list");

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
        let $large_image_url = createElementNode(
          "img",
          artistData.artist_image
        );
        let $artist_image = createImageNode(artistData.artist_image, 250, 250);
        let $followers = createElementNode(
          "p",
          `Followers: ${artistData.followers}`
        );
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
    fetchArtistTopTracks(id)
      .then(data => {
        data = JSON.parse(data);
        console.log("TOP 10 TRACKS FOR ARTIST", data);
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
            $artist_line_item.classList.add("related-artists-list-item");
            let $artist_name = createElementNode("p", artist.name);
            let $artist_block = createElementNode("div");
            let $artist_image = createImageNode(artist.images[0].url, 150, 150);
            let $artist_button = createElementNode(
              "button",
              `See ${artist.name}`
            );
            $artist_button.onclick = function(e) {
              e.preventDefault();
              renderApp(artist.id);
            };
            appendChildren($artist_block, [$artist_image, $artist_button]);
            return appendChildren($artist_line_item, [
              $artist_name,
              $artist_block
            ]);
          });
          appendChildren(related_artists_list, related_artists);
        } else {
          alert("This artist has no related artists!");
          let $no_relevant_artist = createElementNode(
            "p",
            "No related Artists"
          );
          appendChildren(related_artists_list, [$no_relevant_artist]);
        }
      })
      .catch(err => {
        console.error("ERROR FETCHING RELATED ARTIST BY ID: ", err);
      });
  };

  function renderApp(id) {
    renderArtistBlockView(id);
    renderArtistTopTenView(id);
    renderRelatedArtistsView(id);
  }

  renderApp();
};
