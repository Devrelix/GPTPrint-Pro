// content-new-features.js — Advanced print features (WATERMARK FIXED)

(function () {
  const STYLE_ID = "cgpt-advanced-features";

  // ===============================
  // Default settings (MUST MATCH popup.js DEFAULTS)
  // ===============================
  let settings = {
    // Theme
    printTheme: "light",
    
    // Basic
    fontFamily: "default",
    includeMetadata: false,
    pageOrientation: "portrait",
    fontSize: "14px",

    // Header
    showHeader: false,
    headerText: "",
    headerSubtitle: "Generated with Devrelix - ChatGPT Pro",
    headerColor: "#667eea",
    headerAlign: "center",
    headerFontSize: "22px",
    headerSubtitleSize: "14px",

    // Watermark - FIXED DEFAULTS
    watermark: false,
    watermarkText: "Devrelix",
    watermarkOpacity: 3, // Integer 1-10, NOT decimal
    watermarkRotation: "45",
    watermarkTextSize: "120px",
    watermarkPosition: "center",

    // Margins
    marginTop: "20mm",
    marginBottom: "20mm",
  };

  // ===============================
  // Watermark position helper
  // ===============================
  function getWatermarkPositionCSS(position, rotation) {
    const positions = {
      center: `
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(${rotation}deg);
      `,
      "top-left": `
        left: 20mm;
        top: 20mm;
        transform: rotate(${rotation}deg);
      `,
      "top-right": `
        right: 20mm;
        top: 20mm;
        transform: rotate(${rotation}deg);
      `,
      "bottom-left": `
        left: 20mm;
        bottom: 20mm;
        transform: rotate(${rotation}deg);
      `,
      "bottom-center": `
        left: 50%;
        bottom: 20mm;
        transform: translateX(-50%) rotate(${rotation}deg);
      `,
      "bottom-right": `
        right: 20mm;
        bottom: 20mm;
        transform: rotate(${rotation}deg);
      `,
    };

    return `
      position: fixed;
      ${positions[position] || positions.center}
      transform-origin: center;
      pointer-events: none;
      z-index: 9999;
      white-space: nowrap;
    `;
  }

  // ===============================
  // Load settings from storage
  // ===============================
  function loadSettings() {
    chrome.storage.sync.get(settings, (loaded) => {
      // Merge loaded settings with defaults
      settings = { ...settings, ...loaded };

      // Ensure fontFamily has a value
      if (!settings.fontFamily) {
        settings.fontFamily = "default";
      }

      // Ensure watermarkOpacity is a number
      if (typeof settings.watermarkOpacity === 'string') {
        settings.watermarkOpacity = parseInt(settings.watermarkOpacity) || 3;
      }

      // Debug log (remove in production)
      console.log("GPTPrint Pro - Settings loaded:", settings);

      applyAdvancedStyles();
    });
  }

  // ===============================
  // Apply print styles
  // ===============================
  function applyAdvancedStyles() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    // Set theme attribute
    document.body.setAttribute(
      "data-print-theme",
      settings.printTheme || "light"
    );

    // Font CSS logic
    const fontCSS =
      settings.fontFamily === "default"
        ? `
    body, article, div, p {
      font-family: inherit !important;
    }
    `
        : `
    body, article, div, p {
      font-family: "${settings.fontFamily}",
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        "Noto Sans",
        sans-serif !important;
    }
    `;

    // Calculate watermark opacity (1-10 slider → 0.1-1.0 opacity)
    const watermarkOpacityValue = (settings.watermarkOpacity || 3) / 10;
    
    // Adjust opacity based on theme
    const finalOpacity = settings.printTheme === "dark" 
      ? watermarkOpacityValue * 0.8  // Slightly lower for dark theme
      : watermarkOpacityValue;

    // Build watermark CSS
    const watermarkCSS = settings.watermark
      ? `
    body::before {
      content: "${settings.watermarkText || 'Devrelix'}";
      ${getWatermarkPositionCSS(
        settings.watermarkPosition || "center",
        settings.watermarkRotation || "45"
      )}
      font-size: ${settings.watermarkTextSize || "120px"};
      font-weight: bold;
      color: ${settings.printTheme === "dark" 
        ? `rgba(255, 255, 255, ${finalOpacity})` 
        : `rgba(0, 0, 0, ${finalOpacity})`};
    }
    `
      : "";

    // Build metadata CSS
    const metadataCSS = settings.includeMetadata
      ? `
    #thread::before {
      content: "Generated on ${new Date().toLocaleDateString()} | Conversation ID: ${window.location.pathname
          .split("/")
          .pop()}";
      display: block;
      padding: 10px;
      margin-bottom: 20px;
      background: ${settings.printTheme === "dark" ? "#020617" : "#f5f5f5"};
      border-bottom: 1px solid ${settings.printTheme === "dark" ? "#334155" : "#e5e7eb"};
      font-size: 12px;
      color: ${settings.printTheme === "dark" ? "#cbd5e1" : "#666"};
      text-align: center;
    }
    `
      : "";

    // Full style injection
    style.textContent = `
/* ===========================
   GPTPrint Pro - Print Styles
   =========================== */

@media print {

  /* Force color printing */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Font override */
  ${fontCSS}

  /* Page setup */
  @page {
    size: A4 ${settings.pageOrientation || "portrait"};
    background: ${settings.printTheme === "dark" ? "#0f172a" : "#ffffff"};
    margin: ${settings.marginTop || "20mm"} 20mm ${settings.marginBottom || "20mm"} 20mm;
  }

  /* Body background and color */
  html,
  body {
    min-height: 100% !important;
    background: ${settings.printTheme === "dark" ? "#0f172a" : "#ffffff"} !important;
  }

  body[data-print-theme="dark"] {
    color: #e5e7eb !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  body[data-print-theme="light"] {
    color: #111827 !important;
  }

  /* Header font sizes */
  #cgpt-print-header .cgpt-header-title {
    font-size: ${settings.headerFontSize || "22px"} !important;
  }

  #cgpt-print-header .cgpt-header-sub {
    font-size: ${settings.headerSubtitleSize || "14px"} !important;
  }

  /* Dark mode content */
  body[data-print-theme="dark"] article[data-turn] .markdown {
    color: inherit;
  }

  /* Hide non-content elements */
  header,
  nav,
  form,
  button,
  footer,
  [role="navigation"],
  [data-testid*="button"] {
    display: none !important;
  }

  /* Typography */
  body, article, div, p {
    font-size: ${settings.fontSize || "14px"} !important;
    line-height: 1.5 !important;
  }

  /* Layout */
  main, #thread {
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    padding: 0 !important;
  }

  article[data-turn] {
    margin: 8px 0 !important;
    page-break-inside: auto !important;
    break-inside: auto !important;
  }

  /* Watermark */
  ${watermarkCSS}

  /* Metadata */
  ${metadataCSS}
}
`;

    // Debug log
    console.log("GPTPrint Pro - Styles applied. Watermark enabled:", settings.watermark);
  }

  // ===============================
  // Listen for messages from popup
  // ===============================
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "SETTINGS_UPDATED") {
      console.log("GPTPrint Pro - Settings update received:", msg.settings);
      
      // Update settings
      settings = { ...settings, ...msg.settings };
      
      // Ensure watermarkOpacity is a number
      if (typeof settings.watermarkOpacity === 'string') {
        settings.watermarkOpacity = parseInt(settings.watermarkOpacity) || 3;
      }
      
      // Apply new styles
      applyAdvancedStyles();
      
      // Send response
      sendResponse({ success: true });
    }

    if (msg.type === "PRINT_NOW") {
      console.log("GPTPrint Pro - Print triggered");
      applyAdvancedStyles();
      setTimeout(() => {
        window.print();
        sendResponse({ success: true });
      }, 200);
      return true; // Keep message channel open
    }
  });

  // ===============================
  // Initialize
  // ===============================
  function init() {
    console.log("GPTPrint Pro - Initializing...");
    loadSettings();
  }

  // Load on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // SPA navigation support (for ChatGPT's dynamic routing)
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log("GPTPrint Pro - Navigation detected, reloading settings");
      loadSettings();
    }
  }).observe(document, { subtree: true, childList: true });

  console.log("GPTPrint Pro - Content script loaded");
})();