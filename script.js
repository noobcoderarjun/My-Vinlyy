// ============================================================
// MY VINYLL
// SPIDER × ARJUNN
// YOUTUBE SEARCH + PLAYER + TIMELINE + THEME
// ============================================================


// ============================================================
// GOOGLE CLIENT ID
// ============================================================

const CLIENT_ID =
    "795809069739-s7lm14e62q020dt31pup29vnk3p7l5k6.apps.googleusercontent.com";


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

const restartButton =
    document.getElementById("restart");

const previousButton =
    document.getElementById("previous");

const nextButton =
    document.getElementById("next");

const shuffleButton =
    document.getElementById("shuffle");

const searchInput =
    document.getElementById("search");

const searchButton =
    document.getElementById("search-button");

const searchResults =
    document.getElementById("search-results");

const timeline =
    document.getElementById("timeline");

const currentTime =
    document.getElementById("current-time");

const duration =
    document.getElementById("duration");

const songTitle =
    document.getElementById("song-title");

const artist =
    document.getElementById("artist");

const youtubeButton =
    document.getElementById("youtube-login");

const themeButton =
    document.getElementById("theme-toggle");

const themeTransition =
    document.getElementById("theme-transition");


// ============================================================
// STATE
// ============================================================

let accessToken = null;

let player = null;

let playerReady = false;

let playing = false;

let timeTimer = null;

let currentVideos = [];

let currentVideoIndex = 0;

let isSeeking = false;


// ============================================================
// YOUTUBE IFRAME API
// ============================================================

window.onYouTubeIframeAPIReady = function () {

    player =
        new YT.Player(
            "youtube-player",
            {

                width: "1",
                height: "1",

                playerVars: {

                    playsinline: 1,

                    controls: 0,

                    rel: 0,

                    modestbranding: 1

                },

                events: {

                    onReady: function () {

                        playerReady = true;

                        console.log(
                            "YouTube player ready."
                        );

                    },

                    onStateChange:
                        handlePlayerState,

                    onError: function (event) {

                        console.error(
                            "YouTube error:",
                            event.data
                        );

                        alert(
                            "This YouTube video cannot be played here. Try another one."
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

        startTimeline();

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

        stopTimeline();

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

        stopTimeline();

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


        if (!currentVideos.length) {

            alert(
                "Search for a song first."
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

    if (!currentVideos.length)
        return;


    currentVideoIndex++;


    if (
        currentVideoIndex >=
        currentVideos.length
    ) {

        currentVideoIndex = 0;

    }


    playCurrentVideo();

}


// ============================================================
// PREVIOUS
// ============================================================

previousButton.addEventListener(
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


        playCurrentVideo();

    }
);


// ============================================================
// SHUFFLE
// ============================================================

shuffleButton.addEventListener(
    "click",
    function () {

        if (!currentVideos.length)
            return;


        currentVideoIndex =
            Math.floor(
                Math.random() *
                currentVideos.length
            );


        playCurrentVideo();

    }
);


// ============================================================
// PLAY CURRENT VIDEO
// ============================================================

function playCurrentVideo() {

    const video =
        currentVideos[
            currentVideoIndex
        ];


    if (!video)
        return;


    const videoId =
        video.id?.videoId ||
        video.contentDetails?.videoId;


    if (!videoId)
        return;


    songTitle.textContent =
        cleanTitle(
            video.snippet.title
        );


    artist.textContent =
        video.snippet.channelTitle ||
        "YouTube";


    timeline.value = 0;

    timeline.max = 100;

    currentTime.textContent =
        "00:00";

    duration.textContent =
        "00:00";


    updateTimelineVisual(
        0,
        100
    );


    if (playerReady) {

        player.loadVideoById(
            videoId
        );

    }

}


// ============================================================
// SEARCH YOUTUBE
// ============================================================

async function searchYouTube() {

    const query =
        searchInput.value.trim();


    if (!query)
        return;


    if (!accessToken) {

        alert(
            "Connect YouTube first."
        );

        return;

    }


    searchButton.textContent =
        "SEARCHING...";

    searchButton.disabled =
        true;


    searchResults.style.display =
        "block";


    searchResults.innerHTML =
        "<p style='padding:15px'>Searching YouTube...</p>";


    try {

        const url =
            YOUTUBE_API +
            "/search" +
            "?part=snippet" +
            "&q=" +
            encodeURIComponent(query) +
            "&type=video" +
            "&videoEmbeddable=true" +
            "&maxResults=10";


        const response =
            await fetch(
                url,
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

            searchResults.innerHTML =
                "<p style='padding:15px'>Search failed.</p>";

            return;

        }


        const results =
            data.items || [];


        displaySearchResults(
            results
        );

    }


    catch (error) {

        console.error(error);

        searchResults.innerHTML =
            "<p style='padding:15px'>Something went wrong.</p>";

    }


    finally {

        searchButton.textContent =
            "SEARCH";

        searchButton.disabled =
            false;

    }

}


// ============================================================
// SEARCH BUTTON
// ============================================================

searchButton.addEventListener(
    "click",
    searchYouTube
);


// ============================================================
// ENTER SEARCH
// ============================================================

searchInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Enter"
        ) {

            searchYouTube();

        }

    }
);


// ============================================================
// DISPLAY SEARCH RESULTS
// ============================================================

function displaySearchResults(results) {

    searchResults.innerHTML =
        "";


    if (!results.length) {

        searchResults.innerHTML =
            "<p style='padding:15px'>No videos found.</p>";

        return;

    }


    results.forEach(
        function (video) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "search-result";


            const thumbnail =
                video.snippet
                    ?.thumbnails
                    ?.medium
                    ?.url ||
                "";


            item.innerHTML = `

                <img
                    src="${thumbnail}"
                    alt=""
                >

                <div class="result-text">

                    <div class="result-title">
                        ${escapeHTML(
                            cleanTitle(
                                video.snippet.title
                            )
                        )}
                    </div>

                    <div class="result-channel">
                        ${escapeHTML(
                            video.snippet.channelTitle
                        )}
                    </div>

                </div>

            `;


            item.addEventListener(
                "click",
                function () {

                    currentVideos =
                        results;


                    currentVideoIndex =
                        results.indexOf(
                            video
                        );


                    playCurrentVideo();


                    searchResults.style.display =
                        "none";

                }
            );


            searchResults.appendChild(
                item
            );

        }
    );

}


// ============================================================
// TIMELINE
// ============================================================

function startTimeline() {

    stopTimeline();


    timeTimer =
        setInterval(
            updateTimeline,
            250
        );

}


function stopTimeline() {

    if (timeTimer) {

        clearInterval(
            timeTimer
        );

        timeTimer = null;

    }

}


function updateTimeline() {

    if (
        !playerReady ||
        isSeeking
    ) {

        return;

    }


    const current =
        player.getCurrentTime();


    const total =
        player.getDuration();


    if (!total)
        return;


    timeline.max =
        total;


    timeline.value =
        current;


    currentTime.textContent =
        formatTime(current);


    duration.textContent =
        formatTime(total);


    updateTimelineVisual(
        current,
        total
    );

}


// ============================================================
// TIMELINE DRAG
// ============================================================

timeline.addEventListener(
    "input",
    function () {

        isSeeking = true;


        const value =
            Number(
                timeline.value
            );


        const total =
            Number(
                timeline.max
            );


        currentTime.textContent =
            formatTime(value);


        updateTimelineVisual(
            value,
            total
        );

    }
);


timeline.addEventListener(
    "change",
    function () {

        if (!playerReady)
            return;


        const value =
            Number(
                timeline.value
            );


        player.seekTo(
            value,
            true
        );


        isSeeking = false;

    }
);


// ============================================================
// TIMELINE VISUAL
// ============================================================

function updateTimelineVisual(
    current,
    total
) {

    if (!total)
        return;


    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                (current / total) * 100
            )
        );


    const dark =
        document.body.classList.contains(
            "dark"
        );


    const emptyColor =
        dark
            ? "#26313a"
            : "#d5d5d5";


    timeline.style.background =
        `linear-gradient(
            to right,
            #ed1b2f 0%,
            #ed1b2f ${percentage}%,
            ${emptyColor} ${percentage}%,
            ${emptyColor} 100%
        )`;

}


// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(seconds) {

    if (
        !Number.isFinite(
            seconds
        )
    ) {

        return "00:00";

    }


    seconds =
        Math.floor(
            seconds
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":" +
        String(remaining)
            .padStart(2, "0")
    );

}


// ============================================================
// CONNECT YOUTUBE
// ============================================================

youtubeButton.addEventListener(
    "click",
    function () {

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
                        function (
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


                            console.log(
                                "YouTube connected."
                            );

                        }

                });


        tokenClient.requestAccessToken();

    }
);


// ============================================================
// THEME TOGGLE
// ============================================================

themeButton.addEventListener(
    "click",
    function (event) {

        const rect =
            themeButton.getBoundingClientRect();


        const x =
            rect.left +
            rect.width / 2;


        const y =
            rect.top +
            rect.height / 2;


        const newDarkMode =
            !document.body.classList.contains(
                "dark"
            );


        themeTransition.style.setProperty(
            "--wipe-x",
            `${x}px`
        );


        themeTransition.style.setProperty(
            "--wipe-y",
            `${y}px`
        );


        themeTransition.style.setProperty(
            "--transition-color",
            newDarkMode
                ? "#05070a"
                : "#f7f5ef"
        );


        themeTransition.classList.remove(
            "animate"
        );


        void themeTransition.offsetWidth;


        themeTransition.classList.add(
            "animate"
        );


        setTimeout(
            function () {

                document.body.classList.toggle(
                    "dark"
                );


                themeButton.textContent =
                    newDarkMode
                        ? "☀"
                        : "◐";


                updateTimelineVisual(
                    Number(
                        timeline.value
                    ),
                    Number(
                        timeline.max
                    )
                );

            },
            180
        );


        setTimeout(
            function () {

                themeTransition.classList.remove(
                    "animate"
                );

            },
            800
        );

    }
);


// ============================================================
// CLEAN YOUTUBE TITLE
// ============================================================

function cleanTitle(title) {

    if (!title)
        return "Choose a song";


    return title
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");

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
// CLOSE SEARCH WHEN CLICKING OUTSIDE
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        if (
            !searchResults.contains(event.target) &&
            !searchInput.contains(event.target) &&
            !searchButton.contains(event.target)
        ) {

            searchResults.style.display =
                "none";

        }

    }
);


// ============================================================
// READY
// ============================================================

console.log(
    "🕷️ MY VINYLL × ARJUNN READY"
);
