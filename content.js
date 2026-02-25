// content.js — v1 baseline (default ChatGPT print style preserved)
(() => {
  const STYLE_ID = "cgpt-print-cleaner-v1";

  function injectPrintCSS() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
@media print {


    article,
  article > div,
  article section,
  article p {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  article[data-turn] {
    padding: 0 !important;
  }

  /* Kill spacer divs ChatGPT injects */
  article[data-turn] + div,
  article[data-turn] + section {
    display: none !important;
    height: 0 !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html, body,
  main, #thread,
  article,
  article * {
    opacity: 1 !important;
  }

  header,
  nav,
  form,
  a[data-skip-to-content],
  button,
  [role="navigation"],
  [data-testid="login-button"],
  [data-testid="signup-button"],
  [data-testid="profile-button"],
  #conversation-header-actions,
  .sticky,
  .fixed,
  p.text-xs.text-gray-500,
  div.text-token-text-primary.mb-5.text-center.text-xs.font-semibold {
    display: none !important;
  }

  main,
  #thread {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
  }
}
`;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectPrintCSS);
  } else {
    injectPrintCSS();
  }
})();