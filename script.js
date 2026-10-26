console.log('LETS GET STARTED BABIIIII !!!!!!!! ARGHHHH !!!')
const songs = [
    {name: "Let Me Love You" , file: "songs/song1.mp3", cover: "cover1.jpg" },
    {name: "Carry on my wayward son" , file: "songs/song2.mp3", cover: "cover2.jpg" },
    {name: "Bad Guy" , file: "songs/song3.mp3", cover: "cover3.jpg" },
    {name: "Dandelions" , file: "songs/song4.mp3", cover: "cover4.jpg" },
    { name: "Renegade" , file: "songs/song5.mp3", cover: "cover5.jpg" },
    {name: "Wanted Dead or Alive" , file: "songs/song6.mp3", cover: "cover6.jpg" },
    { name: "Whatsup Danger", file: "songs/song7.mp3", cover: "cover7.jpg" },
    {name: "Bohemian Rhapsody", file: "songs/song8.mp3", cover: "cover8.jpg" },
    { name: "Billi Jean", file: "songs/song9.mp3", cover: "cover9.jpg" },
    {name: "Despacito" , file: "songs/song10.mp3", cover: "cover10.jpg" }
];

//added covers for all songs

const audio = new Audio();
audio.preload = "metadata";
let songIndex = 0;
let isPlaying = false;
const masterPlay = document.getElementById("masterPlay");
const progressBar = document.getElementById("myProgressBar");
const songInfo = document.querySelector(".songInfo");
const songInfoImage = songInfo.querySelector("img");
const songItems = Array.from(document.querySelectorAll(".songItem"));
const songListContainer = document.querySelector(".songItemContainer");
const icons = document.querySelector(".icons");
const previousButton = icons.children[0];
const nextButton = icons.children[2];
const songTitle = document.createElement("span");

songInfo.appendChild(songTitle);

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getPlayIcon(element) {
    return element.querySelector(".songlistplay i, .songlistplay svg");
}

function updateIcons() {
    masterPlay.classList.toggle("fa-circle-play", !isPlaying);
    masterPlay.classList.toggle("fa-circle-pause", isPlaying);

    songItems.forEach((item, index) => {
        const icon = getPlayIcon(item);
        if (!icon) return;

        const playing = index === songIndex && isPlaying;

        icon.classList.toggle("fa-circle-play", !playing);
        icon.classList.toggle("fa-circle-pause", playing);
    });
}

function renderSongList() {
    songItems.forEach((item, index) => {
        const song = songs[index];
        if (!song) return;

        const image = item.querySelector("img");
        const title = item.querySelector("span:not(.songlistplay)");
        const timestamp = item.querySelector(".timestamp");

        if (image) image.src = song.cover;
        if (title) title.textContent = song.name;

        if (timestamp) {
            timestamp.dataset.duration = "00:00";
            timestamp.innerHTML =
                '00:00 <i class="fa-solid fa-circle-play"></i>';
        }
    });
}

function loadSong(index) {
    songIndex = (index + songs.length) % songs.length;

    const song = songs[songIndex];

    audio.src = song.file;
    audio.load();

    songTitle.textContent = song.name;
    songInfoImage.src = song.cover;
    progressBar.value = 0;

    songInfoImage.style.opacity = "0";

    updateIcons();
}

async function playSong() {
    try {
        await audio.play();

        isPlaying = true;
        songInfoImage.style.opacity = "1";
        updateIcons();
    } catch (error) {
        isPlaying = false;
        updateIcons();

        console.error("Playback failed:", error);

        alert(
            "Could not play the song . check that the MP3 file exists at:\n" +
            songs[songIndex].file
        );
    }
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    updateIcons();
}


masterPlay.addEventListener("click", () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});



previousButton.addEventListener("click", () => {
    loadSong(songIndex - 1);
    playSong();
});

nextButton.addEventListener("click", () => {
    loadSong(songIndex + 1);
    playSong();
});


songListContainer.addEventListener("click", event => {
    const item = event.target.closest(".songItem");
    if (!item) return;

    const index = songItems.indexOf(item);
    if (index < 0 || index >= songs.length) return;

    if (index === songIndex && !audio.paused) {
        pauseSong();
    } else {
        loadSong(index);
        playSong();
    }
});



audio.addEventListener("timeupdate", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progressBar.value =
            (audio.currentTime / audio.duration) * 100;
    }
});



progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (Number(progressBar.value) / 100) * audio.duration;
    }
});


audio.addEventListener("loadedmetadata", () => {
    const timestamp =
        songItems[songIndex]?.querySelector(".timestamp");

    if (timestamp) {
        timestamp.dataset.duration = formatTime(audio.duration);
        timestamp.firstChild.textContent =
            formatTime(audio.duration) + " ";
    }
});


audio.addEventListener("ended", () => {
    loadSong(songIndex + 1);
    playSong();
});



audio.addEventListener("error", () => {
    console.error(
        "Unable to load audio file:",
        songs[songIndex].file,
        audio.error
    );
});


// lets gooo !!!
renderSongList();
loadSong(0);