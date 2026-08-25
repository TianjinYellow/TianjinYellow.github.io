(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const progress = document.getElementById("scroll-progress-bar");
  const year = document.getElementById("year");

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

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
})();
