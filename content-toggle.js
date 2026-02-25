// content-toggle.js — clean print always ON
(() => {
  const STYLE_ID = "cgpt-print-cleaner-v1";

  function enable() {
    const style = document.getElementById(STYLE_ID);
    if (style) style.disabled = false;
  }

  enable();
})();
