// ============================================================
// MY VINYLL
// REAL YOUTUBE PLAYER
// ============================================================


// ============================================================
// GOOGLE CLIENT ID
// ============================================================

const CLIENT_ID = "795809069739-s7lm14e62q020dt31pup29vnk3p7l5k6.apps.googleusercontent.com";


// ============================================================
// YOUTUBE
// ============================================================

const YOUTUBE_API =
    "https://www.googleapis.com/youtube/v3";

const YOUTUBE_SCOPE =
    "https://www.googleapis.com/auth/youtube.readonly";


// ============================================================
// ELEMENTS
// ============================================================

const record =
    document.getElementById("record");

const playButton =
    document.getElementById("play");

const previousButton =
    document.getElementById("previous");

const nextButton =
    document.getElementById("next");

const restartButton =
    document.getElementById("restart");

const shuffleButton =
    document.getElementById("shuffle");

const themeButton =
    document.getElementById("theme-toggle");

const youtubeButton =
    document.getElementById("youtube-login");

const songTitle =
    document.getElementById("song-title");

const artist =
    document.getElementById("artist");

const timeDisplay =
    document.getElementById("time");


// ============================================================
// STATE
// ============================================================

let accessToken = null;

let playlists = [];

let videos = [];

let currentVideo = 0;

let player = null;

let playerReady = false;

let playing = false;

let timeInterval = null;


// ============================================================
// YOUTUBE IFRAME API
// ============================================================

window.onYouTubeIframeAPIReady = function () {

    player = new YT.Player(
        "youtube-player",
        {

            width: "560",
            height: "315",

            playerVars: {

                playsinline: 1,
                controls: 1,
                rel: 0

            },

            events: {

                onReady: function () {

                    playerReady = true;

                    console.log(
                        "YouTube player ready"
                    );

                },

                onStateChange:
                    handlePlayerState,

                onError:
                    function (event) {

                        console.error(
                            "YouTube error:",
                            event.data
                        );

                        alert(
                            "This YouTube video cannot be played here. Try another song."
                        );

                    }

            }

        }
    );

};


// ============================================================
// PLAYER STATE
// ============================================================

function handlePlayerState(event) {

    if (!window.YT)
        return;


    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        playing = true;

        record.classList.add(
            "spinning"
        );

        playButton.textContent =
            "Ⅱ";

        startTime();

    }


    else if (
        event.data ===
        YT.PlayerState.PAUSED
    ) {

        playing = false;

        record.classList.remove(
            "spinning"
        );

        playButton.textContent =
            "▶";

        stopTime();

    }


    else if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        playing = false;

        record.classList.remove(
            "spinning"
        );

        playButton.textContent =
            "▶";

        stopTime();

        nextSong();

    }

}


// ============================================================
// PLAY / PAUSE
// ============================================================

playButton.addEventListener(
    "click",
    function () {

        if (!playerReady) {

            alert(
                "YouTube player is still loading."
            );

            return;

        }


        if (!videos.length) {

            alert(
                "Choose a song first."
            );

            return;

        }


        if (playing) {

            player.pauseVideo();

        } else {

            player.playVideo();

        }

    }
);


// ============================================================
// RESTART
// ============================================================

restartButton.addEventListener(
    "click",
    function () {

        if (!playerReady)
            return;

        player.seekTo(
            0,
            true
        );

        player.playVideo();

    }
);


// ============================================================
// NEXT
// ============================================================

nextButton.addEventListener(
    "click",
    nextSong
);


function nextSong() {

    if (!videos.length)
        return;


    currentVideo++;

    if (
        currentVideo >=
        videos.length
    ) {

        currentVideo = 0;

    }


    loadCurrentVideo();

}


// ============================================================
// PREVIOUS
// ============================================================

previousButton.addEventListener(
    "click",
    function () {

        if (!videos.length)
            return;


        currentVideo--;

        if (currentVideo < 0) {

            currentVideo =
                videos.length - 1;

        }


        loadCurrentVideo();

    }
);


// ============================================================
// SHUFFLE
// ============================================================

shuffleButton.addEventListener(
    "click",
    function () {

        if (!videos.length)
            return;


        currentVideo =
            Math.floor(
                Math.random() *
                videos.length
            );


        loadCurrentVideo();

    }
);


// ============================================================
// LOAD CURRENT VIDEO
// ============================================================

function loadCurrentVideo() {

    const video =
        videos[currentVideo];

    if (!video)
        return;


    const videoId =
        video.contentDetails.videoId;


    songTitle.textContent =
        video.snippet.title;


    artist.textContent =
        video.snippet
            .videoOwnerChannelTitle ||
        video.snippet.channelTitle ||
        "YouTube";


    timeDisplay.textContent =
        "00:00";


    playing = false;


    record.classList.remove(
        "spinning"
    );


    playButton.textContent =
        "▶";


    if (
        playerReady
    ) {

        player.loadVideoById(
            videoId
        );

    }

}


// ============================================================
// TIME
// ============================================================

function startTime() {

    stopTime();


    timeInterval =
        setInterval(
            function () {

                if (!playerReady)
                    return;


                const seconds =
                    Math.floor(
                        player.getCurrentTime()
                    );


                const minutes =
                    Math.floor(
                        seconds / 60
                    );


                const remaining =
                    seconds % 60;


                timeDisplay.textContent =
                    String(minutes)
                        .padStart(2, "0")
                    + ":"
                    + String(remaining)
                        .padStart(2, "0");

            },
            500
        );

}


function stopTime() {

    if (timeInterval) {

        clearInterval(
            timeInterval
        );

        timeInterval = null;

    }

}


// ============================================================
// DARK MODE
// ============================================================

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            themeButton.textContent =
                "☀";

        } else {

            themeButton.textContent =
                "◐";

        }

    }
);


// ============================================================
// CONNECT YOUTUBE
// ============================================================

youtubeButton.addEventListener(
    "click",
    function () {

        if (!window.google) {

            alert(
                "Google is still loading. Refresh the page."
            );

            return;

        }


        const tokenClient =
            google.accounts.oauth2
                .initTokenClient({

                    client_id:
                        CLIENT_ID,

                    scope:
                        YOUTUBE_SCOPE,

                    callback:
                        async function (
                            response
                        ) {

                            if (
                                response.error
                            ) {

                                console.error(
                                    response
                                );

                                alert(
                                    "YouTube authorization failed."
                                );

                                return;

                            }


                            accessToken =
                                response.access_token;


                            youtubeButton.textContent =
                                "YOUTUBE CONNECTED ✓";


                            youtubeButton.disabled =
                                true;


                            await loadPlaylists();

                        }

                });


        tokenClient.requestAccessToken();

    }
);


// ============================================================
// LOAD PLAYLISTS
// ============================================================

async function loadPlaylists() {

    const response =
        await fetch(
            YOUTUBE_API +
            "/playlists" +
            "?part=snippet,contentDetails" +
            "&mine=true" +
            "&maxResults=50",
            {

                headers: {

                    Authorization:
                        `Bearer ${accessToken}`

                }

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        console.error(data);

        alert(
            "Couldn't load your playlists."
        );

        return;

    }


    playlists =
        data.items || [];


    showPlaylistPanel();

}


// ============================================================
// PLAYLIST PANEL
// ============================================================

function showPlaylistPanel() {

    let panel =
        document.getElementById(
            "playlist-panel"
        );


    if (!panel) {

        panel =
            document.createElement(
                "div"
            );

        panel.id =
            "playlist-panel";

        document.body.appendChild(
            panel
        );

    }


    panel.innerHTML = `

        <h2>YOUR PLAYLISTS</h2>

        <div id="playlist-list"></div>

        <div id="video-list"></div>

    `;


    playlists.forEach(
        function (playlist) {

            const item =
                document.createElement(
                    "button"
                );


            item.className =
                "playlist-item";


            item.textContent =
                playlist.snippet.title;


            item.addEventListener(
                "click",
                function () {

                    loadPlaylist(
                        playlist.id
                    );

                }
            );


            document
                .getElementById(
                    "playlist-list"
                )
                .appendChild(item);

        }
    );

}


// ============================================================
// LOAD PLAYLIST
// ============================================================

async function loadPlaylist(
    playlistId
) {

    const response =
        await fetch(
            YOUTUBE_API +
            "/playlistItems" +
            "?part=snippet,contentDetails" +
            "&playlistId=" +
            encodeURIComponent(
                playlistId
            ) +
            "&maxResults=50",
            {

                headers: {

                    Authorization:
                        `Bearer ${accessToken}`

                }

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        console.error(data);

        return;

    }


    videos =
        data.items || [];


    currentVideo = 0;


    showVideos();


    if (videos.length) {

        loadCurrentVideo();

    }

}


// ============================================================
// SHOW VIDEOS
// ============================================================

function showVideos() {

    const list =
        document.getElementById(
            "video-list"
        );


    list.innerHTML =
        "<h3>SONGS</h3>";


    videos.forEach(
        function (video, index) {

            const item =
                document.createElement(
                    "button"
                );


            item.className =
                "video-item";


            item.textContent =
                `${index + 1}. ${video.snippet.title}`;


            item.addEventListener(
                "click",
                function () {

                    currentVideo =
                        index;

                    loadCurrentVideo();

                }
            );


            list.appendChild(
                item
            );

        }
    );

}


// ============================================================
// FINISHED
// ============================================================

console.log(
    "MY VINYLL — YouTube player loaded."
);
