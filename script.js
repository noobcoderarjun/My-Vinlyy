// ============================================================
// MY VINYLL
// YouTube Vinyl Player
// ============================================================


// ============================================================
// GOOGLE CLIENT ID
// ============================================================

const CLIENT_ID = "795809069739-s7lm14e62q020dt31pup29vnk3p7l5k6.apps.googleusercontent.com";


// ============================================================
// YOUTUBE API
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
// APP STATE
// ============================================================

let youtubeAccessToken = null;

let youtubePlaylists = [];

let currentPlaylist = null;

let currentVideos = [];

let currentVideoIndex = 0;

let playing = false;

let youtubePlayer = null;

let youtubeReady = false;


// ============================================================
// YOUTUBE IFRAME API
// ============================================================

window.onYouTubeIframeAPIReady = function () {

    youtubePlayer =
        new YT.Player(
            "youtube-player",
            {

                height: "1",

                width: "1",

                videoId: "",

                playerVars: {

                    playsinline: 1,

                    controls: 0,

                    rel: 0

                },

                events: {

                    onReady:
                        function () {

                            youtubeReady = true;

                            console.log(
                                "YouTube player ready."
                            );

                        },

                    onStateChange:
                        function (event) {

                            handlePlayerState(
                                event
                            );

                        },

                    onError:
                        function (event) {

                            console.error(
                                "YouTube player error:",
                                event.data
                            );

                            alert(
                                "YouTube couldn't play this video. Try another video."
                            );

                        },

                    onAutoplayBlocked:
                        function () {

                            console.log(
                                "YouTube autoplay was blocked."
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

    if (!window.YT) return;


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

        startTimeCounter();

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


        playNextVideo();

    }

}


// ============================================================
// TIME DISPLAY
// ============================================================

let timeTimer = null;


function startTimeCounter() {

    clearInterval(
        timeTimer
    );


    timeTimer =
        setInterval(
            function () {

                if (
                    !youtubePlayer ||
                    !youtubeReady
                ) {

                    return;

                }


                const current =
                    youtubePlayer
                        .getCurrentTime();


                const minutes =
                    Math.floor(
                        current / 60
                    );


                const seconds =
                    Math.floor(
                        current % 60
                    );


                timeDisplay.textContent =
                    String(minutes)
                        .padStart(2, "0")
                    + ":"
                    + String(seconds)
                        .padStart(2, "0");

            },
            500
        );

}


// ============================================================
// PLAY / PAUSE
// ============================================================

playButton.addEventListener(
    "click",
    function () {

        if (!currentVideos.length) {

            alert(
                "Connect YouTube and choose a song first."
            );

            return;

        }


        if (
            !youtubePlayer ||
            !youtubeReady
        ) {

            alert(
                "YouTube player is still loading. Try again in a moment."
            );

            return;

        }


        if (playing) {

            youtubePlayer.pauseVideo();

        } else {

            youtubePlayer.playVideo();

        }

    }
);


// ============================================================
// RESTART
// ============================================================

document
    .getElementById("restart")
    .addEventListener(
        "click",
        function () {

            if (
                !youtubePlayer ||
                !youtubeReady
            ) return;


            youtubePlayer.seekTo(
                0,
                true
            );

            youtubePlayer.playVideo();

        }
    );


// ============================================================
// PREVIOUS
// ============================================================

document
    .getElementById("previous")
    .addEventListener(
        "click",
        function () {

            if (!currentVideos.length)
                return;


            currentVideoIndex--;


            if (
                currentVideoIndex < 0
            ) {

                currentVideoIndex =
                    currentVideos.length - 1;

            }


            showCurrentVideo();

        }
    );


// ============================================================
// NEXT
// ============================================================

document
    .getElementById("next")
    .addEventListener(
        "click",
        function () {

            if (!currentVideos.length)
                return;


            playNextVideo();

        }
    );


// ============================================================
// PLAY NEXT
// ============================================================

function playNextVideo() {

    if (!currentVideos.length)
        return;


    currentVideoIndex++;


    if (
        currentVideoIndex >=
        currentVideos.length
    ) {

        currentVideoIndex = 0;

    }


    showCurrentVideo();

}


// ============================================================
// SHUFFLE
// ============================================================

document
    .getElementById("shuffle")
    .addEventListener(
        "click",
        function () {

            if (!currentVideos.length)
                return;


            currentVideoIndex =
                Math.floor(
                    Math.random() *
                    currentVideos.length
                );


            showCurrentVideo();

        }
    );


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
// PLAYLIST PANEL
// ============================================================

const playlistPanel =
    document.createElement("div");

playlistPanel.id =
    "playlist-panel";


playlistPanel.innerHTML = `

    <div class="playlist-header">

        <h2>
            YOUR PLAYLISTS
        </h2>

        <button id="close-playlists">
            ×
        </button>

    </div>


    <div id="playlist-list">
        Connect YouTube to see your playlists.
    </div>


    <div id="video-list"></div>

`;


document.body.appendChild(
    playlistPanel
);


// ============================================================
// PANEL STYLE
// ============================================================

const panelStyle =
    document.createElement("style");


panelStyle.textContent = `

#playlist-panel {

    position: fixed;

    top: 30px;

    right: 30px;

    width: 360px;

    max-height: 80vh;

    background: rgba(245,242,232,.98);

    border: 1px solid #aaa;

    border-radius: 18px;

    padding: 24px;

    z-index: 9999;

    overflow-y: auto;

    box-shadow:
        0 20px 60px rgba(0,0,0,.18);

    display: none;

}


.dark #playlist-panel {

    background:
        rgba(15,39,56,.98);

    color: white;

}


.playlist-header {

    display: flex;

    justify-content:
        space-between;

    align-items:
        center;

    margin-bottom: 20px;

}


.playlist-header h2 {

    font-size: 15px;

    letter-spacing: 3px;

}


#close-playlists {

    border: none;

    background: none;

    font-size: 25px;

    cursor: pointer;

}


.playlist-item {

    padding: 14px;

    margin-bottom: 8px;

    border-radius: 10px;

    cursor: pointer;

    transition: .2s;

    border:
        1px solid transparent;

}


.playlist-item:hover {

    border-color: #777;

    transform:
        translateX(3px);

}


.playlist-title {

    font-weight: bold;

}


.playlist-count {

    opacity: .6;

    font-size: 12px;

    margin-top: 4px;

}


.video-item {

    padding: 12px;

    margin: 6px 0;

    border-radius: 8px;

    cursor: pointer;

    font-size: 13px;

}


.video-item:hover {

    background:
        rgba(120,120,120,.15);

}


#youtube-player-container {

    position: fixed;

    width: 1px;

    height: 1px;

    overflow: hidden;

    left: -10px;

    bottom: 0;

}

`;


document.head.appendChild(
    panelStyle
);


// ============================================================
// CLOSE PLAYLISTS
// ============================================================

document
    .getElementById(
        "close-playlists"
    )
    .addEventListener(
        "click",
        function () {

            playlistPanel.style.display =
                "none";

        }
    );


// ============================================================
// GOOGLE LOGIN
// ============================================================

youtubeButton.addEventListener(
    "click",
    function () {

        if (
            CLIENT_ID ===
            "YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com"
        ) {

            alert(
                "Add your Google Client ID first."
            );

            return;

        }


        if (
            !window.google ||
            !window.google.accounts
        ) {

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


                            youtubeAccessToken =
                                response.access_token;


                            youtubeButton.textContent =
                                "YOUTUBE CONNECTED ✓";


                            youtubeButton.disabled =
                                true;


                            await loadPlaylists();

                        }

                });


        tokenClient
            .requestAccessToken();

    }
);


// ============================================================
// LOAD PLAYLISTS
// ============================================================

async function loadPlaylists() {

    try {

        const url =
            YOUTUBE_API +
            "/playlists" +
            "?part=snippet,contentDetails" +
            "&mine=true" +
            "&maxResults=50";


        const response =
            await fetch(
                url,
                {

                    headers: {

                        Authorization:
                            `Bearer ${youtubeAccessToken}`

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


        youtubePlaylists =
            data.items || [];


        displayPlaylists();


        playlistPanel.style.display =
            "block";

    }


    catch (error) {

        console.error(error);

        alert(
            "Something went wrong loading YouTube."
        );

    }

}


// ============================================================
// DISPLAY PLAYLISTS
// ============================================================

function displayPlaylists() {

    const list =
        document.getElementById(
            "playlist-list"
        );


    const videoList =
        document.getElementById(
            "video-list"
        );


    list.innerHTML = "";

    videoList.innerHTML = "";


    youtubePlaylists.forEach(
        function (playlist) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "playlist-item";


            const title =
                playlist.snippet.title;


            const count =
                playlist.contentDetails
                    ?.itemCount || 0;


            item.innerHTML = `

                <div class="playlist-title">
                    ${escapeHTML(title)}
                </div>

                <div class="playlist-count">
                    ${count} videos
                </div>

            `;


            item.addEventListener(
                "click",
                function () {

                    loadPlaylistVideos(
                        playlist.id,
                        title
                    );

                }
            );


            list.appendChild(item);

        }
    );

}


// ============================================================
// LOAD VIDEOS
// ============================================================

async function loadPlaylistVideos(
    playlistId,
    playlistTitle
) {

    try {

        const url =
            YOUTUBE_API +
            "/playlistItems" +
            "?part=snippet,contentDetails" +
            "&playlistId=" +
            encodeURIComponent(
                playlistId
            ) +
            "&maxResults=50";


        const response =
            await fetch(
                url,
                {

                    headers: {

                        Authorization:
                            `Bearer ${youtubeAccessToken}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(data);

            alert(
                "Couldn't load this playlist."
            );

            return;

        }


        currentPlaylist =
            playlistTitle;


        currentVideos =
            data.items || [];


        currentVideoIndex = 0;


        displayVideos();


        if (
            currentVideos.length
        ) {

            showCurrentVideo();

        }

    }


    catch (error) {

        console.error(error);

        alert(
            "Couldn't load playlist videos."
        );

    }

}


// ============================================================
// DISPLAY VIDEOS
// ============================================================

function displayVideos() {

    const videoList =
        document.getElementById(
            "video-list"
        );


    videoList.innerHTML = `

        <h3>
            ${escapeHTML(currentPlaylist)}
        </h3>

    `;


    currentVideos.forEach(
        function (video, index) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "video-item";


            item.textContent =
                `${index + 1}. ${video.snippet.title}`;


            item.addEventListener(
                "click",
                function () {

                    currentVideoIndex =
                        index;

                    showCurrentVideo();

                }
            );


            videoList.appendChild(item);

        }
    );

}


// ============================================================
// SHOW VIDEO
// ============================================================

function showCurrentVideo() {

    const video =
        currentVideos[
            currentVideoIndex
        ];


    if (!video)
        return;


    const videoId =
        video.contentDetails?.videoId;


    if (!videoId)
        return;


    const title =
        video.snippet.title;


    const channel =
        video.snippet
            .videoOwnerChannelTitle ||
        video.snippet.channelTitle ||
        "YouTube";


    songTitle.textContent =
        title;


    artist.textContent =
        channel;


    timeDisplay.textContent =
        "00:00";


    playing = false;


    record.classList.remove(
        "spinning"
    );


    playButton.textContent =
        "▶";


    if (
        youtubePlayer &&
        youtubeReady
    ) {

        youtubePlayer.loadVideoById(
            videoId
        );

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ============================================================
// CONSOLE
// ============================================================

console.log(
    "My Vinyll + YouTube player loaded."
);
