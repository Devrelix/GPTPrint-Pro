// content-devrelix-button.js — Stable Devrelix Print Panel (New UI Safe)
(() => {
  let panel = null;
  let btn = null;

  function createPanel(anchorBtn) {
    panel = document.createElement("div");
    panel.id = "devrelix-panel";

    Object.assign(panel.style, {
      position: "fixed",
      width: "380px",
      height: "500px",
      borderRadius: "18px",
      overflow: "hidden",
      zIndex: "9999999",
      background: "rgba(17, 24, 39, 0.98)",
      boxShadow:
        "0 25px 60px rgba(0,0,0,0.55), 0 5px 15px rgba(0,0,0,0.25)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.08)",
      transformOrigin: "top right",
      transform: "scale(0.95)",
      opacity: "0",
      transition: "transform 0.18s ease, opacity 0.18s ease",
      display: "none"
    });

    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("popup.html");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.style.background = "transparent";

    panel.appendChild(iframe);
    document.body.appendChild(panel);

    positionPanel(anchorBtn);

    // Prevent inside clicks from closing panel
    panel.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  function positionPanel(anchorBtn) {
    const rect = anchorBtn.getBoundingClientRect();

    panel.style.top = rect.bottom + 8 + "px";
    panel.style.left = rect.right - 420 + "px";
  }

  function openPanel() {
    panel.style.display = "block";
    requestAnimationFrame(() => {
      panel.style.transform = "scale(1)";
      panel.style.opacity = "1";
    });
  }

  function closePanel() {
    panel.style.transform = "scale(0.95)";
    panel.style.opacity = "0";
    setTimeout(() => {
      panel.style.display = "none";
    }, 180);
  }

  function injectUI() {
    const shareBtn = document.querySelector(
      'button[aria-label="Share"]'
    );

    if (!shareBtn) return;
    if (document.getElementById("devrelix-print-btn")) return;

    // Create fresh button (NOT clone)
    btn = document.createElement("button");
    btn.id = "devrelix-print-btn";
    btn.textContent = "GPTPrint Pro";

    btn.className = shareBtn.className; // inherit styling
    btn.style.marginLeft = "8px";

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      if (!panel) {
        createPanel(btn);
        openPanel();
      } else if (panel.style.display === "block") {
        closePanel();
      } else {
        positionPanel(btn);
        openPanel();
      }
    });

    shareBtn.parentElement.appendChild(btn);

    // Outside click close
    document.addEventListener("click", (e) => {
      if (
        panel &&
        panel.style.display === "block" &&
        !panel.contains(e.target) &&
        !btn.contains(e.target)
      ) {
        closePanel();
      }
    });

    window.addEventListener("resize", () => {
      if (panel && panel.style.display === "block") {
        positionPanel(btn);
      }
    });

    window.addEventListener("scroll", () => {
      if (panel && panel.style.display === "block") {
        positionPanel(btn);
      }
    });
  }

  const observer = new MutationObserver(injectUI);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  injectUI();
})();
