const themeToggle = document.getElementById('darkToggle');

/**
 * Handles the theme toggle event.
 */
function handleThemeToggle() {
    if (themeToggle.checked) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

// Add event listener only if the toggle exists on the page
if (themeToggle) {
    themeToggle.addEventListener('change', handleThemeToggle);

    // Set the toggle state based on the current theme
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggle.checked = true;
    } else {
        themeToggle.checked = false;
    }
}
