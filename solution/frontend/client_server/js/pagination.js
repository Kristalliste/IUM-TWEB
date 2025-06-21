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

    const pagination = document.createElement('div');
    pagination.className = 'pagination';

    // Previous button
    if (currentPage > 1) {
        const prevButton = createPaginationButton('←', () => {
            currentPage--;
            displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
        });
        pagination.appendChild(prevButton);
    }

    // Always show first page
    const firstPageButton = createPaginationButton(1, () => {
        currentPage = 1;
        displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
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
            currentPage = i;
            displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
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
            currentPage = totalPages;
            displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
        }, currentPage === totalPages);
        pagination.appendChild(lastPageButton);
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = createPaginationButton('→', () => {
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