// popup.js - GPTPrint Pro Configuration (Optimized)

const DEFAULTS = {
  // Theme
  printTheme: "light",
  assistantCustom: false,

  // Basic Settings
  includeMetadata: false,
  pageOrientation: "portrait",
  fontSize: "14px",
  customFontSize: "14px",
  fontFamily: "Arial",

  // Header Settings
  showHeader: false,
  headerText: "",
  headerSubtitle: "Generated with Devrelix - ChatGPT Pro",
  headerColor: "#667eea",
  headerAlign: "center",
  headerFontSize: "22px",
  headerSubtitleSize: "14px",

  // User Message Settings
  userBg: "#F4F4F4",
  userColor: "#000000",
  userAlign: "left",
  userRadius: "18px",

  // Assistant Message Settings
  assistantBg: "#FFFFFF",
  assistantColor: "#000000",
  assistantAlign: "left",
  assistantRadius: "18px",

  // Advanced Settings
  watermark: false,
  watermarkText: "Devrelix",
  watermarkOpacity: 3,
  watermarkRotation: "45",
  watermarkTextSize: "120px",
  watermarkPosition: "center",
  marginTop: "20mm",
  marginBottom: "20mm",

  // Message visibility
  showUserChat: true,
  showAssistantChat: true,
};

// Helper Functions
function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function showStatus(message, type = "info", duration = 3000) {
  const status = $("#status");
  status.textContent = message;
  status.className = `status ${type}`;

  setTimeout(() => {
    status.textContent = "";
    status.className = "status";
  }, duration);
}

// Update Preview
function updatePreview() {
  // Update header preview
  const previewHeader = $("#previewHeader");
  const previewHeaderText = $("#previewHeaderText");
  const previewHeaderSub = $("#previewHeaderSub");

  if ($("#showHeader").checked) {
    previewHeader.style.display = "block";
    previewHeader.style.background = $("#headerColor").value;
    previewHeader.style.textAlign = $("#headerAlign").value;
    previewHeaderText.textContent = $("#headerText").value || "ChatGPT Conversation";
    previewHeaderSub.textContent = $("#headerSubtitle").value || DEFAULTS.headerSubtitle;
  } else {
    previewHeader.style.display = "none";
  }

  previewHeaderText.style.fontSize = ($("#headerFontSize").value || 22) + "px";
  previewHeaderSub.style.fontSize = ($("#headerSubtitleSize").value || 14) + "px";

  // Update user message preview
  const userPreview = $(".user-preview");
  if (userPreview) {
    userPreview.style.display = $("#showUserChat").checked ? "flex" : "none";
    userPreview.style.background = $("#userBg").value;
    userPreview.style.color = $("#userColor").value;
    userPreview.style.borderRadius = $("#userRadius").value;
    userPreview.style.alignSelf =
      $("#userAlign").value === "right"
        ? "flex-end"
        : $("#userAlign").value === "center"
          ? "center"
          : "flex-start";
  }

  // Update assistant message preview
  const assistantPreview = $(".assistant-preview");
  if (assistantPreview) {
    assistantPreview.style.display = $("#showAssistantChat").checked ? "flex" : "none";
    assistantPreview.style.background = $("#assistantBg").value;
    assistantPreview.style.color = $("#assistantColor").value;
    assistantPreview.style.borderRadius = $("#assistantRadius").value;
    assistantPreview.style.alignSelf =
      $("#assistantAlign").value === "right"
        ? "flex-end"
        : $("#assistantAlign").value === "center"
          ? "center"
          : "flex-start";
  }
}

// Update opacity value display
function updateOpacityValue() {
  const opacity = parseInt($("#watermarkOpacity").value);
  const percentage = opacity * 10;
  $("#opacityValue").textContent = `${percentage}%`;
}

// Toggle collapsible sections
function toggleCollapsible(targetId) {
  const content = $(`#${targetId}`);
  const section = content.closest('.section');
  const chevron = section.querySelector('.chevron');
  
  if (content.classList.contains('show')) {
    content.classList.remove('show');
    section.classList.remove('expanded');
  } else {
    content.classList.add('show');
    section.classList.add('expanded');
  }
}

// Load Settings
function loadSettings() {
  chrome.storage.sync.get(DEFAULTS, (settings) => {
    // Theme
    document.querySelectorAll('input[name="printTheme"]').forEach((el) => {
      el.checked = el.value === settings.printTheme;
    });

    // Font family
    $("#fontFamily").value = settings.fontFamily || DEFAULTS.fontFamily;

    // Basic settings
    $("#includeMetadata").checked = settings.includeMetadata;
    $("#pageOrientation").value = settings.pageOrientation;
    
    if (
      settings.fontSize !== "12px" &&
      settings.fontSize !== "14px" &&
      settings.fontSize !== "16px" &&
      settings.fontSize !== "18px"
    ) {
      $("#fontSize").value = "custom";
      $("#customFontSizeWrap").style.display = "block";
      $("#customFontSize").value = settings.fontSize;
    } else {
      $("#fontSize").value = settings.fontSize;
      $("#customFontSizeWrap").style.display = "none";
    }

    // Header settings
    $("#showHeader").checked = settings.showHeader;
    $("#headerText").value = settings.headerText;
    $("#headerSubtitle").value = settings.headerSubtitle;
    $("#headerColor").value = settings.headerColor;
    $("#headerAlign").value = settings.headerAlign;
    $("#headerFontSize").value = parseInt(settings.headerFontSize) || 22;
    $("#headerSubtitleSize").value = parseInt(settings.headerSubtitleSize) || 14;

    // User message settings
    $("#userBg").value = settings.userBg;
    $("#userColor").value = settings.userColor;
    $("#userAlign").value = settings.userAlign;
    $("#userRadius").value = settings.userRadius;

    // Assistant message settings
    $("#assistantBg").value = settings.assistantBg;
    $("#assistantColor").value = settings.assistantColor;
    $("#assistantAlign").value = settings.assistantAlign;
    $("#assistantRadius").value = settings.assistantRadius;

    // Advanced settings
    $("#watermark").checked = settings.watermark;
    $("#watermarkText").value = settings.watermarkText;
    $("#watermarkOpacity").value = settings.watermarkOpacity;
    $("#watermarkRotation").value = settings.watermarkRotation;
    $("#watermarkTextSize").value = settings.watermarkTextSize;
    $("#watermarkPosition").value = settings.watermarkPosition;
    $("#marginTop").value = settings.marginTop;
    $("#marginBottom").value = settings.marginBottom;

    // Message visibility
    $("#showUserChat").checked = settings.showUserChat;
    $("#showAssistantChat").checked = settings.showAssistantChat;

    // Update UI states
    updateOpacityValue();
    
    // Show/hide collapsible content based on checkbox state
    if (settings.showHeader) {
      $("#headerSettings").classList.add("show");
      $("#headerSettings").closest('.section').classList.add('expanded');
    }
    if (settings.watermark) {
      $("#watermarkSettings").classList.add("show");
      $("#watermarkSettings").closest('.section').classList.add('expanded');
    }
    
    updatePreview();
  });
}

// Save Settings
function saveSettings() {
  const settings = {
    includeMetadata: $("#includeMetadata").checked,
    pageOrientation: $("#pageOrientation").value,
    printTheme: document.querySelector('input[name="printTheme"]:checked').value,
    fontSize:
      $("#fontSize").value === "custom"
        ? $("#customFontSize").value
        : $("#fontSize").value,
    customFontSize: $("#customFontSize").value,
    fontFamily: $("#fontFamily").value,

    showHeader: $("#showHeader").checked,
    headerText: $("#headerText").value,
    headerSubtitle: $("#headerSubtitle").value,
    headerColor: $("#headerColor").value,
    headerAlign: $("#headerAlign").value,
    headerFontSize: $("#headerFontSize").value + "px",
    headerSubtitleSize: $("#headerSubtitleSize").value + "px",

    userBg: $("#userBg").value,
    userColor: $("#userColor").value,
    userAlign: $("#userAlign").value,
    userRadius: $("#userRadius").value,

    assistantBg: $("#assistantBg").value,
    assistantColor: $("#assistantColor").value,
    assistantAlign: $("#assistantAlign").value,
    assistantRadius: $("#assistantRadius").value,

    watermark: $("#watermark").checked,
    watermarkText: $("#watermarkText").value,
    watermarkOpacity: parseInt($("#watermarkOpacity").value),
    watermarkRotation: $("#watermarkRotation").value,
    watermarkTextSize: $("#watermarkTextSize").value,
    watermarkPosition: $("#watermarkPosition").value,
    marginTop: $("#marginTop").value,
    marginBottom: $("#marginBottom").value,

    showUserChat: $("#showUserChat").checked,
    showAssistantChat: $("#showAssistantChat").checked,
  };

  chrome.storage.sync.set(settings, () => {
    showStatus("✓ Settings saved!", "success", 2000);

    // Notify content scripts
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs
          .sendMessage(tabs[0].id, {
            type: "SETTINGS_UPDATED",
            settings: settings,
          })
          .catch(() => {
            // Content script might not be loaded yet
          });
      }
    });
  });
}

// Reset to Defaults
function resetToDefaults() {
  if (confirm("Reset all settings to defaults?")) {
    chrome.storage.sync.set(DEFAULTS, () => {
      loadSettings();
      showStatus("✓ Settings reset!", "success", 2000);

      // Reset assistant custom flag
      chrome.storage.sync.set({ assistantCustom: false });

      // Notify content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "SETTINGS_UPDATED",
            settings: DEFAULTS,
          });
        }
      });
    });
  }
}

// Print Now
function printNow() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs
        .sendMessage(tabs[0].id, {
          type: "PRINT_NOW",
        })
        .then(() => {
          showStatus("🎉 PDF ready! If you found it useful, you can share feedback or connect with Devrelix via the header icons.", "success", 10000);
        })
        .catch(() => {
          showStatus("⚠ Open a ChatGPT conversation first", "error");
        });
    }
  });
}

// Initialize Event Listeners
function initEventListeners() {
  // Track assistant customization
  const assistantInputs = [
    "#assistantBg",
    "#assistantColor",
    "#assistantRadius",
    "#assistantAlign"
  ];

  assistantInputs.forEach((selector) => {
    const el = $(selector);
    if (el) {
      el.addEventListener("change", () => {
        chrome.storage.sync.set({ assistantCustom: true });
      });
    }
  });

  // Main tab switching
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((t) => t.classList.remove("active"));
      $$(".tab-pane").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      $(`#${tab.dataset.tab}-tab`).classList.add("active");
    });
  });

  // Font size custom toggle
  $("#fontSize").addEventListener("change", function () {
    const isCustom = this.value === "custom";
    $("#customFontSizeWrap").style.display = isCustom ? "block" : "none";
  });

  // Style tabs (User/Assistant)
  $$(".style-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".style-tab").forEach((t) => t.classList.remove("active"));
      $$(".style-content").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      $(`#${tab.dataset.target}`).classList.add("active");
    });
  });

  // Collapsible sections
  $$(".section-header.clickable").forEach((header) => {
    header.addEventListener("click", (e) => {
      // Don't toggle if clicking on checkbox
      if (e.target.type === 'checkbox') return;
      
      const targetId = header.dataset.toggle;
      if (targetId) {
        toggleCollapsible(targetId);
      }
    });
  });

  // Checkbox toggles for collapsible sections
  $("#showHeader").addEventListener("change", function () {
    const content = $("#headerSettings");
    if (this.checked) {
      content.classList.add("show");
      content.closest('.section').classList.add('expanded');
    } else {
      content.classList.remove("show");
      content.closest('.section').classList.remove('expanded');
    }
    updatePreview();
  });

  $("#watermark").addEventListener("change", function () {
    const content = $("#watermarkSettings");
    if (this.checked) {
      content.classList.add("show");
      content.closest('.section').classList.add('expanded');
    } else {
      content.classList.remove("show");
      content.closest('.section').classList.remove('expanded');
    }
  });

  // Action buttons
  $("#saveBtn").addEventListener("click", saveSettings);
  $("#resetBtn").addEventListener("click", resetToDefaults);
  $("#printNow").addEventListener("click", printNow);

  // Opacity slider
  $("#watermarkOpacity").addEventListener("input", updateOpacityValue);
  $("#watermarkOpacity").addEventListener("change", updateOpacityValue);

  // Live preview updates
  const previewInputs = [
    "#showHeader",
    "#headerText",
    "#headerSubtitle",
    "#headerColor",
    "#headerAlign",
    "#showUserChat",
    "#showAssistantChat",
    "#userBg",
    "#userColor",
    "#userAlign",
    "#userRadius",
    "#assistantBg",
    "#assistantColor",
    "#assistantAlign",
    "#assistantRadius",
    "#headerFontSize",
    "#headerSubtitleSize",
  ];

  previewInputs.forEach((selector) => {
    const element = $(selector);
    if (element) {
      element.addEventListener("input", updatePreview);
      element.addEventListener("change", updatePreview);
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveSettings();
    }
    // Ctrl/Cmd + P to print
    if ((e.ctrlKey || e.metaKey) && e.key === "p") {
      e.preventDefault();
      printNow();
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  loadSettings();

  // verison
  const version = chrome.runtime.getManifest().version;
  const el = document.getElementById("ext-version");
  if (el) el.textContent = "v" + version;


  // Welcome animation
  setTimeout(() => {
    showStatus("✨ Ready to customize!", "success", 2500);
  }, 300);
});