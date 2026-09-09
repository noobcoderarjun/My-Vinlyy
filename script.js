// ==================================================
// MY VINYLL
// YouTube + Vinyl Player
// ==================================================


// ==================================================
// GOOGLE CLIENT ID
// ==================================================

const CLIENT_ID = "795809069739-s7lm14e62q020dt31pup29vnk3p7l5k6.apps.googleusercontent.com";


// ==================================================
// ELEMENTS
// ==================================================

const record = document.getElementById("record");

const playButton = document.getElementById("play");

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


// ==================================================
// VINYL PLAY / PAUSE
// ==================================================

let playing = false;


playButton.addEventListener("click", function () {

    playing = !playing;


    if (playing) {

        record.classList.add("spinning");

        playButton.textContent = "Ⅱ";

        timeDisplay.textContent = "00:01";

    } else {

        record.classList.remove("spinning");

        playButton.textContent = "▶";

    }

});


// ==================================================
// RESTART
// ==================================================

document
    .getElementById("restart")
    .addEventListener("click", function () {

        timeDisplay.textContent = "00:00";

    });


// ==================================================
// PREVIOUS
// ==================================================

document
    .getElementById("previous")
    .addEventListener("click", function () {

        songTitle.textContent = "Previous Track";

        artist.textContent = "ARTIST NAME";

    });


// ==================================================
// NEXT
// ==================================================

document
    .getElementById("next")
    .addEventListener("click", function () {

        songTitle.textContent = "Next Track";

        artist.textContent = "ARTIST NAME";

    });


// ==================================================
// SHUFFLE
// ==================================================

document
    .getElementById("shuffle")
    .addEventListener("click", function () {

        songTitle.textContent = "Random Track";

        artist.textContent = "ARTIST NAME";

    });


// ==================================================
// DARK MODE
// ==================================================

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark");


    if (
        document.body.classList.contains("dark")
    ) {

        themeButton.textContent = "☀";

    } else {

        themeButton.textContent = "◐";

    }

});


// ==================================================
// YOUTUBE LOGIN
// ==================================================

youtubeButton.addEventListener(
    "click",
    function () {


        // Check Client ID

        if (
            CLIENT_ID ===
            "PASTE_YOUR_CLIENT_ID_HERE"
        ) {

            alert(
                "Please add your Google Client ID first."
            );

            return;

        }


        // Check Google library

        if (
            !window.google ||
            !window.google.accounts
        ) {

            alert(
                "Google is still loading. Please refresh the page and try again."
            );

            return;

        }


        // Create Google OAuth client

        const tokenClient =
            google.accounts.oauth2.initTokenClient({

                client_id: CLIENT_ID,

                scope:
                    "https://www.googleapis.com/auth/youtube.readonly",

                callback:
                    function (response) {


                        if (response.error) {

                            console.error(response);

                            alert(
                                "YouTube authorization failed."
                            );

                            return;

                        }


                        // Save access token

                        window.youtubeAccessToken =
                            response.access_token;


                        // Update button

                        youtubeButton.textContent =
                            "YOUTUBE CONNECTED ✓";


                        youtubeButton.disabled =
                            true;


                        console.log(
                            "YouTube connected successfully!"
                        );


                        alert(
                            "YouTube connected! 🎵"
                        );

                    }

            });


        // Start Google login

        tokenClient.requestAccessToken();

    }
);
