import { moviesPerPage } from './utils.js';
import { renderMovies } from './views.js';

// Main function to display a page of movies with pagination controls
export function displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView) {
    renderMovies(movieList, movieGrid, currentPage, mainView, detailView);
    renderPagination(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
    window.scrollTo(0, 0);
}

// Improve pagination rendering
export function renderPagination(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(movieList.length / moviesPerPage);
    if (totalPages <= 1) return;

    // Create pagination container
    const pagination = document.createElement('div');
    pagination.className = 'pagination';

    // Previous button
    if (currentPage > 1) {
        const prevButton = createPaginationButton('«', () => {
            currentPage--;
            displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
        });
        pagination.appendChild(prevButton);
    }

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createPaginationButton(i, () => {
            currentPage = i;
            displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
        }, i === currentPage);
        pagination.appendChild(pageButton);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = createPaginationButton('»', () => {
            currentPage++;
            displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
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