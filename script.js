const CONFIG = {
    urlAPI: {
        popular: 'https://api.themoviedb.org/3/movie/popular',
        topRated: 'https://api.themoviedb.org/3/movie/top_rated',
        upcoming: 'https://api.themoviedb.org/3/movie/upcoming',
        discover: 'https://api.themoviedb.org/3/discover/movie'
    },
    urlImages: 'https://image.tmdb.org/t/p/w500',
    cleAPI: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjI1ZTgwMGVjNGE0YTFkZWU0N2QzNDY0M2MxZWZmNiIsIm5iZiI6MTczNDM1NTI5Mi45NzQwMDAyLCJzdWIiOiI2NzYwMjk1Y2FjYTM1NDllNTRmNjcxYmMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.EG2ty48MQF_7e_It-2hS9ldOJIPZzCqk6CJBdRc5RM8'
};

function creerCarteFilm(film) {
    let carte = document.createElement('div');
    carte.classList = 'movie-card';

    let image = document.createElement('div');
    image.classList = 'movie-image';

    if (film.poster_path) {
        image.style.backgroundImage = `url(${CONFIG.urlImages}${film.poster_path})`;
    } else {
        image.classList.add('no-image');
    }

    let titre = document.createElement('h3');
    titre.classList = 'movie-title';
    titre.textContent = film.title;

    let note = document.createElement('p');
    note.classList = 'movie-rating';
    note.textContent = `⭐ ${film.vote_average.toFixed(1)} / 10`;

    carte.append(image, titre, note);
    return carte;
}

async function chargerFilms(url, params = {}) {
    let fullUrl = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
        fullUrl.searchParams.set(key, value);
    });

    try {
        let response = await fetch(fullUrl, {
            headers: {
                accept: 'application/json',
                Authorization: CONFIG.cleAPI
            }
        });

        let data = await response.json();
        return data.results.slice(0, 15);
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function remplirCarousel(carousel, films) {
    carousel.innerHTML = '';
    films.forEach(film => {
        let carte = creerCarteFilm(film);
        carousel.appendChild(carte);
    });
}

function initialiserBoutonsCarousel(conteneur) {
    let carousel = conteneur.querySelector('.movie-carousel');
    let prev = conteneur.querySelector('.prev');
    let next = conteneur.querySelector('.next');

    if (prev) {
        prev.addEventListener('click', () => {
            carousel.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }

    if (next) {
        next.addEventListener('click', () => {
            carousel.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    
}

async function initialiserCollection(collection) {
    let carousel = collection.querySelector('.movie-carousel');
    let type = carousel.dataset.type;
    let genre = carousel.dataset.genre;
    let endpoint = genre ? CONFIG.urlAPI.discover : CONFIG.urlAPI[type] || CONFIG.urlAPI.popular;
    let params = genre ? { with_genres: genre } : {};

    let films = await chargerFilms(endpoint, params);
    await remplirCarousel(carousel, films);
    initialiserBoutonsCarousel(collection.querySelector('.carousel-container'));
}

document.addEventListener('DOMContentLoaded', async () => {
    let collections = document.querySelectorAll('.collection');
    for (let collection of collections) {
        await initialiserCollection(collection);
    }
});
