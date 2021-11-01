// json-server --watch data/formulario.json --port 4000  Json Server
//Constantes estaticas
const templateCard   = document.getElementById("template-card").content;
const itemsCards     = document.getElementById("items-cards");
const fragment       = document.createDocumentFragment();
const API_KEY        = 'a945378004102ebd509180b2a94911b4'
const IMG_PATH       = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_URL     = 'https://api.themoviedb.org/3/search/movie?api_key=a945378004102ebd509180b2a94911b4&language=en-US&query='
const MOST_VALUED    = 'https://api.themoviedb.org/3/discover/movie?api_key=a945378004102ebd509180b2a94911b4&language=en-US&sort_by=vote_average.desc&include_adult=false&vote_count.gte=2500&vote_average.gte=7&page='
const LEAST_VALUED   = 'https://api.themoviedb.org/3/discover/movie?api_key=a945378004102ebd509180b2a94911b4&language=en-US&sort_by=vote_average.asc&include_adult=false&vote_count.gte=2500&vote_average.te=7&page='
const ALL_THE_MOVIES = 'https://api.themoviedb.org/3/discover/movie?api_key=a945378004102ebd509180b2a94911b4&page='

//constantes globales

let notscroll            = false;
let formModal            = document.getElementById('formModal');
let modal                = document.getElementById('modal');
let closex               = document.getElementById('close');
let formulario           = document.getElementById('form');
let btnCorreo            = document.getElementById('btnCorreo');
let btnEditar            = document.getElementById('btnEditar');
let btnEliminar          = document.getElementById('btnEliminar');
let modalVideosChild     = document.getElementById('modalVideosChild');
let modalVideos          = document.getElementById('modalVideos');
let modalCards           = document.getElementById('items-cards');
let buttonModalAhora     = document.getElementById('buttonModalAhora');
let buttonModalDespues   = document.getElementById('buttonModalDespues');
let modalCerrar          = document.getElementById('modalCerrar')
let videoModalOpen       = document.getElementById('videoModalOpen');
let titleModal           = document.getElementById('titleModal');
let btn                  = document.getElementById('btnBuscar');
let todas                = document.getElementById('todas');
let masValoradas         = document.getElementById('masValoradas');
let moviesModal          = document.getElementById('moviesModal');
let containerCards       = document.getElementById('container-cards');
let modalCrudMovies      = document.getElementById('modalCrudMovies');
let modalCrudMoviesChild = document.getElementById('modalCrudMoviesChild');
let closeCrudMovies      = document.getElementById('closeCrudMovies');
let btnBucarPelicula     = document.getElementById('btnBucarPelicula');
let btnEditarPelicula    = document.getElementById('btnEditarPelicula');
let btnEliminarPelicula  = document.getElementById('btnEliminarPelicula');
let modalMoviesSearcher  = document.getElementById('modalMoviesSearcher');
let btnAhora             = document.getElementById('boton-ahora');
let btnDespues           = document.getElementById('boton-despues');
let pages                = 2;
let movieInformation     = []
let url                  = 'http://localhost:4000/usuarios/'
let urlCrearMovies       = 'http://localhost:4001/peliculas/'

//* Slider
const splide = new Splide('.splide', {
    type: 'loop',
    padding: '5rem',
    autoplay: true,
});

// card template function

const templateGlobal = (movie) => {
    let bandera = 'https://user-images.githubusercontent.com/89098245/139451439-de37c9ba-fdad-4eaf-978e-63a02d43ec44.png'
    if (movie.poster_path == null) {
        templateCard.querySelector(".image-cards").setAttribute("src", bandera);
    } else {
        templateCard.querySelector(".image-cards").setAttribute("name", movie.id); 
        templateCard.querySelector(".image-cards").setAttribute("src", IMG_PATH + movie.poster_path);
    }
    templateCard.querySelector(".vote-average-container").setAttribute("id", cambioColor(movie.vote_average));
    templateCard.querySelector(".status").textContent = movie.vote_average;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
}

//  clean and paint cards

const deleteTemplate = () => {

    itemsCards.innerHTML = "";
    itemsCards.appendChild(fragment);
}

// Main page data load function

const getData = async () => {

    let url = 'https://api.themoviedb.org/3/discover/movie?api_key=3fa24de710feb7c63980b6f2b06381f9&page=1';
    let response = await fetch(url);
    let data = await response.json();
    let { results } = data;
    return results;
}

// Search engine data load function 

const getSearch = async (search) => {

    let response = await fetch(SEARCH_URL + search);
    let data = await response.json();
    let { results } = data;
    return results;
}

// Top rated function

const mostValued = async () => {

    let response = await fetch(MOST_VALUED);
    let data = await response.json();
    let { results } = data;
    return results;
}

// Less valued function

const leastValued = async () => {

    let response = await fetch(LEAST_VALUED);
    let data = await response.json();
    let { results } = data;
    return results;
}

// Session load all movies

const showData = async () => {

    let movies = await getData();
    notscroll = false
    movies.forEach(movie => {
        templateGlobal(movie)
    })
    deleteTemplate()
}

document.addEventListener('DOMContentLoaded', () => {
    showData()
    cargarSlide()
    splide.mount();
})

//Session search

btn.addEventListener('click', async (e) => {

    let tex = document.getElementById('inputBuscar').value;
    let dataBase = await getSearch(tex);

    if (dataBase.length === 0) {

        itemsCards.innerHTML = "";
        notscroll = true
        document.querySelector('.head-line').textContent = ''
        itemsCards.innerHTML = `<div class="imgNoEncontrada">
        <img src="./images/Noseencuentraresultados.png " class="imgResultado"></img>
        <h1>No se encuentran resultados para "${tex}"</h1>
        </div>
        `
    } else {

        e.preventDefault();
        document.querySelector('.head-line').textContent = 'Resultados de Busqueda'
        dataBase.forEach(movie => {
            templateGlobal(movie)
        })
        
        deleteTemplate()
    }
    notscroll = true
});

// Star color function

function cambioColor(vote_average) {

    if (vote_average <= 5.0) {
        return "blue";
    } else {
        return "yellow";
    }
}

// Session Scroll


const onScroll = async () => {

    if (notscroll === true) {
        return 
    } else {
        if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
            let resp = await fetch(urlFilter() + pages)
            let data = await resp.json();
            let { results } = data;
            pages = data.page + 1
            movieInformation.push(results)
            results.forEach(movie => {
                templateGlobal(movie)
            });
            itemsCards.appendChild(fragment);

        }

    }
}

window.addEventListener('scroll', onScroll)

//* All menu

todas.addEventListener('click', async () => {
    notscroll = false
    masValoradas.setAttribute("class", "");
    menosValoradas.setAttribute("class", "");
    todas.setAttribute("class", "active");
    let dataBase = await getData();
    dataBase.forEach(movie => {
        document.querySelector('.head-line').textContent = 'Todas las peliculas'
        templateGlobal(movie)
    })
    deleteTemplate()
    
});

//* most valued menu


masValoradas.addEventListener('click', async () => {

    masValoradas.setAttribute("class", "active");
    menosValoradas.setAttribute("class", "");
    todas.setAttribute("class", "");
    let dataBase = await mostValued();

    dataBase.forEach(movie => {
        document.querySelector('.head-line').textContent = 'Más valoradas'
        templateGlobal(movie)
    })
    deleteTemplate()
    notscroll = false
});

// least valued menu

let menosValoradas = document.getElementById('menosValoradas');
menosValoradas.addEventListener('click', async () => {

    menosValoradas.setAttribute("class", "active");
    masValoradas.setAttribute("class", "");
    todas.setAttribute("class", "");
    let dataBase = await leastValued();
    dataBase.forEach(movie => {
        document.querySelector('.head-line').textContent = 'Menos valoradas'
        templateGlobal(movie)
    })
    deleteTemplate()
    notscroll = false
});

//window modal

formModal.onclick = function (e) {

    modal.style.display = "block";
    e.preventDefault();
    
}

//close modal in x

closex.onclick = function (e) {

    modal.style.display = "none";
    e.preventDefault();
    
}

// session formulario

formulario.addEventListener('submit', async (e) => {

    e.preventDefault();
    let name = document.getElementById('name').value;
    let lastName = document.getElementById('lastName').value;
    let email = document.getElementById('email').value;
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            name,
            lastName,
            email
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
})

// btn email

btnCorreo.addEventListener('click', async () => {

    let emailToSearch = document.getElementById('email').value;
    const datos = await fetch(url);
    const data = await datos.json();
    document.getElementById('email').setAttribute("readonly", true);
    const busqueda = data.find(user => user.email.toLowerCase() === emailToSearch.toLowerCase());
    document.getElementById('name').value = busqueda.name;
    document.getElementById('lastName').value = busqueda.lastName;
    document.getElementById('email').value = busqueda.email;
    document.getElementById('id').value = busqueda.id;
})

// btn put

btnEditar.addEventListener('click', async () => {

    let name = document.getElementById('name').value;
    let lastName = document.getElementById('lastName').value;
    let email = document.getElementById('email').value;
    let id = document.getElementById('id').value;
    await fetch(url + id, {
        method: 'PUT',
        body: JSON.stringify({
            name,
            lastName,
            email
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
})


// btn delete

btnEliminar.addEventListener('click', async () => {

    let idModificar = document.getElementById('id').value;
    await fetch(`http://localhost:4000/usuarios/${idModificar}`, {
        method: 'DELETE',
    });
});

// order movies 

function urlFilter() {

    if (masValoradas.classList.contains('active')) {
        return MOST_VALUED
    } else if (menosValoradas.classList.contains('active')) {
        return LEAST_VALUED
    } else {
        return ALL_THE_MOVIES
    }
}


// open modal cards

modalCards.addEventListener('click', async (e) => {

    if (e.target.classList.contains('image-cards')) {

        modalVideos.style.display = "block";
        e.preventDefault();
        let idEncontrada = (e.target.name)
        urlMovies = `https://api.themoviedb.org/3/movie/${idEncontrada}?api_key=a945378004102ebd509180b2a94911b4&append_to_response=videos`
        let results = await fetch(urlMovies)
        let data = await results.json();
        modalVideosChild.innerHTML = `
                
            <div class="cardsnew">
                <img width="100%" height="100%" src="${IMG_PATH + data.poster_path}"></img>
            </div>
            <div class="titleModal" id="titleModal">
                <h1>${data.title}</h1>
                <p>${data.overview}</p>            
                <p>${data.release_date} ● ${data.genres[0].name}/${data.genres[1].name}</p>  
            </div> 
        `
            buttonModalAhora.addEventListener('click',(e)=>{
                e.preventDefault();
                modalVideosChild.innerHTML = `
                <div class="cardsnew">
                    <img width="100%" height="100%" src="${IMG_PATH + data.poster_path}"></img>
                </div>
                <div class="titleModal" id="titleModal">
                    <h1>${data.title}</h1>
                    <p>${data.overview}</p>            
                    <p>${data.release_date} ● ${data.genres[0].name}/${data.genres[1].name}</p>  
                    <div class="videoModalOpen" id="videoModalOpen">
                        <iframe src="https://www.youtube.com/embed/${(data.videos.results[0].key)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>  
                `
            });
            buttonModalDespues.addEventListener('click',async(e)=>{
                e.preventDefault();
                title    = data.title
                overview = data.overview 
                poster   = (IMG_PATH + data.poster_path)
            
                await fetch(urlCrearMovies, {
                    method: 'POST',
                    body: JSON.stringify({
                        title,
                        overview,
                        poster
                    }),
                headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    }
                })
                
            });
    }
    
    
})


modalCerrar.addEventListener('click',(e)=>{
    e.preventDefault();
    modalVideos.style.display = "none";
});


// open modal movies watch list

moviesModal.onclick = function (e) {
    e.preventDefault();
    modalCrudMovies.style.display = "block"
}

closeCrudMovies.onclick = function (e) {
    modalCrudMovies.style.display = "none";
    e.preventDefault();
}

// search for name 

btnBucarPelicula.addEventListener('click', async () => {

    let nameToSearch = document.getElementById('nameCrudMovies').value;
    const datos = await fetch(urlCrearMovies);
    const data = await datos.json();
    document.getElementById('nameCrudMovies').setAttribute("readonly", true);
    const busqueda = data.find(user => user.title.toLowerCase() === nameToSearch.toLowerCase());
    let image = busqueda.poster;
    document.getElementById('nameCrudMovies').value     = busqueda.title;
    document.getElementById('overviewCrudMovies').value = busqueda.overview;
    document.getElementById('linkCrudMovies').value     = busqueda.poster;
    document.getElementById('idMovie').value            = busqueda.id;
    
    formCrudMovies.style.backgroundImage = 'url(' + image + ')'
    

})

// btn put movies

btnEditarPelicula.addEventListener('click', async () => {

    let title    = document.getElementById('nameCrudMovies').value;
    let overview = document.getElementById('overviewCrudMovies').value;
    let poster   = document.getElementById('linkCrudMovies').value;
    let idMovie  = document.getElementById('idMovie').value;
    await fetch(urlCrearMovies + idMovie, {
        method: 'PUT',
        body: JSON.stringify({
            title,
            overview,
            poster
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
})


// btn delete movies

btnEliminarPelicula.addEventListener('click', async () => {

    let idModificar = document.getElementById('idMovie').value;
    await fetch(urlCrearMovies + idModificar, {
        method: 'DELETE',
    });
});


//* Slider
const cargarSlide = async () => {
    urlbase = 'https://api.themoviedb.org/3/discover/movie?api_key=3fa24de710feb7c63980b6f2b06381f9&page=10'
    
    let dataBase = await fetch(urlbase);
    let data = await dataBase.json();
    let { results } = data;
   
    
    const arrayToCut = results
    const n = 3
    const dataBaseCut = arrayToCut.slice(0, n)
    dataBaseCut.forEach(movie => {

        const divSlider = document.createElement('div');
        divSlider.classList.add('splide__slide')
        divSlider.innerHTML = `
            <img src="${IMG_PATH + movie.backdrop_path}">
        `
        splide.add(divSlider)
    })
}


