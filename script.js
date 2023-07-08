

//****** GAME LOOP ********//

var time = new Date();
var deltaTime = 0;

if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);
} else {
    document.addEventListener("DOMContentLoaded", Init);
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var dinoPosX = 42;
var dinoPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280 / 3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 500;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var contenedor;
var fondoBody;
var dino;
var dinoColor;
var textoScore;
var suelo;
var gameOver;
var puntuacionMaxima;

function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    fondoBody = document.querySelector(".fondoBody");
    textoScore = document.querySelector(".scorePuntaje");

    dino = document.querySelector(".dino");
    document.addEventListener("keydown", HandleKeyDown);
    

    // Conseguir RECORD
    puntuacionMaxima = localStorage.getItem("puntuacionMaxima");
 
    var mejorPuntaje = document.getElementById('mejorPuntuacion');
    mejorPuntaje.innerHTML = puntuacionMaxima;

}

function Update() {
    if (parado) return;

    MoverDinosaurio();
    MoverSuelo();
    DecidirCrearObstaculos();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

function HandleKeyDown(ev) {
    if (ev.keyCode == 32) {
        Saltar();
    } else if (ev.keyCode == 87) {
        Saltar();
    } else if (ev.keyCode == 83) {
        bajar();
    } else if (ev.keyCode == 24) {
        Saltar();
    } else if (ev.keyCode == 24) {
        Saltar();
    }
}
function HandleKeyDown(ev) {
    if (ev.keyCode === 32 || ev.keyCode === 38 || ev.keyCode === 87) { // Tecla de espacio, flecha hacia arriba o "W"
        Saltar();
    } else if (ev.keyCode === 83 || ev.keyCode === 40) { // Tecla "S" o flecha hacia abajo
        bajar();
    } else if (ev.keyCode === 24) { // Otra tecla (código 24 en tu código original)
        Saltar();
    }
}

function Saltar() {
    if (dinoPosY === sueloY) {
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
    }
}
function bajar() {
    if (saltando) {
        saltando = true;
        velY = -700;
    }
}
function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if (dinoPosY < sueloY) {

        TocarSuelo();
    }
    dino.style.bottom = dinoPosY + "px";
}

function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if (saltando) {
        dino.classList.add("dino-corriendo");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
    dino.classList.remove("dino-corriendo");
    dino.classList.add("dino-estrellado");
    parado = true;
}

function DecidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if (tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if (Math.random() > 0.5) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth + "px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax - tiempoNubeMin) / gameVel;
}

function MoverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            GanarPuntos();
        } else {
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if (nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        } else {
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX + "px";
        }
    }
}

function GanarPuntos() {
    score++;
    console.log(score)

    textoScore.innerText = score;
    if (score == 10) {
        gameVel = 1;
        contenedor.classList.add("mediodia");
        fondoBody.classList.add("mediodia");
        dino.classList.add('colorDino1');
        suelo.classList.add('sueloMediodia');
    } else if (score == 20) {
        gameVel = 1.5;
        contenedor.classList.add("tarde");
        fondoBody.classList.add("tarde");
        dino.classList.add('colorDino2');
        suelo.classList.add('sueloTarde');
    } else if (score == 30) {
        gameVel = 2;
        contenedor.classList.add("noche");
        fondoBody.classList.add("noche");
        dino.classList.add('colorDino3');
        suelo.classList.add('sueloNoche');

    }
    suelo.style.animationDuration = (5 / gameVel) + "s";

}


function GameOver() {
    Estrellarse();
    gameOver.style.display = "grid";


    // Conseguir RECORD
    puntuacionMaxima = localStorage.getItem("puntuacionMaxima");
    
    if (score > puntuacionMaxima) {
          // guardar record
        localStorage.setItem("puntuacionMaxima", score);
        console.log("Local: " + localStorage.getItem("puntuacionMaxima"));

        mostrarMensajeNuevoRecord();
    }
}

function mostrarMensajeNuevoRecord() {
    var mensajeNuevoRecord = document.querySelector('.record');
    var mejorPuntaje = document.getElementById('score');
    mensajeNuevoRecord.style.display = 'block';
    mejorPuntaje.innerHTML = "puntos: " + score;
}
function Retry() {
    location.reload();
}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if (obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        } else {
            if (IsCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                GameOver();
            }
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}