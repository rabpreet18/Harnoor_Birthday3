let player = null;
let celebrationStarted = false;
let isMuted = false;
let isPaused = false;

// YouTube API callback – must be global
function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: "0",
    width: "0",
    videoId: "B-2BCSxnyHA",
    playerVars: {
      autoplay: 0,
      controls: 0,
      start: 84,
      loop: 1,
      playlist: "B-2BCSxnyHA",
      modestbranding: 1
    },
    events: {
      onReady: function () {
        // Do nothing; we start on click.
      }
    }
  });
}

function playMusicWithRetry(retries = 8) {
  if (!player || typeof player.playVideo !== "function") {
    if (retries > 0) {
      setTimeout(() => playMusicWithRetry(retries - 1), 300);
    }
    return;
  }
  try {
    player.playVideo();
  } catch (e) {
    // Ignore autoplay errors; user can manually hit play on YouTube if needed.
  }
}

function launchConfettiBurst(count = 180, spread = 80) {
  if (typeof window.confetti !== "function") return;

  const defaults = {
    particleCount: count,
    spread: spread,
    origin: { y: 0.6 }
  };

  window.confetti(defaults);
}

function launchCelebrationConfettiSequence() {
  if (typeof window.confetti !== "function") return;

  const end = Date.now() + 1400;
  const frame = () => {
    window.confetti({
      particleCount: 60,
      spread: 70,
      origin: { x: Math.random() * 0.4 + 0.3, y: Math.random() * 0.3 + 0.2 }
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}

function setCandlesLit(lit) {
  const candles = document.querySelectorAll(".candle");
  candles.forEach((c) => {
    c.setAttribute("data-lit", lit ? "true" : "false");
  });
}

function markCakeCut() {
  const cake = document.getElementById("cake");
  if (!cake) return;
  if (!cake.classList.contains("cake-cut")) {
    cake.classList.add("cake-cut");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const landing = document.getElementById("landing");
  const scene = document.getElementById("scene");
  const startButton = document.getElementById("startButton");
  const lightCandlesBtn = document.getElementById("lightCandlesBtn");
  const blowCandlesBtn = document.getElementById("blowCandlesBtn");
  const cutCakeBtn = document.getElementById("cutCakeBtn");
  const muteMusicBtn = document.getElementById("muteMusicBtn");
  const pauseMusicBtn = document.getElementById("pauseMusicBtn");

  if (startButton) {
    startButton.addEventListener("click", () => {
      if (celebrationStarted) return;
      celebrationStarted = true;

      if (landing) landing.classList.add("hidden");
      if (scene) scene.classList.remove("hidden");

      setCandlesLit(true);
      launchCelebrationConfettiSequence();
      playMusicWithRetry();
    });
  }

  if (lightCandlesBtn) {
    lightCandlesBtn.addEventListener("click", () => {
      setCandlesLit(true);
      launchConfettiBurst(80, 60);
    });
  }

  if (blowCandlesBtn) {
    blowCandlesBtn.addEventListener("click", () => {
      setCandlesLit(false);
      launchCelebrationConfettiSequence();
    });
  }

  if (cutCakeBtn) {
    cutCakeBtn.addEventListener("click", () => {
      markCakeCut();
      launchCelebrationConfettiSequence();
    });
  }

  if (muteMusicBtn) {
    muteMusicBtn.addEventListener("click", () => {
      if (!player) return;
      try {
        if (player.isMuted && player.isMuted()) {
          player.unMute();
          isMuted = false;
          muteMusicBtn.textContent = "🔇 Mute";
        } else {
          player.mute();
          isMuted = true;
          muteMusicBtn.textContent = "🔊 Unmute";
        }
      } catch (e) {
        // ignore
      }
    });
  }

  if (pauseMusicBtn) {
    pauseMusicBtn.addEventListener("click", () => {
      if (!player) return;
      try {
        if (isPaused) {
          player.playVideo();
          isPaused = false;
          pauseMusicBtn.textContent = "⏸ Pause";
        } else {
          player.pauseVideo();
          isPaused = true;
          pauseMusicBtn.textContent = "▶️ Play";
        }
      } catch (e) {
        // ignore
      }
    });
  }
});
