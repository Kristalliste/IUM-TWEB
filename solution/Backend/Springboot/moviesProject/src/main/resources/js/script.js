function filtraPersone() {
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
}
