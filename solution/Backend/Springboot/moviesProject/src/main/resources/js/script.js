/* function filtraPersone() {
    const prefix = document.getElementById("nomeInput").value;

    fetch(`http://localhost:8080/api/actors/filterByName?prefix=${encodeURIComponent(prefix)}`)
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById("listaPersone");
            lista.innerHTML = ""; // Pulisce la lista

            data.forEach(persona => {
                const item = document.createElement("li");
                item.textContent = persona.nome;
                lista.appendChild(item);
            });
        })
        .catch(error => console.error("Errore:", error));
} */

function filtraPersone() {
    const prefix = document.getElementById("nomeInput").value;

    axios.get(`http://localhost:8080/api/actors/filterByName/${encodeURIComponent(prefix)}`)
        .then(response => {
            const lista = document.getElementById("listaPersone");
            lista.innerHTML = ""; // Pulisce la lista

            response.data.forEach(persona => {
                console.log(persona);
                const item = document.createElement("li");
                item.textContent = persona.nome;
                lista.appendChild(item);
            });
        })
        .catch(error => {
            console.error("Errore:", error);
        });
}

document.getElementById('loadActorBtn').addEventListener('click', () => {
    fetch('http://localhost:8080/api/actors/random')
        .then(response => {
            if (!response.ok) {
                throw new Error('Nessun attore trovato');
            }
            return response.json();
        })
        .then(actor => {
            addActorToTable(actor);
        })
        .catch(err => {
            alert(err.message);
        });
});

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
