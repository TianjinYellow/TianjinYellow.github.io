(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const progress = document.getElementById("scroll-progress-bar");
  const year = document.getElementById("year");
  const music = document.getElementById("background-music");
  const musicToggle = document.getElementById("music-toggle");

  const storedTheme = window.localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    window.localStorage.setItem("theme", theme);
  }

  function updateProgress() {
    if (!progress) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
    progress.style.width = amount + "%";
  }

  applyTheme(initialTheme);
  updateProgress();

  if (toggle) {
    toggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  if (music && musicToggle) {
    const stopAutoplayRetry = function () {
      document.removeEventListener("pointerdown", retryAutoplay);
      document.removeEventListener("keydown", retryAutoplay);
    };

    const retryAutoplay = function (event) {
      if (musicToggle.contains(event.target)) {
        stopAutoplayRetry();
        return;
      }
      if (music.paused) music.play().catch(function () {});
    };

    const updateMusicControl = function () {
      const playing = !music.paused;
      const label = (playing ? "Pause" : "Play") + " Kiss the Rain by Yiruma";
      musicToggle.setAttribute("aria-pressed", String(playing));
      musicToggle.setAttribute("aria-label", label);
      musicToggle.title = label;
      musicToggle.querySelector("span").textContent = playing ? "\u23f8" : "\u266b";
    };

    musicToggle.addEventListener("click", async function () {
      if (music.paused) {
        try {
          await music.play();
        } catch (error) {
          musicToggle.setAttribute("aria-label", "Unable to play Kiss the Rain");
          musicToggle.title = "Unable to play Kiss the Rain";
        }
      } else {
        music.pause();
      }
    });
    music.addEventListener("play", updateMusicControl);
    music.addEventListener("play", stopAutoplayRetry);
    music.addEventListener("pause", updateMusicControl);
    document.addEventListener("pointerdown", retryAutoplay);
    document.addEventListener("keydown", retryAutoplay);
    music.play().catch(function () {});
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
})();
