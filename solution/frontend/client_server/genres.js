import { showMainView } from './views.js';

export function populateGenres(movies, mainView, detailView, searchInput, currentPage, mainTitle, genresLink, setActiveLink, displayMoviePage, paginationContainer, movieGrid) {
    const genresDropdown = document.getElementById('genres-dropdown');
    const allGenres = [...new Set(movies.flatMap(m => m.genres || []))].sort();
    
    genresDropdown.innerHTML = '';
    
    // Add "All Genres" option
    const allLink = document.createElement('a');
    allLink.href = '#';
    allLink.textContent = 'Tutti i generi';
    allLink.addEventListener('click', (e) => {
        e.preventDefault();
        showMainView(mainView, detailView);
        searchInput.value = '';
        const recentMovies = [...movies].sort((a, b) => b.year - a.year);
        currentPage = 1;
        mainTitle.textContent = 'Film più recenti';
        setActiveLink(null);
        displayMoviePage(recentMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
    });
    genresDropdown.appendChild(allLink);
    
    // Add genre links
    allGenres.forEach(genre => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = genre;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showMainView(mainView, detailView);
            searchInput.value = '';
            const filteredMovies = movies.filter(m => m.genres.includes(genre));
            currentPage = 1;
            mainTitle.textContent = `Genere: ${genre}`;
            setActiveLink(genresLink);
            displayMoviePage(filteredMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
        });
        genresDropdown.appendChild(link);
    });
}