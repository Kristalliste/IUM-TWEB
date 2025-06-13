document.addEventListener('DOMContentLoaded', () => {

    const movies = [
        {
            title: 'Le ali della libertà',
            year: 1994,
            rating: 9.3,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
            description: 'Due uomini imprigionati stringono un legame di amicizia lungo diversi anni, trovando conforto e, alla fine, redenzione attraverso atti di comune decenza.',
            actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
            reviews: [
                { user: 'Cinefilo88', comment: 'Un capolavoro assoluto, toccante e potente.' },
                { user: 'MovieFan_91', comment: 'La migliore performance di Morgan Freeman.' }
            ]
        },
        {
            title: 'Il Padrino',
            year: 1972,
            rating: 9.2,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
            description: 'Il patriarca di una dinastia del crimine organizzato trasferisce il controllo del suo impero clandestino al suo figlio riluttante.',
            actors: ['Marlon Brando', 'Al Pacino', 'James Caan'],
            reviews: [
                { user: 'DonCorleone', comment: 'Un\'offerta che non si può rifiutare.' },
                { user: 'FilmBuff', comment: 'La regia di Coppola è magistrale.' }
            ]
        },
        {
            title: 'Il Cavaliere Oscuro',
            year: 2008,
            rating: 9.0,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
            description: 'Quando la minaccia nota come Joker emerge dal suo passato misterioso, scatena il caos sulla gente di Gotham. Batman deve accettare una delle più grandi prove psicologiche e fisiche della sua capacità di combattere l\'ingiustizia.',
            actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
            reviews: [
                { user: 'JokerFan', comment: 'Heath Ledger era nato per questa parte. Iconico.' },
                { user: 'GothamGirl', comment: 'Ancora mi vengono i brividi. Il miglior film di supereroi di sempre.' }
            ]
        },
        {
            title: 'Pulp Fiction',
            year: 1994,
            rating: 8.9,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
            description: 'Le vite di due sicari, un pugile, la moglie di un gangster e una coppia di rapinatori si intrecciano in quattro storie di violenza e redenzione.',
            actors: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
            reviews: [
                { user: 'TarantinoFan', comment: 'Dialoghi geniali e struttura narrativa rivoluzionaria.' }
            ]
        },
        {
            title: 'Forrest Gump',
            year: 1994,
            rating: 8.8,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
            description: 'Le presidenze di Kennedy e Johnson, la guerra del Vietnam e altri eventi storici si dispiegano attraverso la prospettiva di un uomo dell\'Alabama con un QI di 75.',
            actors: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
            reviews: [
                { user: 'BoxOfChocolates', comment: 'La vita è come una scatola di cioccolatini...' }
            ]
        },
        {
            title: 'Inception',
            year: 2010,
            rating: 8.8,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
            description: 'Un ladro che ruba segreti aziendali attraverso l\'uso della tecnologia di condivisione dei sogni ha il compito inverso di piantare un\'idea nella mente di un C.E.O.',
            actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
            reviews: [
                { user: 'Dreamer', comment: 'Mind-bending! Ho dovuto vederlo due volte per capirlo appieno.' },
                { user: 'NolanIsGod', comment: 'Christopher Nolan non sbaglia un colpo.' }
            ]
        },
        {
            title: 'Matrix',
            year: 1999,
            rating: 8.7,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
            description: 'Un hacker scopre la scioccante verità sulla sua realtà e il suo ruolo nella guerra contro i suoi controllori.',
            actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
            reviews: [
                { user: 'TheOne', comment: 'Ha cambiato il cinema di fantascienza per sempre.' }
            ]
        },
        {
            title: 'Quei bravi ragazzi',
            year: 1990,
            rating: 8.7,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
            description: 'La storia di Henry Hill e della sua vita nella mafia, la sua relazione con sua moglie Karen Hill e i suoi soci mafiosi.',
            actors: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'],
            reviews: [
                { user: 'ScorseseFan', comment: 'Veloce, stiloso e brutalmente onesto. Un capolavoro del genere gangster.' }
            ]
        },
        {
            title: 'Parasite',
            year: 2019,
            rating: 8.5,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
            description: 'Avidità e discriminazione di classe minacciano la relazione simbiotica tra la ricca famiglia Park e l\'indigente famiglia Kim.',
            actors: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
            reviews: []
        },
        {
            title: 'Interstellar',
            year: 2014,
            rating: 8.7,
            posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
            description: 'Un team di esploratori viaggia attraverso un wormhole nello spazio nel tentativo di garantire la sopravvivenza dell\'umanità.',
            actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
            reviews: [
                { user: 'SpaceExplorer', comment: 'Visivamente sbalorditivo e con una colonna sonora da pelle d\'oca.' }
            ]
        }
    ];

    const movieGrid = document.getElementById('movie-grid');
    const searchInput = document.getElementById('searchInput');
    const mainView = document.querySelector('main');
    const detailView = document.getElementById('movie-detail-view');
    const logo = document.querySelector('.logo');

    function showMainView() {
        mainView.style.display = 'block';
        detailView.style.display = 'none';
        detailView.innerHTML = ''; // Clear content to avoid state issues
    }

    function showDetailView(movie) {
        mainView.style.display = 'none';
        detailView.style.display = 'block';
        window.scrollTo(0, 0);

        detailView.innerHTML = `
            <button id="back-button" class="back-button"><i class="fas fa-arrow-left"></i> Torna alla lista</button>
            <div class="detail-grid">
                <div class="detail-poster">
                    <img src="${movie.posterUrl}" alt="Locandina di ${movie.title}">
                </div>
                <div class="detail-info">
                    <h1>${movie.title} <span class="year">(${movie.year})</span></h1>
                    <div class="detail-rating">
                        <i class="fas fa-star icon-star"></i>
                        <span>${movie.rating.toFixed(1)}</span>
                    </div>
                    <p class="description">${movie.description}</p>
                    
                    <h3>Cast & Crew</h3>
                    <ul class="actors-list">
                        ${movie.actors.map(actor => `<li>${actor}</li>`).join('')}
                    </ul>
                </div>
            </div>
    
            <div class="detail-sections">
                <div class="reviews-section">
                    <h2>Recensioni</h2>
                    <div id="reviews-list" class="reviews-list">
                        ${movie.reviews.length > 0 ? movie.reviews.map(review => `
                            <div class="review-item">
                                <p><strong>${review.user}</strong></p>
                                <p>"${escapeHTML(review.comment)}"</p>
                            </div>
                        `).join('') : '<p>Nessuna recensione ancora.</p>'}
                    </div>
                </div>
    
                <div class="chat-section">
                    <h2>Chat Live</h2>
                    <div id="chat-messages" class="chat-messages">
                        <p class="chat-system">Benvenuto nella chat per "${movie.title}"!</p>
                    </div>
                    <div class="chat-input-area">
                        <input type="text" id="chat-input" placeholder="Scrivi un messaggio...">
                        <button id="send-chat-btn">Invia</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('back-button').addEventListener('click', showMainView);

        const sendBtn = document.getElementById('send-chat-btn');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        const handleSendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                const messageEl = document.createElement('p');
                messageEl.innerHTML = `<strong>Tu:</strong> ${escapeHTML(message)}`;
                chatMessages.appendChild(messageEl);
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        };

        sendBtn.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, function(match) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[match];
        });
    }

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
            movieCard.addEventListener('click', () => showDetailView(movie));
            movieGrid.appendChild(movieCard);
        });
    }

    searchInput.addEventListener('input', (e) => {
        // If we are on the detail page, switch back to the main view first.
        if (mainView.style.display === 'none') {
            showMainView();
        }
        const searchTerm = e.target.value.toLowerCase().trim();
        const filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) || movie.year.toString().includes(searchTerm)
        );
        renderMovies(filteredMovies);
    });

    logo.addEventListener('click', () => {
        searchInput.value = '';
        showMainView();
        renderMovies(movies);
    });

    // Initial render
    renderMovies(movies);
    showMainView();

});

