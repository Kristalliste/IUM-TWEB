

function searchMovies(page) {
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

    // Pulsante "Indietro"
    const prevButton = document.createElement("button");
    prevButton.innerText = "← Indietro";
    prevButton.disabled = currentPage === 0;
    prevButton.onclick = () => searchMovies(currentPage - 1);
    pagination.appendChild(prevButton);

    // Pulsanti numerici (opzionali, puoi tenerne solo alcuni o rimuoverli)
    for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i + 1;
        btn.onclick = () => searchMovies(i);
        if (i === currentPage) btn.disabled = true;
        pagination.appendChild(btn);
    }

    // Pulsante "Avanti"
    const nextButton = document.createElement("button");
    nextButton.innerText = "Avanti →";
    nextButton.disabled = currentPage === totalPages - 1;
    nextButton.onclick = () => searchMovies(currentPage + 1);
    pagination.appendChild(nextButton);
}

