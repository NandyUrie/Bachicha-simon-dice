
let nivel;
let patronPartida;
let patronUsuarioClicks;
let botonesColores = ["red", "blue", "green", "yellow"];
let flagPrimeraTecla = false;
let rondaClickUsuario;


// Presionar una tecla para comenzar el juego
$(document).keydown(function (e) {
    if (flagPrimeraTecla == false) {
        flagPrimeraTecla = true;
        comenzarJuego();
        nextSequence();
    }
});


$(".btn").click(function (e) {
    if (flagPrimeraTecla) {
        let userChosenColour = e.target.id;
        animacionBoton(userChosenColour);
        ejecutarSonido(userChosenColour);
        patronUsuarioClicks.push(userChosenColour);
        corroborarSeleccion(userChosenColour, patronPartida[rondaClickUsuario]);
    }
});


// Comenzar un nuevo juego
function comenzarJuego() {
    nivel = 0;
    patronPartida = [];
    if ($("body").hasClass("game-over")) {
        $("body").removeClass("game-over");
    }
}


// Ejecutar la siguiente secuencia
function nextSequence() {
    aumentarNivel();
    patronUsuarioClicks = [];
    rondaClickUsuario = 0;
    
    siguienteColorCorrecto();
    mostrarPatronRonda();
}


async function mostrarPatronRonda() {
    let colorRonda;
    let idSeleccionado;

    for (let j = 0; j < patronPartida.length; j++) {
        colorRonda = patronPartida[j];

        idSeleccionado = "#" + colorRonda;
        $(idSeleccionado).fadeIn(100).fadeOut(100).fadeIn(100);
        ejecutarSonido(colorRonda);

        await new Promise(resolve => setTimeout(resolve, 410))
    }
}


// Ejecutar sonido del botón
function ejecutarSonido(nombreSonido) {
    let archivo = "./sounds/" + nombreSonido + ".mp3";
    let sonido = new Audio(archivo);
    sonido.play();
}


// animación visual para mostrar patron a seguir en ronda
function animacionBoton(colorActual) {
    let idColor = "#" + colorActual;
    $(idColor).addClass("pressed");

    setTimeout(function () {
        $(idColor).removeClass("pressed");
    }, 100);
}


function corroborarSeleccion(seleccionado, objetivo) {
    if (seleccionado !== objetivo) {
            terminarJuego();
            return ;
        }
    rondaClickUsuario++;
    if (rondaClickUsuario == patronPartida.length)
    {
        setTimeout(function (){
        nextSequence();
        }, 500);
    }
}


function siguienteColorCorrecto() {
    let numeroRandom = Math.floor(Math.random() * 4);
    let colorRandom = botonesColores[numeroRandom];
    patronPartida.push(colorRandom);

    return colorRandom;
}


function aumentarNivel() {
    nivel++;
    $("h1").text("Nivel " + nivel);
}


function terminarJuego(){
    ejecutarSonido("wrong");
    $("body").addClass("game-over");
    $("h1").text("Perdiste, Presiona una tecla para comenzar de nuevo :)");
    flagPrimeraTecla = false;
}