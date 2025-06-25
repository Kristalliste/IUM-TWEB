// Shows the film loader by setting its display to 'flex'
export function showFilmLoader() {
    const loader = document.getElementById('film-loader');
    if (loader) loader.style.display = 'flex';
}

// Hides the film loader by setting its display to 'none'
export function hideFilmLoader() {
    const loader = document.getElementById('film-loader');
    if (loader) loader.style.display = 'none';
}

// Injects the loader HTML into the DOM on page load
(function loadFilmLoader() {
    fetch('./loader/loader.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(err => console.error('Loader error:', err));
})();
