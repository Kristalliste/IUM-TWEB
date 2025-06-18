import { showMainView } from './views.js';

export function populateGenres(movies, mainView, detailView, searchInput, currentPage, mainTitle, genresLink, setActiveLink, displayMoviePage, paginationContainer, movieGrid) {
    const genresDropdown = document.getElementById('genres-dropdown');

    // Extract unique genres
    const allGenres = movies.reduce((genres, movie) => {
        if (movie.genres) {
            movie.genres.forEach(genre => {
                if (!genres.includes(genre)) genres.push(genre);
            });
        }
        return genres;
    }, []).sort();

    // Clear and rebuild dropdown
    genresDropdown.innerHTML = '';

    // Add "All Genres" option
    const allLink = document.createElement('a');
    allLink.textContent = 'Tutti i generi';
    allLink.addEventListener('click', (e) => {
        e.preventDefault();
        // ... handle all genres selection ...
    });
    genresDropdown.appendChild(allLink);

    // Add genre-specific links
    allGenres.forEach(genre => {
        const link = document.createElement('a');
        link.textContent = genre;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // ... handle genre selection ...
        });
        genresDropdown.appendChild(link);
    });
}