let pokemons = [];
let previousURL = "";
let nextURL = "";

const pokemonsGrid = document.querySelector(".pokemons_grid");
const searchGrid = document.querySelector(".pokemon_search_grid");

const fetchData = () => {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=100")
    .then((response) => response.json())
    .then((json) => {
      const { next: nextURL, previous: previousURL, results: fetchedPokemons } = json;
      pokemons.push(...fetchedPokemons);
      displayPokemons(pokemons);
    })
    .catch((error) => console.log(`Error: ${error.message}`));
};

const displayPokemons = (data) => {
  pokemonsGrid.innerHTML = "";
  for (let pokemon of data) {
    const div = document.createElement("div");
    const h3 = document.createElement("h3");

    h3.textContent = pokemon.name;
    div.appendChild(h3);
    pokemonsGrid.appendChild(div);
  }
};

const searchPokemon = (e) => {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=1400")
    .then((response) => response.json())
    .then((json) => {
      const term = e.target.value.toLowerCase();
      const filtered = json.results.filter((pokemon) => pokemon.name.toLowerCase().includes(term));
      displayPokemons(filtered);
    })
    .catch((error) => console.log(`Error: ${error.message}`));
};

fetchData();

document.querySelector("#search_input").addEventListener("input", searchPokemon);
