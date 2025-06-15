
function filtraPersone() {
    const prefix = document.getElementById("nomeInput").value;

    axios.get(`http://localhost:8080/api/actors/filterByName/${encodeURIComponent(prefix)}`)
        .then(response => {
            const lista = document.getElementById("listaPersone");
            lista.innerHTML = ""; // Pulisce la lista

            response.data.forEach(persona => {
                console.log(persona.role);
                const item = document.createElement("li");
                item.textContent = persona.name;
                lista.appendChild(item);
            });
        })
        .catch(error => {
            console.error("Errore:", error);
        });
}


//Sarà utile dopo
function addActorToTable(actor) {
    const tbody = document.querySelector('#actorsTable tbody');
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${actor.actorId}</td>
        <td>${actor.movieId}</td>
        <td>${actor.name}</td>
        <td>${actor.role}</td>
    `;

    tbody.appendChild(tr);
}





let paginaCorrente = 0;
const dimensionePagina = 10;
let nomeAttuale = "";

function cerca() {
    nomeAttuale = document.getElementById("nomeInputPaged").value;
    paginaCorrente = 0;
    caricaPagina();
}

function caricaPagina() {
    showFilmLoader();
    axios.get("http://localhost:8080/api/actors/paged", {
        params: {
            name: nomeAttuale,
            page: paginaCorrente,
            size: dimensionePagina
        }
    })
        .then(response => {
            const data = response.data;
            const lista = document.getElementById("listaAttori");
            lista.innerHTML = "";

            data.content.forEach(actor => {
                const item = document.createElement("li");
                item.textContent = actor.name;
                lista.appendChild(item);
            });

            // Abilita/disabilita i pulsanti
            document.getElementById("prevBtn").disabled = data.first;
            document.getElementById("nextBtn").disabled = data.last;
        })
        .catch(error => {
            console.error("Errore nella richiesta:", error);
        })
        .finally(() => {
            hideFilmLoader();
        });
}

function paginaSuccessiva() {
    paginaCorrente++;
    caricaPagina();
}

function paginaPrecedente() {
    if (paginaCorrente > 0) {
        paginaCorrente--;
        caricaPagina();
    }
}

function getMovieTitles() {
    const actorName = document.getElementById("nomeInputPagedforMovieName").value;

    axios.get(`http://localhost:8080/api/actors/movieTitlesByActorName/${actorName}`)
        .then(response => {
            const lista = document.getElementById("listaFilm");
            lista.innerHTML = "";

            response.data.forEach(title => {
                console.log(title);
                const item = document.createElement("li");
                item.textContent = `🎬 ${toCamelCase(title)}`;
                lista.appendChild(item);
            });
        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Attore non trovato o nessun film associato.");
        });
}

function toCamelCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function getActorById() {
    const actorId = document.getElementById("actorId").value;

    axios.get(`http://localhost:8080/api/actors/findActorById/${actorId}`)
        .then(response => {

            console.log(response.data.actorId + " " + response.data.name);

        })
        .catch(error => {
            console.error("Errore:", error);
            alert("Attore non trovato.");
        });
}