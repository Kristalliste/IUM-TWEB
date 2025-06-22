// Funzioni globali riutilizzabili
function showFilmLoader() {
    const loader = document.getElementById('film-loader');
    if (loader) loader.style.display = 'flex';
}

function hideFilmLoader() {
    const loader = document.getElementById('film-loader');
    if (loader) loader.style.display = 'none';
}

// Inietto il loader nel DOM caricando loader.html
(function loadFilmLoader() {
    fetch('/client_server/loader/loader.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(err => console.error('Errore nel caricamento del loader:', err));
})();
