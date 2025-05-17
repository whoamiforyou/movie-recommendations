const TMDB_API_KEY = 'ad5dacd91325524dbfd026abafa242a1';

const genreMap = {
  horror: 27,
  romantic: 10749,
  adventure: 12,
  comedy: 35,
  'sci-fi': 878,
  thriller: 53,
  animation: 16,
  action: 28,
  mystery: 9648,
  drama: 18
};

async function recommendMovies(category) {
  const genreId = genreMap[category.toLowerCase()];
  if (!genreId) return;

  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`
  );
  const data = await response.json();
  displayMovies(data.results);
}

async function searchMovieByTitle(query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    displayMovies(data.results);
  } else {
    document.getElementById('movieSlider').innerHTML = `<p style="color: #aaa;">No results found for "${query}".</p>`;
  }
}

function displayMovies(movies) {
  const slider = document.getElementById('movieSlider');
  slider.innerHTML = '';

  movies.forEach(movie => {
    if (!movie.poster_path) return;
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.className = 'movie-poster';
    img.alt = movie.title;
    img.title = movie.title;
    img.onclick = () => {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(movie.title)} movie`, '_blank');
    };
    slider.appendChild(img);
  });
}

function scrollSlider(direction) {
  const slider = document.getElementById('movieSlider');
  slider.scrollBy({
    left: direction * 300,
    behavior: 'smooth'
  });
}

// 🔁 Faster auto-scroll + reverse + pause on hover
let direction = 1;
let scrollCounter = 0;
let autoScrollInterval;

function startAutoScroll() {
  const slider = document.getElementById('movieSlider');
  autoScrollInterval = setInterval(() => {
    slider.scrollBy({
      left: direction * 100, // 👈 faster scroll
      behavior: 'smooth'
    });

    scrollCounter++;
    if (scrollCounter >= 15) {
      direction *= -1;
      scrollCounter = 0;
    }
  }, 500); // 👈 move every 0.5s
}

function stopAutoScroll() {
  clearInterval(autoScrollInterval);
}

document.getElementById('sliderContainer').addEventListener('mouseenter', stopAutoScroll);
document.getElementById('sliderContainer').addEventListener('mouseleave', startAutoScroll);

// Initial genre load
recommendMovies('adventure');
startAutoScroll();

// Smart search
document.getElementById('searchBar').addEventListener('input', function (e) {
  const value = e.target.value.trim().toLowerCase();

  if (genreMap[value]) {
    recommendMovies(value);
  } else if (value.length > 2) {
    searchMovieByTitle(value);
  }
});

