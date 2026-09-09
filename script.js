/* ==================================================
   VINYL PLAYER
================================================== */


/* -----------------------------
   GET HTML ELEMENTS
----------------------------- */

const record = document.getElementById("record");

const playButton = document.getElementById("play");

const themeButton = document.getElementById("theme-toggle");

const timeDisplay = document.getElementById("time");

const songTitle = document.getElementById("song-title");

const artist = document.getElementById("artist");


/* -----------------------------
   PLAY / PAUSE
----------------------------- */

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


/* -----------------------------
   RESTART
----------------------------- */

document
    .getElementById("restart")
    .addEventListener("click", function () {

        timeDisplay.textContent = "00:00";

    });


/* -----------------------------
   PREVIOUS
----------------------------- */

document
    .getElementById("previous")
    .addEventListener("click", function () {

        songTitle.textContent = "Previous Track";

        artist.textContent = "ARTIST NAME";

    });


/* -----------------------------
   NEXT
----------------------------- */

document
    .getElementById("next")
    .addEventListener("click", function () {

        songTitle.textContent = "Next Track";

        artist.textContent = "ARTIST NAME";

    });


/* -----------------------------
   SHUFFLE
----------------------------- */

document
    .getElementById("shuffle")
    .addEventListener("click", function () {

        songTitle.textContent = "Random Track";

        artist.textContent = "ARTIST NAME";

    });


/* ==================================================
   DARK MODE
================================================== */

themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        themeButton.textContent = "☀";

    } else {

        themeButton.textContent = "◐";

    }

});


/* ==================================================
   YOUTUBE BUTTON
================================================== */

document
    .getElementById("youtube-login")
    .addEventListener("click", function () {

        alert(
            "YouTube connection coming next! 🎵"
        );

    });