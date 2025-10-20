document.addEventListener("DOMContentLoaded", () => {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=50&offset=0";
    const pokemonList = document.getElementById("lista-pokemon");
  
    const getPokemonDetails = pokemon =>
      fetch(pokemon.url).then(response => response.json());
  
    fetch(url)
      .then(response => response.json())
      .then(data => Promise.all(data.results.map(getPokemonDetails)))
      .then(pokemonDetails => {
        pokemonList.innerHTML = pokemonDetails.map(pokemon => `
          <li class="pokemon ${pokemon.types[0].type.name}">
            <p class="nome">${pokemon.name}</p>
            <img src="${pokemon.sprites.other['dream_world'].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}">
          </li>
        `).join('');
      })
      .catch(error => {
        console.error("Erro ao carregar pokemons:", error);
        pokemonList.innerHTML = '<li>Erro ao carregar pokémons</li>';
      });
  });
  