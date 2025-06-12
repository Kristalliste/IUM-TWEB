document.addEventListener('DOMContentLoaded', () => {

    const movies = [
        {
            title: 'Le ali della libertà',
            year: 1994,
            rating: 9.3,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
            description: 'Due uomini imprigionati stringono un legame di amicizia lungo diversi anni, trovando conforto e, alla fine, redenzione attraverso atti di comune decenza.'
        },
        {
            title: 'Il Padrino',
            year: 1972,
            rating: 9.2,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
            description: 'Il patriarca di una dinastia del crimine organizzato trasferisce il controllo del suo impero clandestino al suo figlio riluttante.'
        },
        {
            title: 'Il Cavaliere Oscuro',
            year: 2008,
            rating: 9.0,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
            description: 'Quando la minaccia nota come Joker emerge dal suo passato misterioso, scatena il caos sulla gente di Gotham. Batman deve accettare una delle più grandi prove psicologiche e fisiche della sua capacità di combattere l\'ingiustizia.'
        },
        {
            title: 'Pulp Fiction',
            year: 1994,
            rating: 8.9,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
            description: 'Le vite di due sicari, un pugile, la moglie di un gangster e una coppia di rapinatori si intrecciano in quattro storie di violenza e redenzione.'
        },
        {
            title: 'Forrest Gump',
            year: 1994,
            rating: 8.8,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
            description: 'Le presidenze di Kennedy e Johnson, la guerra del Vietnam e altri eventi storici si dispiegano attraverso la prospettiva di un uomo dell\'Alabama con un QI di 75.'
        },
        {
            title: 'Inception',
            year: 2010,
            rating: 8.8,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
            description: 'Un ladro che ruba segreti aziendali attraverso l\'uso della tecnologia di condivisione dei sogni ha il compito inverso di piantare un\'idea nella mente di un C.E.O.'
        },
        {
            title: 'Matrix',
            year: 1999,
            rating: 8.7,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
            description: 'Un hacker scopre la scioccante verità sulla sua realtà e il suo ruolo nella guerra contro i suoi controllori.'
        },
        {
            title: 'Quei bravi ragazzi',
            year: 1990,
            rating: 8.7,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
            description: 'La storia di Henry Hill e della sua vita nella mafia, la sua relazione con sua moglie Karen Hill e i suoi soci mafiosi.'
        },
        {
            title: 'Parasite',
            year: 2019,
            rating: 8.5,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
            description: 'Avidità e discriminazione di classe minacciano la relazione simbiotica tra la ricca famiglia Park e l\'indigente famiglia Kim.'
        },
        {
            title: 'Interstellar',
            year: 2014,
            rating: 8.7,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
            description: 'Un team di esploratori viaggia attraverso un wormhole nello spazio nel tentativo di garantire la sopravvivenza dell\'umanità.'
        }
    ];

    const movieGrid = document.getElementById('movie-grid');
    const searchInput = document.getElementById('searchInput');

    function renderMovies(movieList) {
        movieGrid.innerHTML = '';
        if (movieList.length === 0) {
            movieGrid.innerHTML = `<p style="color: #888; grid-column: 1 / -1; text-align: center;">Nessun film trovato.</p>`;
            return;
        }

        movieList.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            
            movieCard.innerHTML = `
                <div class="movie-poster-container">
                    <img src="${movie.posterUrl}" alt="Locandina di ${movie.title}" loading="lazy">
                    <div class="movie-overlay">
                        <p class="movie-description">${movie.description}</p>
                    </div>
                </div>
                <div class="movie-info">
                    <h3>${movie.title} (${movie.year})</h3>
                    <div class="movie-rating">
                        <i class="fas fa-star icon-star"></i>
                        <span>${movie.rating.toFixed(1)}</span>
                    </div>
                </div>
            `;
            movieGrid.appendChild(movieCard);
        });
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm) || movie.year.toString().includes(searchTerm)
        );
        renderMovies(filteredMovies);
    });

    // Initial render
    renderMovies(movies);

});

