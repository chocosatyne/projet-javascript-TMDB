const CONFIG = {
    urlAPI: {
        popular: 'https://api.themoviedb.org/3/movie/popular',
        topRated: 'https://api.themoviedb.org/3/movie/top_rated',
        upcoming: 'https://api.themoviedb.org/3/movie/upcoming',
        nowPlaying: 'https://api.themoviedb.org/3/movie/now_playing'
    },
    urlImages: 'https://image.tmdb.org/t/p/w500',
    cleAPI: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MjI1ZTgwMGVjNGE0YTFkZWU0N2QzNDY0M2MxZWZmNiIsIm5iZiI6MTczNDM1NTI5Mi45NzQwMDAyLCJzdWIiOiI2NzYwMjk1Y2FjYTM1NDllNTRmNjcxYmMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.EG2ty48MQF_7e_It-2hS9ldOJIPZzCqk6CJBdRc5RM8'
};

function creerCarteFilm(film) {
    let carte = document.createElement('div');
    carte.className = 'movie-card';

    let image = document.createElement('div');
    image.className = 'movie-image';
    
    if (film.poster_path) {
        image.style.backgroundImage = `url(${CONFIG.urlImages}${film.poster_path})`;
    } else {
        image.classList.add('no-image');
    }

    let titre = document.createElement('h3');
    titre.className = 'movie-title';
    
    if (film.title.length > 30) {
        titre.textContent = film.title.slice(0, 27) + '...';
    } else {
        titre.textContent = film.title;
    }
    titre.title = film.title;

    let note = document.createElement('p');
    note.className = 'movie-rating';
    note.textContent = `⭐ ${Number(film.vote_average).toFixed(1)} / 10`;

    carte.appendChild(image);
    carte.appendChild(titre);
    carte.appendChild(note);

    return carte;
}

async function chargerFilms(url) {
    try {
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

async function afficherFilmsParCategorie() {
    try {
        // Créer les URLs avec les paramètres
        const urls = {
            'Films à la une :': `${CONFIG.urlAPI.popular}?language=fr-FR&page=1`,
            'Films les mieux notés :': `${CONFIG.urlAPI.topRated}?language=fr-FR&page=1`,
            'Prochaines sorties :': `${CONFIG.urlAPI.upcoming}?language=fr-FR&page=1`,
            'Films en salle :': `${CONFIG.urlAPI.nowPlaying}?language=fr-FR&page=1`
        };

        const collections = document.querySelector('.collections');
        collections.innerHTML = ''; // Vider le contenu existant

        // Créer une section pour chaque catégorie
        for (const [categorie, url] of Object.entries(urls)) {
            const films = await chargerFilms(url);
            
            if (films.length > 0) {
                const section = document.createElement('section');
                section.className = 'collection';
                section.innerHTML = `
                    <h2>${categorie}</h2>
                    <div class="carousel-container">
                        <button class="carousel-btn prev"><</button>
                        <div class="movie-carousel"></div>
                        <button class="carousel-btn next">></button>
                    </div>
                `;

                const carousel = section.querySelector('.movie-carousel');
                films.forEach(film => {
                    carousel.appendChild(creerCarteFilm(film));
                });

                collections.appendChild(section);
            }
        }

        // Réinitialiser les carousels après avoir ajouté le contenu
        initialiserCarousels();

    } catch (erreur) {
        console.error('Erreur:', erreur);
        document.querySelector('.collections').innerHTML = 
            '<p class="error-message">Impossible de charger les catégories de films.</p>';
    }
}






async function afficherFilmsParCategorie() {
    try {
        // Créer les URLs avec les paramètres
        const urls = {
            'Films à la une :': `${CONFIG.urlAPI.popular}?language=fr-FR&page=1`,
            'Films les mieux notés :': `${CONFIG.urlAPI.topRated}?language=fr-FR&page=1`,
            'Prochaines sorties :': `${CONFIG.urlAPI.upcoming}?language=fr-FR&page=1`,
            'Films en salle :': `${CONFIG.urlAPI.nowPlaying}?language=fr-FR&page=1`
        };

        const collections = document.querySelector('.collections');
        collections.innerHTML = ''; // Vider le contenu existant

        // Créer une section pour chaque catégorie
        for (const [categorie, url] of Object.entries(urls)) {
            const films = await chargerFilms(url);
            
            if (films.length > 0) {
                const section = document.createElement('section');
                section.className = 'collection';
                section.innerHTML = `
                    <h2>${categorie}</h2>
                    <div class="carousel-container">
                        <button class="carousel-btn prev"><</button>
                        <div class="movie-carousel"></div>
                        <button class="carousel-btn next">></button>
                    </div>
                `;

                const carousel = section.querySelector('.movie-carousel');
                films.forEach(film => {
                    carousel.appendChild(creerCarteFilm(film));
                });

                collections.appendChild(section);
            }
        }

        // Réinitialiser les carousels après avoir ajouté le contenu
        initialiserCarousels();

    } catch (erreur) {
        console.error('Erreur:', erreur);
        document.querySelector('.collections').innerHTML = 
            '<p class="error-message">Impossible de charger les catégories de films.</p>';
    }
}



function initialiserCarousels() {
    let conteneurs = document.querySelectorAll('.carousel-container');

    conteneurs.forEach(conteneur => {
        let carousel = conteneur.querySelector('.movie-carousel');
        let boutonPrecedent = conteneur.querySelector('.prev');
        let boutonSuivant = conteneur.querySelector('.next');

        if (boutonPrecedent) {
            boutonPrecedent.addEventListener('click', () => {
                carousel.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });
        }

        if (boutonSuivant) {
            boutonSuivant.addEventListener('click', () => {
                carousel.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
        }

        if (carousel) {
            carousel.addEventListener('scroll', () => {
                if (boutonPrecedent) {
                    boutonPrecedent.style.display = 
                        carousel.scrollLeft > 0 ? 'block' : 'none';
                }
                if (boutonSuivant) {
                    let estALaFin = carousel.scrollLeft >= 
                        (carousel.scrollWidth - carousel.clientWidth - 10);
                    boutonSuivant.style.display = estALaFin ? 'none' : 'block';
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    afficherFilmsParCategorie();
});



