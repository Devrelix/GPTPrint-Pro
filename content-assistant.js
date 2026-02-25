// content-assistant.js — premium ASSISTANT message styling (print only)
(() => {
  const STYLE_ID = "cgpt-assistant-style";

  function applyAssistantStyle(settings) {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    const textAlignMap = {
      left: "left",
      center: "center",
      right: "right",
    };

    const textAlign = textAlignMap[settings.assistantAlign] || "left";
//     const DEFAULT_RADIUS = "18px";
// const DEFAULT_LIGHT_BG = "#FFFFFF";
// const DEFAULT_LIGHT_COLOR = "#000000";

// const DARK_DEFAULT_BG = "#0f172a";
// const DARK_DEFAULT_COLOR = "#FFFFFF";

let assistantBg = settings.assistantBg;
let assistantColor = settings.assistantColor;
let assistantRadius = settings.assistantRadius || "18px";

/* Clean Dark Theme Logic */
if (settings.printTheme === "dark" && !settings.assistantCustom) {
  assistantBg = "transparent";
  assistantColor = "#FFFFFF";
  assistantRadius = "0px";
}


    style.textContent = `
@media print {

  /* ==============================
     ASSISTANT CONTAINER

     
  ============================== */



article[data-turn="assistant"],
article[data-turn="assistant"] [data-message-author-role="assistant"] {
  background: ${assistantBg} !important;
  border-radius: ${assistantRadius} !important;
  padding: 12px 16px !important;
}



  /* Base text color */
  article[data-turn="assistant"] .markdown p,
  article[data-turn="assistant"] .markdown li,
  article[data-turn="assistant"] .markdown h1,
  article[data-turn="assistant"] .markdown h2,
  article[data-turn="assistant"] .markdown h3,
  article[data-turn="assistant"] .markdown h4,
  article[data-turn="assistant"] .markdown h5,
  article[data-turn="assistant"] .markdown h6,
  article[data-turn="assistant"] .markdown strong,
  article[data-turn="assistant"] .markdown blockquote,
  article[data-turn="assistant"] .markdown table,
  article[data-turn="assistant"] .markdown th,
  article[data-turn="assistant"] .markdown td {
    color: ${assistantColor} !important;
  }

  /* ==============================
     TEXT ALIGNMENT
  ============================== */

  article[data-turn="assistant"] .markdown {
    text-align: ${textAlign} !important;
    align-self: ${
      settings.assistantAlign === "right"
        ? "flex-end"
        : settings.assistantAlign === "center"
        ? "center"
        : "flex-start"
    } !important;
  }

  /* ==============================
     INLINE CODE (DARK ONLY)
  ============================== */

  body[data-print-theme="dark"]
  article[data-turn="assistant"]
  .markdown code:not([class*="whitespace-pre"]) {
    background: #1e293b !important;
    color: #ffffff !important;
    border: 1px solid #334155 !important;
  }

  /* ==============================
     FIX CODE BLOCK HEADER
  ============================== */

  body[data-print-theme="dark"]
  article[data-turn="assistant"]
  .markdown .bg-token-sidebar-surface-primary {
    color: revert !important;
  }

  /* ==============================
     PROTECT REAL CODE BLOCKS
  ============================== */

  body[data-print-theme="dark"]
  article[data-turn="assistant"]
  .markdown div.overflow-y-auto {
    background: #ffffff !important;
    color: #000000 !important;
  }

  body[data-print-theme="dark"]
  article[data-turn="assistant"]
  .markdown div.overflow-y-auto code {
    color: #000000 !important;
  }

  /* ==============================
     CONTAINER ALIGNMENT
  ============================== */

  article[data-turn="assistant"]
  [data-message-author-role="assistant"] > div {
    align-items: ${
      settings.assistantAlign === "right"
        ? "flex-end"
        : settings.assistantAlign === "center"
        ? "center"
        : "flex-start"
    } !important;
  }

}
`;
  }

  function load() {
    chrome.storage.sync.get(
      {
        assistantAlign: "left",
        assistantBg: "#FFFFFF",
        assistantColor: "#000000",
        assistantRadius: "18px",
        assistantCustom: false,
        printTheme: "light",
      },
      applyAssistantStyle
    );
  }

  load();


  chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "SETTINGS_UPDATED") {
    applyAssistantStyle(msg.settings);
  }

  if (msg.type === "PRINT_NOW") {
    load(); // reload latest settings before printing
  }
});


  chrome.storage.onChanged.addListener((changes) => {
    if (
      changes.assistantAlign ||
      changes.assistantBg ||
      changes.assistantColor ||
      changes.assistantRadius ||
      changes.printTheme
    ) {
      load();
    }
  });
})();
