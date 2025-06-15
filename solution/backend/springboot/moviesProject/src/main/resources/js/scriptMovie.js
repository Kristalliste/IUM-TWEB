

function searchMovies(page) {
    const type = document.getElementById("search-type").value;
    const query = document.getElementById("search-input").value;
    const size = parseInt(document.getElementById("page-size").value);

    axios.get(`http://localhost:8080/movies/search`, {
        params: {
            type,
            query,
            page,
            size
        }
    })
        .then(response => {
            displayResults(response.data.content);
            setupPagination(response.data.totalPages, page, size);
        })
        .catch(error => {
            console.error("Errore nella richiesta:", error);
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
        div.innerText = `${movie.title} (${movie.year})`;
        results.appendChild(div);
    });
}

function setupPagination(totalPages, currentPage, size) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i + 1;
        btn.onclick = () => searchMovies(i);
        if (i === currentPage) btn.disabled = true;
        pagination.appendChild(btn);
    }
}
