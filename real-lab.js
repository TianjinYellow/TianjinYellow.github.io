(function () {
  const data = window.REAL_LAB_DATA;
  if (!data) return;

  const summary = document.getElementById("lab-summary");
  const stats = document.getElementById("lab-stats");
  const focusList = document.getElementById("focus-list");
  const filters = document.getElementById("member-filters");
  const memberGrid = document.getElementById("member-grid");
  const opportunityList = document.getElementById("opportunity-list");

  const groups = data.groups || [];
  const members = groups.flatMap((group) =>
    (group.members || []).map((member) => ({
      ...member,
      groupId: group.id,
      groupTitle: group.title,
    })),
  );

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initials(name) {
    return String(name)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function renderStats() {
    if (!stats) return;
    const items = [
      { label: "Members", value: members.length },
      { label: "PhD Students", value: groups.find((group) => group.id === "phd")?.members?.length || 0 },
      { label: "Interns", value: groups.find((group) => group.id === "intern")?.members?.length || 0 },
    ];
    stats.innerHTML = items
      .map(
        (item) => `
          <div class="lab-stat">
            <strong>${item.value}</strong>
            <span>${escapeHtml(item.label)}</span>
          </div>
        `,
      )
      .join("");
  }

  function renderFocusAreas() {
    if (!focusList) return;
    focusList.innerHTML = (data.focusAreas || [])
      .map((area) => `<span>${escapeHtml(area)}</span>`)
      .join("");
  }

  function renderFilters() {
    if (!filters) return;
    const buttons = [{ id: "all", title: "All" }, ...groups.map((group) => ({ id: group.id, title: group.title }))];
    filters.innerHTML = buttons
      .map(
        (button, index) => `
          <button class="${index === 0 ? "active" : ""}" type="button" data-filter="${escapeHtml(button.id)}">
            ${escapeHtml(button.title)}
          </button>
        `,
      )
      .join("");

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      filters.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderMembers(button.dataset.filter);
    });
  }

  function renderMembers(filter = "all") {
    if (!memberGrid) return;
    const visibleGroups = filter === "all" ? groups : groups.filter((group) => group.id === filter);
    memberGrid.innerHTML = visibleGroups
      .map(
        (group) => `
          <section class="member-group-block">
            <header class="member-group-head">
              <h3>${escapeHtml(group.title)}</h3>
              <span>${group.members.length}</span>
            </header>
            <div class="member-list">
              ${group.members
                .map(
                  (member) => `
                    <article class="member-card">
                      <div class="member-avatar" aria-hidden="true">${escapeHtml(initials(member.name))}</div>
                      <div>
                        <h4>${escapeHtml(member.name)}</h4>
                        <p>${escapeHtml(member.role)}</p>
                      </div>
                      ${member.focus ? `<span>${escapeHtml(member.focus)}</span>` : ""}
                    </article>
                  `,
                )
                .join("")}
            </div>
          </section>
        `,
      )
      .join("");
  }

  function renderOpportunities() {
    if (!opportunityList) return;
    opportunityList.innerHTML = (data.opportunities || [])
      .map((item) => `<p>${escapeHtml(item)}</p>`)
      .join("");
  }

  if (summary) {
    summary.textContent = data.summary;
  }

  renderStats();
  renderFocusAreas();
  renderFilters();
  renderMembers();
  renderOpportunities();
})();
