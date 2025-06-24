import { renderMovies } from './views.js';

// Main function to display a page of movies with pagination controls
export function displayMoviePage(movieList, paginationContainer,movieGrid, currentPage, totalPages, mainView, detailView, onPageChange) {
    renderMovies(movieList, movieGrid, mainView, detailView);

    renderPagination(totalPages, paginationContainer, currentPage, onPageChange);
    window.scrollTo(0, 0);
}

// Improved pagination rendering
export function renderPagination(
    totalPages,  // Total pages from backend
    paginationContainer,
    currentPage,
    onPageChange  // Callback function (pageNumber: 0-indexed)
) {
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