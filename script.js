// ============================================================
// MY VINYLL
// YouTube Account + Playlists
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


// ============================================================
// CREATE PLAYLIST AREA
// ============================================================

const playlistPanel =
    document.createElement("div");

playlistPanel.id = "playlist-panel";

playlistPanel.innerHTML = `
    <div class="playlist-header">
        <h2>YOUR PLAYLISTS</h2>
        <button id="close-playlists">×</button>
    </div>

    <div id="playlist-list">
        <p>Connect YouTube to see your playlists.</p>
    </div>

    <div id="video-list"></div>
`;

document.body.appendChild(playlistPanel);


// ============================================================
// BASIC PANEL STYLE
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

    background: rgba(245, 242, 232, 0.97);

    border: 1px solid #aaa;

    border-radius: 18px;

    padding: 24px;

    z-index: 9999;

    overflow-y: auto;

    box-shadow:
        0 20px 60px rgba(0,0,0,0.18);

    display: none;
}

.dark #playlist-panel {
    background: rgba(15, 39, 56, 0.98);
    color: white;
}

.playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

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

    transition: 0.2s;

    border: 1px solid transparent;
}

.playlist-item:hover {
    border-color: #777;
    transform: translateX(3px);
}

.video-item {
    padding: 12px;

    margin: 6px 0;

    border-radius: 8px;

    cursor: pointer;

    font-size: 13px;
}

.video-item:hover {
    background: rgba(120,120,120,0.15);
}

.playlist-title {
    font-weight: bold;
}

.playlist-count {
    opacity: 0.6;
    font-size: 12px;
    margin-top: 4px;
}

`;


document.head.appendChild(panelStyle);


// ============================================================
// CLOSE PLAYLIST PANEL
// ============================================================

document
    .getElementById("close-playlists")
    .addEventListener("click", () => {

        playlistPanel.style.display = "none";

    });


// ============================================================
// VINYL PLAY / PAUSE
// ============================================================

playButton.addEventListener(
    "click",
    () => {

        if (!currentVideos.length) {

            alert(
                "Connect YouTube and choose a song first."
            );

            return;

        }

        playing = !playing;

        if (playing) {

            record.classList.add("spinning");

            playButton.textContent = "Ⅱ";

        } else {

            record.classList.remove("spinning");

            playButton.textContent = "▶";

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
        () => {

            if (!currentVideos.length) return;

            currentVideoIndex = 0;

            showCurrentVideo();

        }
    );


// ============================================================
// PREVIOUS
// ============================================================

document
    .getElementById("previous")
    .addEventListener(
        "click",
        () => {

            if (!currentVideos.length) return;

            currentVideoIndex--;

            if (currentVideoIndex < 0) {

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
        () => {

            if (!currentVideos.length) return;

            currentVideoIndex++;

            if (
                currentVideoIndex >=
                currentVideos.length
            ) {

                currentVideoIndex = 0;

            }

            showCurrentVideo();

        }
    );


// ============================================================
// SHUFFLE
// ============================================================

document
    .getElementById("shuffle")
    .addEventListener(
        "click",
        () => {

            if (!currentVideos.length) return;

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
    () => {

        document.body.classList.toggle("dark");

        if (
            document.body.classList.contains("dark")
        ) {

            themeButton.textContent = "☀";

        } else {

            themeButton.textContent = "◐";

        }

    }
);


// ============================================================
// CONNECT YOUTUBE
// ============================================================

youtubeButton.addEventListener(
    "click",
    () => {

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
                "Google is still loading. Refresh the page and try again."
            );

            return;

        }


        const tokenClient =
            google.accounts.oauth2.initTokenClient({

                client_id: CLIENT_ID,

                scope: YOUTUBE_SCOPE,

                callback:
                    async (response) => {

                        if (response.error) {

                            console.error(response);

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


                        console.log(
                            "YouTube connected."
                        );


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
                "Couldn't load your YouTube playlists."
            );

            return;

        }


        youtubePlaylists =
            data.items || [];


        displayPlaylists();


        playlistPanel.style.display =
            "block";


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while loading YouTube."
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


    videoList.innerHTML = "";


    if (!youtubePlaylists.length) {

        list.innerHTML =
            "<p>No playlists found.</p>";

        return;

    }


    list.innerHTML = "";


    youtubePlaylists.forEach(
        (playlist) => {

            const item =
                document.createElement("div");


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
                () => {

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
// LOAD PLAYLIST VIDEOS
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


        if (currentVideos.length) {

            showCurrentVideo();

        }


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong loading the playlist."
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
        (video, index) => {

            const item =
                document.createElement("div");


            item.className =
                "video-item";


            const title =
                video.snippet.title;


            item.textContent =
                `${index + 1}. ${title}`;


            item.addEventListener(
                "click",
                () => {

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
// SHOW CURRENT VIDEO
// ============================================================

function showCurrentVideo() {

    const video =
        currentVideos[
            currentVideoIndex
        ];


    if (!video) return;


    const title =
        video.snippet.title;


    const channel =
        video.snippet.videoOwnerChannelTitle ||
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


    console.log(
        "Selected video:",
        video
    );

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


// ============================================================
// INITIAL STATE
// ============================================================

console.log(
    "My Vinyll loaded successfully."
);
