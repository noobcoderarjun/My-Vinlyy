// ===============================
// MY VINYL — YOUTUBE CONNECTION
// ===============================

// Put your Google OAuth Client ID here
const CLIENT_ID = "795809069739-s7lm14e62q020dt31pup29vnk3p7l5k6.apps.googleusercontent.com";


// ===============================
// ELEMENTS
// ===============================

const record = document.getElementById("record");
const playButton = document.getElementById("play");
const themeButton = document.getElementById("theme-toggle");


// ===============================
// VINYL DEMO PLAY BUTTON
// ===============================

let playing = false;

playButton.addEventListener("click", () => {

    playing = !playing;

    if (playing) {

        record.classList.add("spinning");
        playButton.textContent = "Ⅱ";

    } else {

        record.classList.remove("spinning");
        playButton.textContent = "▶";

    }

});


// ===============================
// DARK MODE
// ===============================

themeButton.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeButton.textContent = "☀";
    } else {
        themeButton.textContent = "◐";
    }

});


// ===============================
// YOUTUBE LOGIN
// ===============================

const youtubeButton =
    document.getElementById("youtube-login");


youtubeButton.addEventListener("click", () => {

    if (
        CLIENT_ID ===
        "PASTE_YOUR_CLIENT_ID_HERE"
    ) {

        alert(
            "Add your Google Client ID to script.js first."
        );

        return;
    }


    alert(
        "YouTube connection is being prepared! 🎵"
    );

});
