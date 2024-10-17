let movies = [];
const moviesPerPage = 30;
let currentPage = 1;
let totalPages = 1;

fetch('movies.json')
    .then(response => response.json())
    .then(data => {
        movies = data;
        displayMovies(movies);
        populateGenres();
    })
    .catch(error => console.error('Error fetching movie data:', error));

function displayMovies(moviesToDisplay) {
    const moviesContainer = document.getElementById('movies-container');
    const paginationContainer = document.getElementById('pagination');
    moviesContainer.innerHTML = '';
    paginationContainer.innerHTML = '';

    if (moviesToDisplay.length === 0) {
        moviesContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    totalPages = Math.ceil(moviesToDisplay.length / moviesPerPage);
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const paginatedMovies = moviesToDisplay.slice(start, end);

    paginatedMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        movieCard.innerHTML = `
            <img src="posters/${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="description-overlay">
                <div class="description-text">${movie.plot}</div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title} (${movie.year})</h3>
                <p class="movie-details">⭐ ${movie.rating} | ${movie.runtime} min</p>
                <div class="genres">
                    ${movie.genres.map(genre => `<span class="genre">${genre}</span>`).join('')}
                </div>
            </div>
        `;


        moviesContainer.appendChild(movieCard);
    });

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        if (i === currentPage) pageBtn.classList.add('active');
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            displayMovies(moviesToDisplay);
        });
        paginationContainer.appendChild(pageBtn);
    }
}

const randomBtn = document.getElementById('random-btn');
const randomModal = document.getElementById('modal');
const randomCloseButton = randomModal.querySelector('.close-button');
const randomMovieDiv = document.getElementById('random-movie');

randomBtn.addEventListener('click', () => {
    if (movies.length === 0) {
        alert('No movies available for recommendation.');
        return;
    }
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    displayRandomMovie(randomMovie);
    randomModal.style.display = 'block';
    randomModal.setAttribute('aria-hidden', 'false'); 
});

randomCloseButton.addEventListener('click', () => {
    randomModal.style.display = 'none';
    randomModal.setAttribute('aria-hidden', 'true'); 
});

window.addEventListener('click', (event) => {
    if (event.target == randomModal) {
        randomModal.style.display = 'none';
        randomModal.setAttribute('aria-hidden', 'true'); 
    }
});

function displayRandomMovie(movie) {
    randomMovieDiv.innerHTML = `
        <img src="posters/${movie.poster}" alt="${movie.title}">
        <div class="movie-details-modal">
            <h2>${movie.title} (${movie.year})</h2>
            <p>⭐ ${movie.rating} / 10</p>
            <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
            <p><strong>Genres:</strong> ${movie.genres.join(', ')}</p>
            <p><strong>Descr:</strong> ${movie.plot}</p>
            <p><strong>Cast:</strong> ${movie.cast.join(', ')}</p>
            <p><strong>Metascore:</strong> ${movie.metascore}</p>
        </div>
    `;
}

const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchTerm));
    currentPage = 1;
    displayMovies(filteredMovies);
});

const genreFilter = document.getElementById('genre-filter');

function populateGenres() {
    const genres = new Set();
    movies.forEach(movie => {
        movie.genres.forEach(genre => genres.add(genre));
    });

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

genreFilter.addEventListener('change', (e) => {
    const selectedGenre = e.target.value;
    if (selectedGenre === 'All') {
        displayMovies(movies);
    } else {
        const filteredMovies = movies.filter(movie => movie.genres.includes(selectedGenre));
        currentPage = 1;
        displayMovies(filteredMovies);
    }
});

const hamburger = document.querySelector('.hamburger');
const navUl = document.querySelector('nav ul');

hamburger.addEventListener('click', () => {
    navUl.classList.toggle('active');
});

const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️';
    } else {
        darkModeToggle.textContent = '🌙';
    }
});
