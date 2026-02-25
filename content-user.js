// content-user.js — premium USER message styling (print only)
(() => {
  const STYLE_ID = "cgpt-user-style";

  function applyUserStyle(settings) {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    const textAlignMap = {
      left: 'left',
      center: 'center',
      right: 'right'
    };

    const textAlign = textAlignMap[settings.userAlign] || 'left'; // Changed from 'right' to 'left'

    style.textContent = `
@media print {
  /* User messages styling */
  article[data-turn="user"] .user-message-bubble-color {
    background: ${settings.userBg} !important;
    color: ${settings.userColor} !important;
    border-radius: ${settings.userRadius} !important;
    text-align: ${textAlign} !important;
    align-self: ${settings.userAlign === "right" ? "flex-end" : 
                 settings.userAlign === "center" ? "center" : "flex-start"} !important;
  }
  
  article[data-turn="user"] .user-message-bubble-color {
  background: X;
  color: Y;
}

    /* Inherit color for normal markdown text */
article[data-turn="assistant"] .markdown > p,
article[data-turn="assistant"] .markdown > ul li,
article[data-turn="assistant"] .markdown > ol li,
article[data-turn="assistant"] .markdown h1,
article[data-turn="assistant"] .markdown h2,
article[data-turn="assistant"] .markdown h3,
article[data-turn="assistant"] .markdown h4,
article[data-turn="assistant"] .markdown h5,
article[data-turn="assistant"] .markdown h6,
article[data-turn="assistant"] .markdown strong {
  color: inherit !important;
}




  /* Container alignment for user messages */
  article[data-turn="user"] [data-message-author-role="user"] > div {
    align-items: ${settings.userAlign === "right" ? "flex-end" : 
                  settings.userAlign === "center" ? "center" : "flex-start"} !important;
  }
}
`;
  }

  function load() {
    chrome.storage.sync.get(
      {
        userFont: "Arial",
        userFontSize: "14px",
        userColor: "#ffffff",
        userBg: "#667eea",
        userRadius: "18px",
        userAlign: "left" // Changed from "right" to "left"
      },
      applyUserStyle
    );
  }

  load();

  chrome.storage.onChanged.addListener((changes) => {
    if (
      changes.userFont ||
      changes.userFontSize ||
      changes.userColor ||
      changes.userBg ||
      changes.userRadius ||
      changes.userAlign
    ) {
      load();
    }
  });
})();