export function showFilmLoader() {
    const loader = document.getElementById('film-loader');
    if (loader) loader.style.display = 'flex';
}

export function hideFilmLoader() {
    const loader = document.getElementById('film-loader');
    if (loader) loader.style.display = 'none';
}

// Sending loader into DOM using loader.html
(function loadFilmLoader() {
    fetch('./loader/loader.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(err => console.error('Loader error:', err));
})();
