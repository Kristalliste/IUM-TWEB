import { moviesPerPage } from './utils.js';
import { renderMovies } from './views.js';

export function displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView) {
    renderMovies(movieList, movieGrid, currentPage, mainView, detailView);
    renderPagination(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
    window.scrollTo(0, 0);
}

export function renderPagination(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(movieList.length / moviesPerPage);

    if (totalPages <= 1) return;

    const prevButton = document.createElement('button');
    prevButton.innerHTML = `&laquo; Prec`;
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage--;
        displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerHTML = `Succ &raquo;`;
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        currentPage++;
        displayMoviePage(movieList, paginationContainer, movieGrid, currentPage, mainView, detailView);
    });
    paginationContainer.appendChild(nextButton);
}

