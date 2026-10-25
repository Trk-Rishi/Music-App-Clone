
console.log("Welcome to My Spotify");

// Get elements
const masterPlay = document.getElementById("masterPlay");
const myProgressBar = document.getElementById("myProgressBar");

// Create audio
const audioElement = new Audio("1.mp3");

// Check whether elements were found
if (!masterPlay || !myProgressBar) {
    console.error("Play button or progress bar not found!");
} else {
    // Play / Pause button
    masterPlay.addEventListener("click", async () => {
        console.log("Play button clicked");

        try {
            if (audioElement.paused) {
                await audioElement.play();
            } else {
                audioElement.pause();
            }
        } catch (error) {
            console.error("Audio playback failed:", error);
        }
    });

    // Update play button when audio plays
    audioElement.addEventListener("play", () => {
        masterPlay.classList.remove("fa-circle-play");
        masterPlay.classList.add("fa-circle-pause");
    });

    // Update play button when audio pauses
    audioElement.addEventListener("pause", () => {
        masterPlay.classList.remove("fa-circle-pause");
        masterPlay.classList.add("fa-circle-play");
    });

    // Update progress bar as audio plays
    audioElement.addEventListener("timeupdate", () => {
        if (audioElement.duration) {
            myProgressBar.value =
                (audioElement.currentTime / audioElement.duration) * 100;
        }
    });

    // Seek to position when progress bar changes
    myProgressBar.addEventListener("input", () => {
        if (audioElement.duration) {
            audioElement.currentTime =
                (myProgressBar.value / 100) * audioElement.duration;
        }
    });

    // Reset progress when song ends
    audioElement.addEventListener("ended", () => {
        myProgressBar.value = 0;
    });

    // Show audio loading errors
    audioElement.addEventListener("error", () => {
        console.error(
            "Could not load audio file. Check that 1.mp3 exists at the correct path."
        );
    });
}
