// content-chat-toggle-simple.js — Simple version that removes gaps
(() => {
  const STYLE_ID = 'cgpt-chat-toggle-simple';
  
  function applyChatToggle(settings) {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    
    style.textContent = `
@media print {
  /* Completely remove user message containers when hidden */
  ${!settings.showUserChat ? `
    article[data-turn="user"],
    [data-message-author-role="user"],
    article[data-turn="user"] + div,
    article[data-turn="user"] + section {
      display: none !important;
      height: 0 !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      overflow: hidden !important;
    }
    
    /* Remove any spacing around hidden user messages */
    article[data-turn="user"]::before,
    article[data-turn="user"]::after {
      display: none !important;
      content: none !important;
    }
  ` : ''}
  
  /* Completely remove assistant message containers when hidden */
  ${!settings.showAssistantChat ? `
    article[data-turn="assistant"],
    [data-message-author-role="assistant"],
    article[data-turn="assistant"] + div,
    article[data-turn="assistant"] + section {
      display: none !important;
      height: 0 !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      overflow: hidden !important;
    }
    
    article[data-turn="assistant"]::before,
    article[data-turn="assistant"]::after {
      display: none !important;
      content: none !important;
    }
  ` : ''}
  
  /* Force remove any remaining gaps */
  #thread {
    display: block !important;
    gap: 0 !important;
  }
  
  #thread > * {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Only show messages that are enabled */
  article[data-turn] {
    margin: 10px 0 !important;
   
  }
  
  /* Remove any extra spacing elements */
  .mt-2, .mb-2, .my-2, .mt-4, .mb-4, .my-4 {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  
  /* When all messages are hidden */
  ${!settings.showUserChat && !settings.showAssistantChat ? `
    #thread {
      min-height: 200px !important;
    }
    
    #thread::before {
      content: "No messages selected for printing" !important;
      display: block !important;
      padding: 40px !important;
      text-align: center !important;
      color: #666 !important;
      font-style: italic !important;
      border: 2px dashed #ddd !important;
      margin: 20px !important;
    }
  ` : ''}
}

/* Fix for screen view */
@media screen {
  article[data-turn="user"],
  article[data-turn="assistant"] {
    display: block !important;
    height: auto !important;
  }
}
`;
  }
  
  function loadSettings() {
    chrome.storage.sync.get(
      {
        showUserChat: true,
        showAssistantChat: true
      },
      applyChatToggle
    );
  }
  
  // Initial load
  loadSettings();
  
  // Watch for changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.showUserChat || changes.showAssistantChat) {
      loadSettings();
    }
  });
})();