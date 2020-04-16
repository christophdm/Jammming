let accessToken = ''
const clientID = 'a059068ba73e4541a982207d73cfe8d5'
const redirectUri = 'http://jammming-project-app.surge.sh'

const Spotify = {
  getAccessToken () {
    if(accessToken){
      return accessToken
    }
    const URL = window.location.href
    const accessTokenMatch = URL.match(/access_token=([^&]*)/)
    const expiresInMatch = URL.match(/expires_in=([^&]*)/)
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1]
      const expiresIn =  Number(expiresInMatch[1])
      // Cleans Parameters
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken
    } else {
      window.location = 'https://accounts.spotify.com/authorize?client_id='+clientID+
      '&response_type=token&scope=playlist-modify-public&redirect_uri='+redirectUri
    }
  },
  search (term) {
    const accessToken = Spotify.getAccessToken();
    return fetch('https://api.spotify.com/v1/search?type=track&q='+term, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json()
    }).then(jsonResponse => {
      if (!jsonResponse.tracks){
        return []
      }
      return jsonResponse.tracks.items.map(track => ({
        id:track.id,
        name:track.name,
        artist:track.artists[0].name,
        album:track.album.name,
        uri:track.uri
      }))
    })
  },
  savePlaylist(playlistName,trackURIs) {
    if (!playlistName || !trackURIs.length) {
      return
    }
    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`}
    let userID;
    return fetch('https://api.spotify.com/v1/me', {headers:headers}).then(response => {
      return response.json()
    }).then(jsonResponse=> {
      userID = jsonResponse.id
      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,{
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name:playlistName})
      }).then(response =>{
        return response.json()
      }).then(jsonResponse => {
          const playlistID = jsonResponse.id
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,{
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris:trackURIs})
          })
      })
    })
  }
}

export default Spotify;