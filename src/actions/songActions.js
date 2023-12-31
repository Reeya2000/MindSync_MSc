import uniqBy from "lodash/uniqBy";
import shuffle from "lodash/shuffle";
import { setArtistIds } from "./artistActions";

export const fetchSongsPending = () => {
  return {
    type: "FETCH_SONGS_PENDING",
  };
};

export const fetchSongsSuccess = (songs) => {
  // Randomly shuffle the songs array
  const shuffledSongs = shuffle(songs);

  // Get the first 20 songs from the shuffled array
  const randomSongs = shuffledSongs.slice(0, 16);

  return {
    type: "FETCH_SONGS_SUCCESS",
    songs: randomSongs,
  };
};

export const fetchSongsError = () => {
  return {
    type: "FETCH_SONGS_ERROR",
  };
};

export const fetchSongs = (accessToken) => {
  return (dispatch) => {
    const request = new Request(
      `https://api.spotify.com/v1/me/tracks?limit=50`,
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken,
        }),
      }
    );

    dispatch(fetchSongsPending());

    fetch(request)
      .then((res) => {
        if (res.statusText === "Unauthorized") {
          window.location.href = "./";
        }
        return res.json();
      })
      .then((res) => {
        // get all artist ids and remove duplicates
        let artistIds = uniqBy(res.items, (item) => {
          return item.track.artists[0].name;
        })
          .map((item) => {
            return item.track.artists[0].id;
          })
          .join(",");

        dispatch(setArtistIds(artistIds));

        dispatch(fetchSongsSuccess(res.items));
      })
      .catch((err) => {
        dispatch(fetchSongsError(err));
      });
  };
};

export const fetchRecentlyPlayedSuccess = (songs) => {
  return {
    type: "FETCH_RECENTLY_PLAYED_SUCCESS",
    songs,
  };
};

export const fetchRecentlyPlayedError = () => {
  return {
    type: "FETCH_RECENTLY_PLAYED_ERROR",
  };
};

export const fetchRecentlyPlayed = (accessToken) => {
  return (dispatch) => {
    const request = new Request(
      `https://api.spotify.com/v1/me/player/recently-played`,
      {
        headers: new Headers({
          Authorization: "Bearer " + accessToken,
        }),
      }
    );

    fetch(request)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        //remove duplicates from recently played
        res.items = uniqBy(res.items, (item) => {
          return item.track.id;
        });
        dispatch(fetchRecentlyPlayedSuccess(res.items));
      })
      .catch((err) => {
        dispatch(fetchRecentlyPlayedError(err));
      });
  };
};

export const playSong = (song) => {
  return {
    type: "PLAY_SONG",
    song,
  };
};

export const stopSong = () => {
  return {
    type: "STOP_SONG",
  };
};

export const pauseSong = () => {
  return {
    type: "PAUSE_SONG",
  };
};

export const resumeSong = () => {
  return {
    type: "RESUME_SONG",
  };
};

export const increaseSongTime = (time) => {
  return {
    type: "INCREASE_SONG_TIME",
    time,
  };
};

export const updateViewType = (view) => {
  return {
    type: "UPDATE_VIEW_TYPE",
    view,
  };
};
