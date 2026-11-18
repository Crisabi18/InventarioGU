function mostrarModal(
titulo,
texto
){

document
.getElementById(
"tituloModal"
)
.innerText =
titulo;

document
.getElementById(
"textoModal"
)
.innerText =
texto;

document
.getElementById(
"modalAlerta"
)
.style.display =
"flex";

};

function cerrarModal(){

document
.getElementById(
"modalAlerta"
)
.style.display =
"none";

};

// MODAL HISTORIAL

function mostrarHistorialModal(
    titulo,
    contenido
){

document
.getElementById(
    "tituloHistorial"
)
.innerText = titulo;

document
.getElementById(
    "contenidoHistorial"
)
.innerHTML = contenido;

document
.getElementById(
    "modalHistorial"
)
.style.display = "flex";

};

function cerrarHistorial(){

document
.getElementById(
    "modalHistorial"
)
.style.display = "none";

};

//MODAL CONFIRMACION

function mostrarConfirmacion(
titulo,
texto,
accion
){

document
.getElementById(
"tituloConfirmar"
)
.innerText =
titulo;

document
.getElementById(
"textoConfirmar"
)
.innerText =
texto;

document
.getElementById(
"btnConfirmar"
)
.onclick =
function(){

    accion();

    cerrarConfirmacion();

};

document
.getElementById(
"modalConfirmar"
)
.style.display =
"flex";

};

function cerrarConfirmacion(){

document
.getElementById(
"modalConfirmar"
)
.style.display =
"none";

};

//MODAL CANTIDAD
function mostrarCantidad(
titulo,
texto,
accion
){

document
.getElementById(
"tituloCantidad"
)
.innerText = titulo;

document
.getElementById(
"textoCantidad"
)
.innerText = texto;

document
.getElementById(
"inputCantidad"
)
.value = "";

document
.getElementById(
"btnCantidadAceptar"
)
.onclick = function(){

    const cantidad =
    Number(
        document.getElementById(
            "inputCantidad"
        ).value
    );

    if(
    isNaN(cantidad)
    || cantidad <= 0
    ){

        mostrarModal(
        "⚠️ Error",
        "Cantidad inválida"
        );

        return;

    }

    accion(cantidad);

    cerrarCantidad();

};

document
.getElementById(
"modalCantidad"
)
.style.display =
"flex";

};

function cerrarCantidad(){

document
.getElementById(
"modalCantidad"
)
.style.display =
"none";

};
