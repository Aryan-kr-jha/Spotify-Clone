let songs = [];
let currentSongIndex = -1;

const songFiles = [
    "bargad(KoshalWorld.Com) - Copy.mp3",
    "Departure Lane(KoshalWorld.Com) - Copy.mp3",
    "Dil Mein Ho Tum Why Cheat India 320 Kbps - Copy.mp3",
    "Escobar Paisa (PenduJatt.Com.Se).mp3",
    "Gehra Hua Dhurandhar 320 Kbps - Copy.mp3",
    "Husn Anuv Jain 320 Kbps - Copy.mp3",
    "Tum Se Hi Jab We Met 320 Kbps - Copy.mp3"
];

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const formattedMinutes = String(mins).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
};

async function getsongs(folder) {
    const songsFolder = folder || "songs";

    return songFiles.map((fileName) => {
        return `${songsFolder}/${encodeURIComponent(fileName)}`;
    });
}

// Your real audio engine instance variable
const currentAudio = new Audio();

const formatSongName = (songUrl) => {
    let cleanSong = decodeURIComponent(songUrl).split("/").pop().replace(/\.mp3$/i, "");

    return cleanSong
        .replace("(KoshalWorld.Com)", "")
        .replaceAll("320 Kbps", "")
        .replace("Why Cheat India", "")
        .replace("Dhurandhar", "")
        .replace("Jab We Met", "")
        .replace("Anuv Jain", "")
        .replace(/\\/g, "")
        .replace(/songsdeparture/gi, "")
        .replace(/songs/gi, "")
        .toLowerCase()
        .split(" ")
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const cardPlayIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
            d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" />
    </svg>`;

const setCardImageFallback = (image) => {
    image.addEventListener("error", () => {
        image.src = "music.svg";
        image.classList.add("invert");
    });
};

const renderSongCards = (cardContainer, playButton) => {
    if (!cardContainer) return;

    cardContainer.innerHTML = "";

    const playlistCard = document.createElement("div");
    playlistCard.className = "card";
    playlistCard.innerHTML = `
        <img src="playlist.jpg" alt="Playlist cover">
        <div class="play">
            ${cardPlayIcon}
        </div>
        <h2>Playlist</h2>
        <p><a href="">${songs.length} songs</a></p>`;

    setCardImageFallback(playlistCard.querySelector("img"));
    playlistCard.addEventListener("click", (e) => {
        e.preventDefault();

        document.querySelector(".Trending-Songs h1").textContent = "Playlist";

        cardContainer.innerHTML = "";

        songs.forEach((song, index) => {
            const card = document.createElement("div");
            const songName = formatSongName(song);

            card.className = "card";
            card.innerHTML = `
            <img src="song-${index + 1}.jpg" alt="${songName} cover">
            <div class="play">
                ${cardPlayIcon}
            </div>
            <h2>${songName}</h2>
            <p><a href="">Local Song</a></p>`;

            setCardImageFallback(card.querySelector("img"));

            card.addEventListener("click", (e) => {
                e.preventDefault();
                playMusic(song, playButton);
            });

            cardContainer.append(card);
        });
    });

    cardContainer.append(playlistCard);

    songs.forEach((song, index) => {
        const card = document.createElement("div");
        const songName = formatSongName(song);

        card.className = "card";
        card.dataset.src = song;
        card.innerHTML = `
            <img src="song-${index + 1}.jpg" alt="${songName} cover">
            <div class="play">
                ${cardPlayIcon}
            </div>
            <h2>${songName}</h2>
            <p><a href="">Local Song</a></p>`;

        setCardImageFallback(card.querySelector("img"));
        card.addEventListener("click", (e) => {
            e.preventDefault();
            playMusic(song, playButton);
        });
        cardContainer.append(card);
    });
};

const updatePlayButtonIcon = (playButton) => {
    if (!playButton) return;

    if (currentAudio.paused) {
        playButton.src = "play.svg";
    } else {
        playButton.src = "pause.svg";
    }
};

const playMusic = (trackUrl, playButton) => {
    if (!trackUrl) return;

    currentSongIndex = songs.indexOf(trackUrl);
    console.log("🎯 Attempting to play track:", trackUrl);
    currentAudio.src = trackUrl;
    currentAudio.play().then(() => {
        updatePlayButtonIcon(playButton);
    })
        .catch(err => {
            console.error("Playback error:", err);
        });

    let Musicname = trackUrl.split("/").pop();
    Musicname = decodeURI(Musicname);
    Musicname = Musicname.replace(".mp3", "");
    document.querySelector(".songtime").textContent = "00:00 / 00:00";
    document.querySelector(".soninfo").textContent = Musicname;
};

async function main() {
    const songUL = document.querySelector(".songsLists ul");
    const cardContainer = document.querySelector(".cardContainer");
    const playButton = document.querySelector("#play");
    const previousButton = document.querySelector("#previous");
    const nextButton = document.querySelector("#nextt");
    const menuButton = document.querySelector(".hamburgger");
    const leftPanel = document.querySelector(".left");
    songs = [];

    if (!songUL || !playButton) {
        console.error("Required UI player elements were not found.");
        return;
    }

    currentAudio.addEventListener("play", () => updatePlayButtonIcon(playButton));
    currentAudio.addEventListener("pause", () => updatePlayButtonIcon(playButton));
    currentAudio.addEventListener("ended", () => {
        if (songs.length > 0) {
            const nextIndex = currentSongIndex === -1 ? 0 : (currentSongIndex + 1) % songs.length;
            playMusic(songs[nextIndex], playButton);
        } else {
            updatePlayButtonIcon(playButton);
        }
    });

    if (menuButton && leftPanel) {
        menuButton.addEventListener("click", () => {
            document.body.classList.toggle("nav-open");
            const isOpen = document.body.classList.contains("nav-open");
            menuButton.setAttribute("aria-label", isOpen ? "Close library" : "Open library");
        });

        document.addEventListener("click", (e) => {
            if (
                document.body.classList.contains("nav-open") &&
                !leftPanel.contains(e.target) &&
                !menuButton.contains(e.target)
            ) {
                document.body.classList.remove("nav-open");
                menuButton.setAttribute("aria-label", "Open library");
            }
        });
    }

    playButton.addEventListener("click", () => {
        if (!currentAudio.src) {
            if (songs.length > 0) {
                playMusic(songs[0], playButton);
            } else {
                console.log("No songs are loaded yet.");
            }
            return;
        }

        if (currentAudio.paused) {
            currentAudio.play().catch(err => console.error("Playback error: ", err));
        } else {
            currentAudio.pause();
        }
    });

    try {
        songs = await getsongs();
    } catch (err) {
        console.error("Error setting up player initialization:", err);
        return;
    }

    songUL.innerHTML = "";
    for (const song of songs) {
        const li = document.createElement("li");
        li.dataset.src = song;

        li.innerHTML = `
            <img class="invert" src="music.svg" alt="">
            <div class="info">
                <div></div>
                <div></div>
            </div>
            <div class="PlayNow">
                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="">
            </div>`;

        const textContainer = li.querySelector(".info div");
        if (textContainer) {
            textContainer.textContent = formatSongName(song);
        }
        songUL.append(li);
    }
    renderSongCards(cardContainer, playButton);

    songUL.addEventListener("click", (e) => {
        const li = e.target.closest("li");
        if (li && songUL.contains(li)) {
            const trackUrl = li.dataset.src;
            playMusic(trackUrl, playButton);
            document.body.classList.remove("nav-open");
        }
    });

    // Handle tracking while music is playing automatically
    currentAudio.addEventListener("timeupdate", () => {
        const currentSeconds = currentAudio.currentTime || 0;
        const totalSeconds = currentAudio.duration || 0;

        const timeDisplay = document.querySelector(".songtime");
        if (timeDisplay) {
            timeDisplay.textContent = `${formatTime(currentSeconds)} / ${formatTime(totalSeconds)}`;
        }

        const circleHandle = document.querySelector(".seekbar .circle");
        const seekbar = document.querySelector(".seekbar");
        if (circleHandle && seekbar && totalSeconds > 0) {
            const progressPercent = (currentSeconds / totalSeconds) * 100;
            seekbar.style.setProperty("--seek-progress", `${progressPercent}%`);
        }
    });

    // CLEAN AND CONNECTED SEEKBAR INTERACTION LOGIC
    const seekbar = document.querySelector(".seekbar");

    if (seekbar) {
        seekbar.addEventListener("click", e => {
            const rect = seekbar.getBoundingClientRect();

            // Calculate exact click position relative to track boundary width
            const clickX = e.clientX - rect.left;
            let percent = (clickX / rect.width) * 100;

            // Restrict movement boundary thresholds
            percent = Math.max(0, Math.min(percent, 100));

            // Instantly sync visual placement update
            seekbar.style.setProperty("--seek-progress", percent + "%");

            // Correct variable redirection targeting currentAudio instance
            if (currentAudio && currentAudio.duration) {
                currentAudio.currentTime = (percent / 100) * currentAudio.duration;
            }
        });
    }


    if (previousButton) {
        previousButton.addEventListener("click", () => {
            if (songs.length === 0) return;

            const previousIndex = currentSongIndex <= 0 ? songs.length - 1 : currentSongIndex - 1;
            playMusic(songs[previousIndex], playButton);
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", () => {
            if (songs.length === 0) return;

            const nextIndex = currentSongIndex === -1 ? 0 : (currentSongIndex + 1) % songs.length;
            playMusic(songs[nextIndex], playButton);
        });
    }
    const volumeInput = document.querySelector(".range input");

    if (volumeInput) {
        volumeInput.value = currentAudio.volume * 100;
        volumeInput.addEventListener("input", (e) => {
            currentAudio.volume = parseInt(e.target.value, 10) / 100;
        });
    }
}

main();
