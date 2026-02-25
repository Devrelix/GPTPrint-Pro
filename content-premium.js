// content-premium.js — premium print features (HEADER v1)
(() => {
  const HEADER_ID = "cgpt-print-header";

  /* ---------- SPA-safe title resolver ---------- */
  function getResolvedTitle(customTitle) {
  const DEFAULT_PLACEHOLDER = "ChatGPT Conversation";

  // Use custom title ONLY if user actually changed it
  if (
    customTitle &&
    customTitle.trim() &&
    customTitle.trim() !== DEFAULT_PLACEHOLDER
  ) {
    return customTitle.trim();
  }

  // Read from DOM <title>
  const domTitle = document.querySelector("title")?.textContent?.trim();

  if (!domTitle || domTitle === "ChatGPT") {
    return "";
  }

  return domTitle;
}



  /* ---------- Build / update header ---------- */
  function buildHeader(settings) {
    let header = document.getElementById(HEADER_ID);
    if (!header) {
      header = document.createElement("div");
      header.id = HEADER_ID;
      document.body.prepend(header);
    }

    const {
      headerText,
      headerSubtitle,
      headerLogo,
      headerAlign,
      headerColor,
      headerFont,
      headerFontSize,
    } = settings;

    header.innerHTML = `
      <div class="cgpt-header-inner">
        ${headerLogo ? `<img src="${headerLogo}" />` : ""}
        <div class="cgpt-header-text">
          <div class="cgpt-header-title">
            ${getResolvedTitle(headerText) || "ChatGPT Conversation"}
          </div>
          ${
            headerSubtitle
              ? `<div class="cgpt-header-sub">${headerSubtitle}</div>`
              : ""
          }
        </div>
      </div>
    `;

    header.setAttribute("data-align", headerAlign || "center");
    header.style.setProperty("--cgpt-header-color", headerColor || "#000");
    header.style.setProperty("--cgpt-header-font", headerFont || "Arial");
    header.style.setProperty(
      "--cgpt-header-size",
      headerFontSize || "18px",
    );
  }

  /* ---------- Print-only CSS ---------- */
  function injectHeaderCSS() {
    if (document.getElementById("cgpt-header-style")) return;

    const style = document.createElement("style");
    style.id = "cgpt-header-style";
    style.textContent = `

#${HEADER_ID} {
  display: none !important;
}

/* Show header ONLY during print */
@media print {
  #${HEADER_ID} {
    display: block !important;
    margin: 0 0 20px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #ddd;
  }

  .cgpt-header-inner {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
  }

  #${HEADER_ID}[data-align="left"] .cgpt-header-inner {
    justify-content: flex-start;
  }

  #${HEADER_ID}[data-align="right"] .cgpt-header-inner {
    justify-content: flex-end;
  }

  #${HEADER_ID} img {
    height: 28px;
    object-fit: contain;
  }

  .cgpt-header-title {
    font-size: var(--cgpt-header-size);
    font-family: var(--cgpt-header-font);
    color: var(--cgpt-header-color);
    font-weight: 600;
  }

  .cgpt-header-sub {
    font-size: 12px;
    opacity: 0.7;
  }
}
`;
    document.head.appendChild(style);
  }

  /* ---------- Load settings & apply ---------- */
  function applyHeader() {
    chrome.storage.sync.get(
      {
        showHeader: false,
        headerText: "",
        headerSubtitle: "",
        headerLogo: "",
        headerAlign: "center",
        headerColor: "#000000",
        headerFont: "Arial",
        headerFontSize: "18px",
      },
      (settings) => {
        if (!settings.showHeader) return;
        injectHeaderCSS();
        buildHeader(settings);
      },
    );
  }

  applyHeader();

  /* ---------- React to setting changes ---------- */
  chrome.storage.onChanged.addListener((changes) => {
    if (
      changes.showHeader ||
      changes.headerText ||
      changes.headerSubtitle ||
      changes.headerLogo ||
      changes.headerAlign ||
      changes.headerColor ||
      changes.headerFont ||
      changes.headerFontSize
    ) {
      applyHeader();
    }
  });

  /* ---------- React to SPA title changes ---------- */
  let lastTitle = document.title;

  const titleObserver = new MutationObserver(() => {
    if (document.title !== lastTitle) {
      lastTitle = document.title;
      applyHeader();
    }
  });

  const titleEl = document.querySelector("title");
  if (titleEl) {
    titleObserver.observe(titleEl, { childList: true });
  }
})();
