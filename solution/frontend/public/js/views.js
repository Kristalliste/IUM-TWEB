import { formatMovieDetails, formatMovieReviews, loadTemplate } from './utils.js';
import { renderUsernamePrompt } from './chat.js';
import {fetchAllGenres, fetchMovieDetails, fetchMovieReviews} from './api.js';
import { attachSearchListeners } from './modalHandler.js';
import { searchMovies } from './main.js';

// Helper function to clear active states
function clearActiveNavLinks() {
    const navLinks = document.querySelectorAll('.main-nav ul > li > a');
    navLinks.forEach(link => link.classList.remove('active'));
}

// Function to show the film details view
export function showMainView(mainView, detailView) {
    mainView.style.display = 'block';
    detailView.style.display = 'none';
    detailView.innerHTML = '';
    clearActiveNavLinks();  // Clear active states when returning to main view
}

export async function showAdvancedSearch(mainView, detailView) {
    mainView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo(0, 0);

    // Show loading state
    detailView.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading search form...</p>
        </div>
    `;

    try {
        const searchTemplate = await loadTemplate('advanced-search');

        if (!searchTemplate) throw new Error('Could not load search template');

        // Render the template
        detailView.innerHTML = searchTemplate({});

        // Initialize the search functionality
        await initSearch();

        // Attach search listeners after rendering
        //reattachSearchListeners();
        attachSearchListeners();

        // Set up back button
        const backButton = document.createElement('button');
        backButton.id = 'back-button';
        backButton.className = 'back-button';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Return to Movie List';
        backButton.addEventListener('click', () => {
            showMainView(mainView, detailView);
        });
        detailView.insertBefore(backButton, detailView.firstChild);

    } catch (error) {
        console.error('Error loading advanced search:', error);
        detailView.innerHTML = `
            <button id="back-button" class="back-button">
                <i class="fas fa-arrow-left"></i> Return to Movie List
            </button>
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Error while loading search form</h2>
                <p>Please try again later</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;

        document.getElementById('back-button').addEventListener('click', () => {
            showMainView(mainView, detailView);
        });
    }
}

export async function showDetailView(movieId, mainView, detailView) {
    mainView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo(0, 0);

    // Show loading state
    detailView.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Loading details...</p>
        </div>
    `;

    try {
        /*const movieData = await fetchMovieDetails(movieId);
        const formattedMovie = formatMovieDetails(movieData);*/
        const formattedMovie = await fetchMovieDetails(movieId);

        const movieReviews = await fetchMovieReviews(formattedMovie.originalTitle);
        const formattedReviews = formatMovieReviews(movieReviews);
        console.log("Reviews data passed to template:", formattedReviews);


        const detailTemplate = await loadTemplate('movie-detail');

        if (!detailTemplate) throw new Error('Could not load detail template');

        // Prepare data for template
        const templateData = {
            ...formattedMovie,
            reviews: formattedReviews
        };

        // Render with Handlebars
        detailView.innerHTML = detailTemplate(templateData);

        const toggleChatBtn = document.getElementById('toggle-chat-btn');
        if (toggleChatBtn) {
            toggleChatBtn.addEventListener('click', () => {
                // Scroll to the chat section
                const chatSection = document.querySelector('.chat-section');
                if (chatSection) {
                    chatSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Set up back button
        document.getElementById('back-button').addEventListener('click', () => {
            showMainView(mainView, detailView);
        });

        // Initialize chat
        const chatWrapper = document.getElementById('chat-wrapper');
        const movieIdSlug = formattedMovie.title.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        renderUsernamePrompt(chatWrapper, formattedMovie.title, movieIdSlug);

    } catch (error) {
        console.error('Error loading film details:', error);
        detailView.innerHTML = `
      <button id="back-button" class="back-button">
        <i class="fas fa-arrow-left"></i> Return to Movie List
      </button>
      <div class="error-container">
        <i class="fas fa-exclamation-triangle"></i>
        <h2>Error while loading film details</h2>
        <p>Please try again later</p>
        <p class="error-details">${error.message}</p>
      </div>
    `;

        document.getElementById('back-button').addEventListener('click', () => {
            showMainView(mainView, detailView);
        });
    }
    // Initialize actors carousel
    function initActorsCarousel() {
        const carousel = document.querySelector('.actors-carousel');
        if (!carousel) return;

        const inner = carousel.querySelector('.carousel-inner');
        const items = inner.querySelectorAll('.actor-item');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');

        let currentIndex = 0;
        const itemsPerSlide = 6; // 3 columns x 2 rows

        function showSlide(index) {
            // Hide all items
            items.forEach(item => {
                item.style.display = 'none';
            });

            // Show items for current slide
            const start = index * itemsPerSlide;
            const end = Math.min(start + itemsPerSlide, items.length);

            for (let i = start; i < end; i++) {
                if (items[i]) {
                    items[i].style.display = 'block';
                }
            }

            // Update button states
            prevBtn.disabled = index === 0;
            nextBtn.disabled = end >= items.length;
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                showSlide(currentIndex);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < Math.ceil(items.length / itemsPerSlide) - 1) {
                currentIndex++;
                showSlide(currentIndex);
            }
        });

        // Initialize first slide
        showSlide(currentIndex);
    }

// Call this after rendering the detail view
    initActorsCarousel();
}

// Function to render movie cards ( receives pre-paginated movies)
export async function renderMovies(movieList, movieGrid, mainView, detailView) {
    movieGrid.innerHTML = '';

    if (!movieList || movieList.length === 0) {
        movieGrid.innerHTML = `
      <p class="no-results">No films found</p>
    `;
        return;
    }

    const template = await loadTemplate('movie-card');
    if (!template) return;

    movieList.forEach(movie => {
        const html = template({
            id: movie.id,
            title: movie.title,
            year: movie.year,
            rating: movie.rating,
            description: movie.description,
            posterUrl: movie.posterUrl
        });
        movieGrid.insertAdjacentHTML('beforeend', html);
    });
}

/// ADVANCED SEARCH
export async function initSearch() {
    const searchType = document.getElementById("search-type");
    const searchInput = document.getElementById("search-input");
    const searchGenre = document.getElementById("search-genre");
    let genresList = ["Select a genre"];

    // Load genres from the API and populate the dropdown
    async function loadGenres() {
        try {
            let genres = await fetchAllGenres();
            genresList.push(...genres);
            populateGenreDropdown();
        } catch (error) {
            console.error("Error loading genres:", error);
        }
    }

    // Populate the genre dropdown with the fetched genres
    function populateGenreDropdown() {
        searchGenre.innerHTML = "";
        genresList.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            searchGenre.appendChild(option);
        });
    }

    // Handle search type change (e.g., show/hide input or genre dropdown)
    searchType.addEventListener("change", () => {
        const type = searchType.value;
        if (type === "GENRE") {
            searchInput.style.display = "none";
            searchGenre.style.display = "inline-block";
            populateGenreDropdown();
        } else {
            searchGenre.style.display = "none";
            searchInput.style.display = "inline-block";
        }
    });

    // Search button click event
    document.getElementById('search-button').addEventListener('click', () => {
        searchMovies(0);
    });

    await loadGenres();
}


/// PAGINATION ----------------------------

// Main function to display a page of movies with pagination controls
export function displayMoviePage(movieList, paginationContainer,movieGrid, currentPage, totalPages, mainView, detailView, onPageChange) {
    renderMovies(movieList, movieGrid, mainView, detailView);

    renderPagination(totalPages, paginationContainer, currentPage, onPageChange);
    window.scrollTo(0, 0);
}

// Improved pagination rendering
export function renderPagination( totalPages, paginationContainer, currentPage, onPageChange) {
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    const pagination = document.createElement('div');
    pagination.className = 'pagination';

    // Previous button
    if (currentPage > 1) {
        const prevButton = createPaginationButton('←', () => {
            // Convert to 0-indexed for backend
            onPageChange(currentPage - 2);
        });
        pagination.appendChild(prevButton);
    }

    // Always show first page
    const firstPageButton = createPaginationButton(1, () => {
        onPageChange(0);  // Page 0 for backend
    }, currentPage === 1);
    pagination.appendChild(firstPageButton);

    // Calculate page range to show
    let startPage = Math.max(2, currentPage - 3);
    let endPage = Math.min(totalPages - 1, currentPage + 3);

    // Show ellipsis if needed before middle pages
    if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'ellipsis';
        ellipsis.textContent = '…';
        pagination.appendChild(ellipsis);
    }

    // Middle pages (current page ±3)
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createPaginationButton(i, () => {
            onPageChange(i - 1);  // Convert to 0-indexed
        }, i === currentPage);
        pagination.appendChild(pageButton);
    }

    // Show ellipsis if needed after middle pages
    if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'ellipsis';
        ellipsis.textContent = '…';
        pagination.appendChild(ellipsis);
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
        const lastPageButton = createPaginationButton(totalPages, () => {
            onPageChange(totalPages - 1);  // Last page 0-indexed
        }, currentPage === totalPages);
        pagination.appendChild(lastPageButton);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = createPaginationButton('→', () => {
            onPageChange(currentPage);  // currentPage is 1-indexed, so next is same as current
        });
        pagination.appendChild(nextButton);
    }
    paginationContainer.appendChild(pagination);
}

function createPaginationButton(text, onClick, isActive = false) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    if (isActive) button.classList.add('active');
    return button;
}