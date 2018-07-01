# spotify-artist-profile-app

Basic Artist Profile App using the Spotify API

## Specs

1.  This app consists of three sections:

    a. Artist Block

    - Shows Artist Name
    - Shows Artist Image
    - Shows Number of Followers
    - Selecting "See ARTIST_NAME Spotify Profile" button will open the artist profile on the spotify in a separate window.

    b. Top 10 Songs of Artist Block

    - Shows the current artists top 10 songs.
    - Selecting the "Listen to Preview" button will allow you to listen to a 30 second segment.

    c. Related Artists Block

    - Shows a list of artists related to the current artist
    - Selecting the "See ARTIST_NAME" button will update the page and make the three sections reflect the selected artist.

2.  By default Adele should be the first user rendered.

## Installation

1.  You must get an OAUTH KEY from Spotify and set it as a string value for the const OAUTH_TOKEN variable in app.js(line 3). Here are steps to get a temporary OAUTH Token:

- Go to https://developer.spotify.com/console/get-several-artists/
- Select the "Get Token" button next to the OAUTH Token(If you aren't logged into the spotify developer page, it will ask you to login)
- A OAUTH Key should be generated and can now be used.

2.  Open the index.html file using your browser.
