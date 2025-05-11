const TMDB_API_KEY = 'ad5dacd91325524dbfd026abafa242a1';

const genreMap = {
  horror: 27,
  romantic: 10749,
  adventure: 12,
  comedy: 35
};

async function recommendMovies(category) {
  const genreId = genreMap[category];
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`
  );
  const data = await response.json();

  const slider = document.getElementById('movieSlider');
  slider.innerHTML = '';

  data.results.forEach(movie => {
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.className = 'movie-poster';
    img.alt = movie.title;
    img.onclick = () => {
      window.open('https://www.netflix.com/in/', '_blank');
    };
    slider.appendChild(img);
  });
}

// Auto-load adventure by default
recommendMovies('adventure');

// AI-style keyword search
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', function (e) {
  const value = e.target.value.toLowerCase();
  for (let key in genreMap) {
    if (value.includes(key)) {
      recommendMovies(key);
      break;
    }
  }
});
