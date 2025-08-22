import { API_BASE_URL, debounce, moviesPerPage, formatMovieData } from './utils.js';
import { showMainView, showAdvancedSearch} from './views.js';
import { displayMoviePage } from './pagination.js';
import { renderUsernamePrompt, disconnectChat } from "./chat.js";
import { loadTemplate } from './templateLoader.js';

// DOM elements
const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('searchInput');
const mainView = document.querySelector('main');
const detailView = document.getElementById('movie-detail-view');
const logo = document.querySelector('.logo');
const paginationContainer = document.getElementById('pagination-container');
const mainTitle = document.getElementById('main-title');
const topRatedLink = document.getElementById('top-rated-link');
const advancedSearchLink = document.getElementById('advanced-search-link');
const navLinks = document.querySelectorAll('.main-nav ul > li > a');

// Chat elements
const toggleChatBtn = document.getElementById('toggle-chat-btn');
const floatingChat = document.getElementById('floating-chat');
const closeChatBtn = document.getElementById('close-chat-btn');
const floatingChatBody = document.getElementById('floating-chat-body');

// State
let currentPage = 1;
let currentView = 'recent'; // 'recent', 'top-rated', 'search'
let currentSearchTerm = '';
let totalPages = 1;

// Fetch movies from the API with pagination and type (recent, top-rated, etc.)
async function fetchMovies(type, page = 0, query = '') {
    try {
        let url = `${API_BASE_URL}/movies`;
        const params = new URLSearchParams({
            page,
            size: moviesPerPage
        });

        params.append('type', type);

        const response = await axios.get(`${API_BASE_URL}/movies`, { params });
        const data = response.data;

        // If response is an array (for recent movies)
        if (Array.isArray(data)) {
            return {
                content: data,
                totalPages: Math.ceil(data.length / moviesPerPage),
                totalElements: data.length
            };
        }
        // If response is paginated object
        else if (data.content) {
            return data;
        }
        // Fallback for unexpected formats
        return { content: [], totalPages: 1, totalElements: 0 };
    } catch (error) {
        console.error(`Error fetching ${type} movies:`, error);
        return { content: [], totalPages: 1, totalElements: 0 };
    }
}

// Loads and displays a page of movies in the grid
async function loadAndDisplayMoviesPage(page = 0) {
    currentPage = page + 1;     // Converts into 1-indexed per UI
    let data;
    console.log('Fetching movies page...');
    if (currentView === 'search') {
        data = await loadFilteredByTitleMovies(page);
    } else {
        data = await fetchMovies(currentView, page);
    }

    const formattedMovies = data.content.map(movie => formatMovieData(movie));
    totalPages = data.totalPages;

    // Callback to change page
    displayMoviePage(
        formattedMovies,
        paginationContainer,
        movieGrid,
        currentPage,
        totalPages,
        mainView,
        detailView,
        (pageIndex) => {
            loadAndDisplayMoviesPage(pageIndex);
        }
    );
}

// Fetch movies filtered by title, with pagination
async function loadFilteredByTitleMovies(page = 0) {
    try {
        const title = document.getElementById("searchInput").value;
       // if(title == null || title === "") { return; }
        if (!title) return { content: [], totalPages: 1, totalElements: 0 };

        // URL-encode the title for use in the path
        const encodedTitle = encodeURIComponent(title);
        const response = await axios.get(
            `${API_BASE_URL}/filteredMovies/${encodedTitle}`,
            {
                params: {
                    page,
                    size: moviesPerPage
                }
            }
        );

        const data = response.data;

        // If response is an array
        if (Array.isArray(data)) {
            return {
                content: data,
                totalPages: Math.ceil(data.length / moviesPerPage),
                totalElements: data.length
            };
        }
        else if (data.content) {    // If response is paginated object
            return data;
        }
        return { content: [], totalPages: 1, totalElements: 0 };    // Fallback for unexpected formats
    } catch (error) {
        console.error('Error fetching filtered movies:', error);
        return { content: [], totalPages: 1, totalElements: 0, error: error.message };
    }
}

// Set the active navigation link in the UI
function setActiveLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Event Listeners
topRatedLink.addEventListener('click', async (e) => {
    e.preventDefault();
    showMainView(mainView, detailView);
    searchInput.value = '';

    currentView = 'top-rated';
    currentPage = 1;
    mainTitle.textContent = 'Film Top Rated';
    setActiveLink(topRatedLink);

    await loadAndDisplayMoviesPage(0);
});

searchInput.addEventListener('input', debounce(async (e) => {
    showMainView(mainView, detailView);
    setActiveLink(null);

    /*let filteredMovies = await loadFilteredByTitleMovies();
    if(!filteredMovies) {
        console.error('Could not find movie list');
        return;
    }
    currentView = 'search';
    currentPage = 1;*/
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm) {
        currentView = 'search';
        currentPage = 1;
        mainTitle.textContent = `Results for: "${searchTerm}"`;
        await loadAndDisplayMoviesPage(0);
    } else {
        currentView = 'recent';
        mainTitle.textContent = 'Most Recent Films';
        await loadAndDisplayMoviesPage(0);
    }
}, 300));

logo.addEventListener('click', async () => {
    searchInput.value = '';
    currentView = 'recent';
    currentPage = 1;
    showMainView(mainView, detailView);
    mainTitle.textContent = 'Most Recent Films';
    setActiveLink(null);  // Clear active states
    await loadAndDisplayMoviesPage(0);
});

advancedSearchLink.addEventListener('click', async (e) => {
    e.preventDefault();
    setActiveLink(advancedSearchLink);  // Set this link as active
    await showAdvancedSearch(mainView, detailView);
});

// Chat event listeners
toggleChatBtn.addEventListener('click', () => {
    // If we're in the details view, don't show the main chat
    if (detailView.style.display === 'block') {
        const chatSection = document.querySelector('.chat-section');
        if (chatSection) {
            chatSection.scrollIntoView({ behavior: 'smooth' });
        }
        return;
    }

    // Otherwise, show/hide the main chat
    floatingChat.classList.toggle('hidden');
    if (!floatingChat.classList.contains('hidden')) {
        renderUsernamePrompt(floatingChatBody, 'Main', 1);
    } else {
        disconnectChat();
    }
});

closeChatBtn.addEventListener('click', () => {
    floatingChat.classList.add('hidden');
    disconnectChat(); // Disconnect when closing the chat
});

// App initialization: preload templates and load the first page
async function init() {
    try {
        // Preload templates if needed
        await Promise.all([
            loadTemplate('movie-card'),
            loadTemplate('modal-template'),
            loadTemplate('movie-detail'),
            loadTemplate('advanced-search'),
        ]);

        movieGrid.innerHTML = '<p class="loading">Loading Films...</p>';

        const urlParams = new URLSearchParams(window.location.search);
        const requestedView = urlParams.get('view');
        currentPage = 1;    // Always resets pagination
        const initialData = await fetchMovies('recent', 0);

        showMainView(mainView, detailView);
        await loadAndDisplayMoviesPage(0);
    } catch (error) {
        console.error('Initialization error:', error);
        movieGrid.innerHTML = `
            <div class="error" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Errore durante il caricamento</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Update your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // No need to make this async since init is already async
    init().catch(error => {
        console.error('Unhandled initialization error:', error);
    });
});