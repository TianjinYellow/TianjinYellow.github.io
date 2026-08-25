(function () {
  const data = window.homepageData;
  if (!data) return;

  const makeLink = ({ label, href }) => {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = label;
    return anchor;
  };

  const renderAuthors = (container, authors) => {
    const names = String(authors)
      .split(/\s*(?:,|;)\s*/)
      .map((name) => name.trim())
      .filter(Boolean);

    names.forEach((name, index) => {
      if (index > 0) container.appendChild(document.createTextNode(", "));

      if (name === "Tianjin Huang") {
        const me = document.createElement("strong");
        me.textContent = name;
        container.appendChild(me);

        if (index === names.length - 1 || (index > 0 && index < names.length - 1)) {
          const isCorresponding = index === names.length - 1;
          const marker = document.createElement("sup");
          marker.className = isCorresponding
            ? "author-symbol author-symbol--corresponding"
            : "author-symbol author-symbol--equal";
          marker.textContent = isCorresponding ? "\u2020" : "*";
          marker.title = isCorresponding ? "corresponding author" : "equal contribution";
          marker.setAttribute("aria-label", marker.title);
          container.appendChild(marker);
        }
        return;
      }

      container.appendChild(document.createTextNode(name));
    });
  };

  const renderResearch = () => {
    const container = document.querySelector("#research-list");
    if (!container) return;

    container.innerHTML = "";
    data.research.forEach((item) => {
      const article = document.createElement("article");
      article.className = "research-item";

      const number = document.createElement("span");
      number.className = "research-num";
      number.textContent = item.number;

      const body = document.createElement("div");
      const title = document.createElement("h3");
      title.className = "research-title";
      title.textContent = item.title;

      const text = document.createElement("p");
      text.className = "research-text";
      text.textContent = item.text;

      const links = document.createElement("div");
      links.className = "tag-list";
      item.links.forEach((link) => links.appendChild(makeLink(link)));

      body.append(title, text, links);
      article.append(number, body);
      container.appendChild(article);
    });
  };

  const renderNews = () => {
    const container = document.querySelector("#news-list");
    if (!container) return;

    const toggle = document.querySelector("#news-toggle");
    const newsItems = data.news || [];
    const initialCount = data.newsInitialCount || 10;
    let expanded = false;

    const paint = () => {
      const visibleNews = expanded ? newsItems : newsItems.slice(0, initialCount);
      container.innerHTML = "";

      visibleNews.forEach((item) => {
        const article = document.createElement("article");
        article.className = "tl-row";

        const date = document.createElement("time");
        date.className = "tl-date";
        date.dateTime = item.datetime;
        date.textContent = item.date;

        const content = document.createElement("div");
        content.className = "tl-content";

        const badge = document.createElement("span");
        badge.className = "badge-flag";
        badge.dataset.kind = item.kind.toLowerCase();
        badge.textContent = item.kind;

        const text = document.createElement("p");
        text.innerHTML = item.html;
        text.querySelectorAll("a").forEach((anchor) => {
          anchor.target = "_blank";
          anchor.rel = "noopener noreferrer";
        });

        content.append(badge, text);
        article.append(date, content);
        container.appendChild(article);
      });

      if (!toggle) return;
      const hiddenCount = Math.max(newsItems.length - initialCount, 0);
      toggle.hidden = hiddenCount === 0;
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.textContent = expanded
        ? `Show latest ${initialCount} updates`
        : `Show ${hiddenCount} more updates`;
    };

    if (toggle) {
      toggle.addEventListener("click", () => {
        expanded = !expanded;
        paint();
      });
    }

    paint();
  };

  const renderPublications = () => {
    const container = document.querySelector("#publication-list");
    if (!container) return;

    container.innerHTML = "";
    data.publications.forEach((item) => {
      const row = document.createElement("li");
      row.className = "publication";

      const venue = document.createElement("div");
      venue.className = "pub-venue";
      venue.textContent = item.venue;

      const body = document.createElement("div");
      body.className = "pub-body";

      const title = document.createElement("h3");
      title.textContent = item.title;

      const authors = document.createElement("p");
      authors.className = "pub-authors";
      renderAuthors(authors, item.authors);

      const links = document.createElement("div");
      links.className = "pub-links";
      item.links.forEach((link) => links.appendChild(makeLink(link)));

      if (item.note) {
        const note = document.createElement("strong");
        note.textContent = item.note;
        links.appendChild(note);
      }

      body.append(title, authors, links);
      row.append(venue, body);
      container.appendChild(row);
    });
  };

  const renderAppointments = () => {
    const container = document.querySelector("#appointment-list");
    if (!container) return;

    container.innerHTML = "";
    data.appointments.forEach((item) => {
      const article = document.createElement("article");
      article.className = "appointment";

      const image = document.createElement("img");
      image.src = item.logo;
      image.alt = item.alt;

      const body = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.title;

      const text = document.createElement("p");
      text.textContent = item.text;

      body.append(title, text);
      article.append(image, body);
      container.appendChild(article);
    });
  };

  const renderService = () => {
    const container = document.querySelector("#service-list");
    if (!container) return;

    container.innerHTML = "";
    data.service.forEach((item) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = item;
      container.appendChild(paragraph);
    });
  };

  renderResearch();
  renderNews();
  renderPublications();
  renderAppointments();
  renderService();
})();
