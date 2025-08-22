
let nivel;
let patronPartida;
let patronUsuarioClicks;
let rondaClickUsuario;
let userChosenColour;
let botonesColores = ["red", "blue", "green", "yellow"];
let teclasJugables = ["q", "w", "a", "s"];
let flagPrimeraTecla = false;
let flagUsuarioFallo = false;
let flagCookiesAutorizadas = false;
let volumenActual = 0.7;
let puntajeMaximoActual = 0;
let puntajeMaximoLocal = 0;

let teclaAColor = {
    q: "green",
    w: "red",
    a: "yellow",
    s: "blue"
}


$(document).ready(function () {
  // Mostrar el banner si el usuario no ha dado respuesta
  if (!localStorage.getItem("cookiesDecision")) {
    $("#cookie-banner").show();
  } else {
    $("#cookie-banner").hide();
    flagCookiesAutorizadas = localStorage.getItem("cookiesDecision") === "accepted";
    if (flagCookiesAutorizadas) {
      const puntajeGuardado = getCookie("puntajeMaximoLocal");
      if (puntajeGuardado) {
        puntajeMaximoLocal = parseInt(puntajeGuardado, 10);
        $(".maximo-local").text("Nivel " + puntajeMaximoLocal);
      }
    }
  }


  // Aceptar cookies
  $("#accept-cookies").on("click", function () {
    flagCookiesAutorizadas = true;
    localStorage.setItem("cookiesDecision", "accepted");
    $("#cookie-banner").hide();
  });

  // Rechazar cookies
  $("#reject-cookies").on("click", function () {
    flagCookiesAutorizadas = false;
    localStorage.setItem("cookiesDecision", "rejected");
    $("#cookie-banner").hide();
  });
});


$("#volumen").on("input", function () {
  volumenActual = parseFloat($(this).val());
});

// Presionar una tecla para comenzar el juego
$(document).keydown(function (e) {
    if (flagPrimeraTecla == false) {
        flagPrimeraTecla = true;
        comenzarJuego();
        setTimeout(function (){
            nextSequence();
        }, 600);
    }
    else{
        if (teclasJugables.includes(e.key)) {
            userChosenColour = teclaAColor[e.key];
            seleccionUsuario(userChosenColour);
        }
    }
});


$(".btn").click(function (e) {
    if (flagPrimeraTecla) {
        userChosenColour = e.target.id;
        seleccionUsuario(userChosenColour);
    }
});


function seleccionUsuario(color){
    animacionBoton(color);
    ejecutarSonido(color);
    patronUsuarioClicks.push(color);
    corroborarSeleccion(color, patronPartida[rondaClickUsuario]);
}


// Comenzar un nuevo juego
function comenzarJuego() {
    nivel = 0;
    patronPartida = [];
    flagUsuarioFallo = false;
    if ($("body").hasClass("game-over")) {
        $("body").removeClass("game-over");
    }
    $("h2").addClass("escondido");
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

        if (flagUsuarioFallo) {
            return;
        }

        colorRonda = patronPartida[j];

        idSeleccionado = "#" + colorRonda;
        $(idSeleccionado).fadeIn(100).fadeOut(100).fadeIn(100);
        ejecutarSonido(colorRonda);

        await new Promise(resolve => setTimeout(resolve, 480))
    }
}


// Ejecutar sonido del botón
function ejecutarSonido(nombreSonido) {
    let archivo = "./sounds/" + nombreSonido + ".mp3";
    let sonido = new Audio(archivo);
    sonido.volume = volumenActual;
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
        if (nivel > puntajeMaximoActual) {
            puntajeMaximoActual = nivel;
            $(".maximo-actual").text("Nivel " + puntajeMaximoActual);
        }
        setTimeout(function (){
        nextSequence();
        }, 700);
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
    flagUsuarioFallo = true;
    ejecutarSonido("wrong");
    $("body").addClass("game-over");
    $("h1").text("Perdiste :(");
    $("h2").removeClass("escondido");
    actualizarMaximoLocal();
    flagPrimeraTecla = false;
}

function actualizarMaximoLocal() {
    if (puntajeMaximoActual > puntajeMaximoLocal) {
        puntajeMaximoLocal = puntajeMaximoActual;
        $(".maximo-local").text("Nivel " + puntajeMaximoLocal);
        if (flagCookiesAutorizadas) {
            setCookie("puntajeMaximoLocal", puntajeMaximoLocal, 30);
        }
    }
}


function setCookie(nombreCookie, valor, dias) {
  const fechaExpiracion = new Date();
  fechaExpiracion.setTime(fechaExpiracion.getTime() + dias * 24 * 60 * 60 * 1000);
  document.cookie = `${nombreCookie}=${valor};expires=${fechaExpiracion.toUTCString()};path=/`;
}


function getCookie(nombre) {
  const nombreCookie = nombre + "=";
  const cookiesDecodificadas = decodeURIComponent(document.cookie);
  const listaCookies = cookiesDecodificadas.split(";");
  for (let cookie of listaCookies) {
    // limpieza espacios iniciales tras ;
    while (cookie.charAt(0) === " ") cookie = cookie.substring(1);
    // revision cookie comience por nombre buscado
    if (cookie.indexOf(nombreCookie) === 0) {
      return cookie.substring(nombreCookie.length, cookie.length);
    }
  }
  return null;
}
