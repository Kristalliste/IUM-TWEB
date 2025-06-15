

function searchMovies(page) {
    showFilmLoader();
    const type = document.getElementById("search-type").value;
    const query = document.getElementById("search-input").value;
    const size = parseInt(document.getElementById("page-size").value);

    axios.get(`http://localhost:8080/api/movies/search/${type}/${encodeURIComponent(query)}/${page}/${size}`)
        .then(response => {
            console.log(response.data.content);
            displayResults(response.data.content);
            setupPagination(response.data.totalPages, page, size);
        })
        .catch(error => {
            console.error("Errore nella richiesta:", error);
        })
        .finally(() => {
            hideFilmLoader();
        });

}


function displayResults(movies) {
    const results = document.getElementById("results");
    results.innerHTML = "";

    if (movies.length === 0) {
        results.innerHTML = "<p>Nessun film trovato.</p>";
        return;
    }

    movies.forEach(movie => {
        const div = document.createElement("div");
        div.className = "movie";

        const newDate = new Date(movie.date);

        //(movie.rating == null ? "-": movie.rating) -> ternary operator = condiiton ? ifTrueExpression : ifFalseExpression
        div.innerText = movie.title + " " + newDate.getFullYear() + " " + movie.minute + " " +  (movie.rating == null ? "-": movie.rating);
        results.appendChild(div);
    });
}

function setupPagination(totalPages, currentPage, size) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const createButton = (text, disabled, onClick, isCurrent = false) => {
        const btn = document.createElement("button");
        btn.innerText = text;
        btn.disabled = disabled;
        if (onClick) btn.onclick = onClick;
        if (isCurrent) btn.style.fontWeight = "bold";
        return btn;
    };

    // ← Indietro
    pagination.appendChild(
        createButton("←", currentPage === 0, () => searchMovies(currentPage - 1))
    );

    const maxVisible = 5;
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxVisible - 1);
    } else if (currentPage >= totalPages - 3) {
        start = Math.max(0, totalPages - maxVisible);
    }

    // First page + ...
    if (start > 0) {
        pagination.appendChild(createButton("1", false, () => searchMovies(0)));
        if (start > 1) {
            const dots = document.createElement("span");
            dots.innerText = "…";
            dots.style.margin = "0 4px";
            pagination.appendChild(dots);
        }
    }

    // Middle buttons
    for (let i = start; i <= end; i++) {
        pagination.appendChild(
            createButton(i + 1, false, () => searchMovies(i), i === currentPage)
        );
    }

    // ... + Last page
    if (end < totalPages - 1) {
        if (end < totalPages - 2) {
            const dots = document.createElement("span");
            dots.innerText = "…";
            dots.style.margin = "0 4px";
            pagination.appendChild(dots);
        }
        pagination.appendChild(
            createButton(totalPages, false, () => searchMovies(totalPages - 1))
        );
    }

    // → Avanti
    pagination.appendChild(
        createButton("→", currentPage === totalPages - 1, () => searchMovies(currentPage + 1))
    );
}


