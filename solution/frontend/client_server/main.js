import { movies } from './data.js';
import { showMainView, showDetailView, renderMovies } from './views.js';
import { displayMoviePage, renderPagination } from './pagination.js';
import { populateGenres } from './genres.js';

// DOM elements
const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('searchInput');
const mainView = document.querySelector('main');
const detailView = document.getElementById('movie-detail-view');
const logo = document.querySelector('.logo');
const paginationContainer = document.getElementById('pagination-container');
const mainTitle = document.getElementById('main-title');
const topRatedLink = document.getElementById('top-rated-link');
const navLinks = document.querySelectorAll('.main-nav ul > li > a');
const genresLink = document.getElementById('genres-link');

// State
let currentPage = 1;

function setActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

topRatedLink.addEventListener('click', (e) => {
    e.preventDefault();
    const mainView = document.querySelector('main');
    const detailView = document.getElementById('movie-detail-view');
    showMainView(mainView, detailView);
    searchInput.value = '';
    const topRatedMovies = [...movies].sort((a, b) => b.rating - a.rating);
    currentPage = 1;
    mainTitle.textContent = 'Film Top Rated';
    setActiveLink(topRatedLink);
    displayMoviePage(topRatedMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
});

searchInput.addEventListener('input', (e) => {
    const mainView = document.querySelector('main');
    const detailView = document.getElementById('movie-detail-view');
    if (mainView.style.display === 'none') {
        showMainView(mainView, detailView);
    }
    setActiveLink(null);
    const searchTerm = e.target.value.toLowerCase().trim();
    if (searchTerm) {
        mainTitle.textContent = `Risultati per: "${searchTerm}"`;
        const filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) || movie.year.toString().includes(searchTerm)
        );
        currentPage = 1;
        displayMoviePage(filteredMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
    } else {
        const recentMovies = [...movies].sort((a, b) => b.year - a.year);
        mainTitle.textContent = 'Film più recenti';
        currentPage = 1;
        displayMoviePage(recentMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
    }
});

logo.addEventListener('click', () => {
    searchInput.value = '';
    currentPage = 1;
    const mainView = document.querySelector('main');
    const detailView = document.getElementById('movie-detail-view');
    showMainView(mainView, detailView);
    const recentMovies = [...movies].sort((a, b) => b.year - a.year);
    mainTitle.textContent = 'Film più recenti';
    setActiveLink(null);
    displayMoviePage(recentMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
});

// Initial render
function init() {
    const mainView = document.querySelector('main');
    const detailView = document.getElementById('movie-detail-view');
    populateGenres(
        movies, 
        mainView, 
        detailView, 
        searchInput, 
        currentPage, 
        mainTitle, 
        genresLink, 
        setActiveLink, 
        displayMoviePage, 
        paginationContainer, 
        movieGrid
    );
    showMainView(mainView, detailView);
    const recentMovies = [...movies].sort((a, b) => b.year - a.year);
    displayMoviePage(recentMovies, paginationContainer, movieGrid, currentPage, mainView, detailView);
}

init();