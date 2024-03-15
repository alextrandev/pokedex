let pokemons = [];
let previousURL = "";
let nextURL = "";

const pokemonsGrid = document.querySelector(".pokemons_grid");
const searchGrid = document.querySelector(".pokemon_search_grid");
const favoritesGrid = document.querySelector(".favorites_grid");

const fetchPokedex = () => {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=1500")
    .then((res) => res.json())
    .then((json) => {
      const fetches = json.results.map((pokemon) => {
        return fetch(pokemon.url).then((res) => res.json());
      });
      Promise.all(fetches).then((data) => {
        pokemons = data;
        displayPokemons(pokemons, pokemonsGrid);
      });
    })
    .catch((error) => console.log(`Error: ${error.message}`));
};

const toggleInfo = (img, infoDiv, pokemon) => {
  const { weight: weight, height: height, types: types, abilities: abilities } = pokemon;
  let [typeArr, abilityArr] = [[], []];

  types.forEach((type) => typeArr.push(type.type.name));
  abilities.forEach((ability) => abilityArr.push(ability.ability.name.replace("-", " ")));

  infoDiv.innerHTML = `
  <p><b>Weight</b>: ${weight / 10} kg</p>
  <p><b>Height</b>: ${height / 10} m</p>
  <p><b>Types</b>: ${typeArr.join(", ")}</p>
  <p><b>Abilities</b>: ${abilityArr.join(", ")}</p>`;

  img.classList.toggle("blur");
  infoDiv.classList.toggle("hidden");
};

const displayPokemons = (pokemons, location) => {
  pokemonsGrid.innerHTML = searchGrid.innerHTML = favoritesGrid.innerHTML = "";
  for (let pokemon of pokemons) {
    const div = location.appendChild(document.createElement("div"));
    const img = div.appendChild(document.createElement("img"));
    const infoDiv = div.appendChild(document.createElement("info"));
    const h3 = div.appendChild(document.createElement("h3"));
    const star = div.appendChild(document.createElement("i"));

    div.id = `div_${pokemon.name}`;
    img.src = pokemon.sprites.other.dream_world.front_default ?? pokemon.sprites.front_default ?? "assets/Poke_Ball.webp";
    infoDiv.classList.add("hidden");
    h3.textContent = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    star.className = localStorage.getItem(pokemon.name) === "true" ? "fa-solid fa-star" : "fa-regular fa-star";
    star.id = pokemon.name;

    star.addEventListener("click", toggleFavorites);
    div.addEventListener("click", () => toggleInfo(img, infoDiv, pokemon));
  }
};

const toggleFavorites = (e) => {
  const pokemonName = e.target.id;
  const isFavorites = localStorage.getItem(pokemonName) === "true";
  localStorage.setItem(pokemonName, !isFavorites);
  isFavorites ? (e.target.className = "fa-regular fa-star") : (e.target.className = "fa-solid fa-star");
  document.querySelector(`.favorites_grid #div_${pokemonName}`)?.remove();
};

// prettier-ignore
const displayFavorite = () => displayPokemons(pokemons.filter((pokemon) => localStorage.getItem(pokemon.name) === "true"), favoritesGrid);

const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

// prettier-ignore
const searchPokemon = debounce((e) => displayPokemons(pokemons.filter((pokemon) => pokemon.name.includes(e.target.value.toLowerCase())), searchGrid), 300);

fetchPokedex();

document.querySelector("#search_input").addEventListener("input", searchPokemon);
document.querySelector("#show_all").addEventListener("click", () => displayPokemons(pokemons, pokemonsGrid));
document.querySelector("#show_favorites").addEventListener("click", displayFavorite);
