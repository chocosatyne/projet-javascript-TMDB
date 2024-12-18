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
    const carte = document.createElement('div');
    carte.className = 'movie-card';

    const image = document.createElement('div');
    image.className = 'movie-image';
    
    if (film.poster_path) {
        image.style.backgroundImage = `url(${CONFIG.urlImages}${film.poster_path})`;
    } else {
        image.classList.add('no-image');
    }

    const titre = document.createElement('h3');
    titre.className = 'movie-title';
    titre.textContent = film.title.length > 30 ? film.title.slice(0, 27) + '...' : film.title;
    titre.title = film.title;

    const note = document.createElement('p');
    note.className = 'movie-rating';
    note.textContent = `⭐ ${Number(film.vote_average).toFixed(1)} / 10`;

    carte.appendChild(image);
    carte.appendChild(titre);
    carte.appendChild(note);

    return carte;
}

async function chargerFilms(endpoint, params = {}) {
    try {
        const url = new URL(endpoint);
        url.searchParams.set('language', 'fr-FR');
        url.searchParams.set('page', '1');
        
        // Ajouter les paramètres supplémentaires
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });

        const reponse = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': CONFIG.cleAPI
            }
        });

        if (!reponse.ok) {
            throw new Error(`Erreur HTTP: ${reponse.status}`);
        }

        const donnees = await reponse.json();
        return donnees.results.slice(0, 15);
    } catch (erreur) {
        console.error('Erreur:', erreur);
        return [];
    }
}

async function remplirCarousel(carousel, films) {
    carousel.innerHTML = '';
    films.forEach(film => {
        carousel.appendChild(creerCarteFilm(film));
    });
}

function initialiserBoutonsCarousel(conteneur) {
    const carousel = conteneur.querySelector('.movie-carousel');
    const boutonPrecedent = conteneur.querySelector('.prev');
    const boutonSuivant = conteneur.querySelector('.next');

    if (boutonPrecedent) {
        boutonPrecedent.addEventListener('click', () => {
            carousel.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }

    if (boutonSuivant) {
        boutonSuivant.addEventListener('click', () => {
            carousel.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    if (carousel) {
        carousel.addEventListener('scroll', () => {
            if (boutonPrecedent) {
                boutonPrecedent.style.display = 
                    carousel.scrollLeft > 0 ? 'block' : 'none';
            }
            if (boutonSuivant) {
                const estALaFin = carousel.scrollLeft >= 
                    (carousel.scrollWidth - carousel.clientWidth - 10);
                boutonSuivant.style.display = estALaFin ? 'none' : 'block';
            }
        });
    }
}

async function initialiserCollection(collection) {
    const carousel = collection.querySelector('.movie-carousel');
    if (!carousel) return;

    const type = carousel.dataset.type; // Type de films (popular, topRated, etc.)
    const genre = carousel.dataset.genre;
    
    let endpoint;
    let params = {};

    if (genre) {
        endpoint = CONFIG.urlAPI.discover;
        params.with_genres = genre;
    } else {
        endpoint = CONFIG.urlAPI[type] || CONFIG.urlAPI.popular;
    }

    const films = await chargerFilms(endpoint, params);
    await remplirCarousel(carousel, films);
    initialiserBoutonsCarousel(collection.querySelector('.carousel-container'));
}

document.addEventListener('DOMContentLoaded', async () => {
    const collections = document.querySelectorAll('.collection');
    collections.forEach(collection => initialiserCollection(collection));
});