let productos = [];
let editando = null;

const datosGuardados =
localStorage.getItem("inventario_trabajo");

if(datosGuardados){
    productos = JSON.parse(datosGuardados);
}

const ultimaExportacion =
localStorage.getItem(
"ultima_exportacion"
);

document
.getElementById(
"ultimaExportacion"
)
.innerHTML =
"🕒 Última exportación: " +
(
ultimaExportacion ||
"NUNCA"
);
function guardarLocal() {
    localStorage.setItem(
        "inventario_trabajo",
        JSON.stringify(productos)
    );
}

function fechaActual(){
return new Date().toLocaleString();
}

function guardarProducto(){

//CAMBIAR ESTO:
// const codigo = document.getElementById("codigo").value;
// const nombre = document.getElementById("nombre").value;
// const descripcion = document.getElementById("descripcion").value;
const cantidad = Number(document.getElementById("cantidad").value) || 0;
// const area = document.getElementById("area").value;

//POR ESTO:
const codigo =
document.getElementById("codigo")
.value
.trim()
.toUpperCase();

const nombre =
document.getElementById("nombre")
.value
.trim()
.toUpperCase();

const descripcion =
document.getElementById("descripcion")
.value
.trim()
.toUpperCase();

const area =
document.getElementById("area")
.value
.trim()
.toUpperCase();

if(nombre.trim() === ""){
mostrarModal(
    "⚠️ Error",
    "El nombre del producto es obligatorio"
);
return;
}

if(editando === null){

    const existente = productos.find(
        p => p.codigo === codigo
    );

    if(existente){

        mostrarCantidad(

    "⚠️ PRODUCTO EXISTENTE",

    "Existencias actuales: " +
    existente.cantidad,

    function(extra){

        existente.cantidad += extra;

        if(extra === null) return;

        extra = Number(extra);

        if(isNaN(extra) || extra <= 0){
            alert("Cantidad inválida");
            return;
        }

        existente.cantidad += extra;

        existente.modificado = fechaActual();

        if(!existente.historial){
            existente.historial = [];
        }

        existente.historial.push({
            fecha: fechaActual(),
            tipo: "ENTRADA",
            cantidad: extra
        });

        guardarLocal();
        mostrarProductos();
        limpiar();

        return;

    }

);

        
    }
};

if(editando !== null){

let cantidadAnterior =
Number(
    productos[editando].cantidad
);

if(!productos[editando].historial){
    productos[editando].historial = [];
}

if(
cantidadAnterior !== cantidad
){

productos[editando].historial.push({

    fecha: fechaActual(),

    tipo: "AJUSTE",

    cantidad:
    cantidad - cantidadAnterior,

    stockAnterior:
    cantidadAnterior,

    stockNuevo:
    cantidad

});

}

productos[editando] = {
    ...productos[editando],
    codigo,
    nombre,
    descripcion,
    cantidad,
    area,
    modificado: fechaActual()
};

editando = null;

}else{

productos.push({
codigo,
nombre,
descripcion,
cantidad,
area,
modificado: fechaActual(),

historial:[
{
    fecha:fechaActual(),
    tipo:"CREACION",
    cantidad:cantidad,
    stockAnterior:0,
    stockNuevo:cantidad
}
]

});

}

guardarLocal();
limpiar();
mostrarProductos();
}

function mostrarProductos(){

productos.sort((a,b)=>
a.nombre.localeCompare(b.nombre)
);

const filtro =
document.getElementById("buscar")
.value
.toLowerCase();

const lista =
document.getElementById("lista");

lista.innerHTML = "";

productos
.filter(p =>
p.nombre.toLowerCase().includes(filtro) ||
p.codigo.toLowerCase().includes(filtro)
)
.forEach((p,index)=>{

const div = document.createElement("div");

div.className = "producto";

div.innerHTML = `
<h3>${p.nombre}</h3>

<p><b>Código:</b> ${p.codigo}</p>

<p style="
color:#4CAF50;
font-weight:bold;
font-size:1.2rem;">
Cantidad: ${p.cantidad}
</p>

<div
id="info-${p.codigo}"
style="display:none;">

<p><b>Descripción:</b> ${p.descripcion}</p>

<p><b>Área:</b> ${p.area}</p>

<p><b>Modificado:</b> ${p.modificado}</p>


<div class="botones">

<button class="entrada"
onclick="entrada('${p.codigo}')">
+ Entrada
</button>

<button class="salida"
onclick="salida('${p.codigo}')">
- Salida
</button>

<button class="editar"
onclick="editar('${p.codigo}')">
Editar
</button>

<button class="borrar"
onclick="eliminarProducto('${p.codigo}')">
Eliminar
</button>

<button class="historial"
onclick="verHistorial('${p.codigo}')">
📜 Historial
</button>


</div>

</div>

<button
onclick="toggleInfo('${p.codigo}')"
style="
width:100%;
margin-top:10px;
margin-bottom:10px;
background:#333;
color:white;">
ℹ MÁS INFORMACIÓN
</button>

`;

lista.appendChild(div);

});
actualizarEstadisticas();
}

function toggleInfo(codigo){

    const info =
    document.getElementById(
        "info-" + codigo
    );

    if(info.style.display === "none"){

        info.style.display = "block";

    }else{

        info.style.display = "none";

    }

}

function entrada(codigo){

const p = productos.find(
    producto => producto.codigo === codigo
);

if(!p) return;

mostrarCantidad(

"📦 ENTRADA",

"¿Cuántas unidades deseas agregar?",

function(cantidad){

if(cantidad === null) return;

cantidad = Number(cantidad);

if(isNaN(cantidad) || cantidad <= 0){
    mostrarModal(
    "⚠️ Error",
    "Cantidad inválida"
);
    return;
}

let stockAnterior =
p.cantidad;

p.cantidad += cantidad;

let stockNuevo =
p.cantidad;

if(!p.historial){
    p.historial = [];
}

p.historial.push({
    fecha: fechaActual(),
    tipo: "ENTRADA",
    cantidad: cantidad,
    stockAnterior: stockAnterior,
    stockNuevo: stockNuevo
});

p.modificado =
fechaActual();

guardarLocal();

mostrarProductos();

mostrarModal(
"✅ Correcto",
"Entrada registrada"
);

}

);};


function salida(codigo){

const p = productos.find(
    producto => producto.codigo === codigo
);

if(!p) return;

mostrarCantidad(

"📦 SALIDA",

"¿Cuántas unidades deseas retirar?",

function(cantidad){

if(isNaN(cantidad) || cantidad <= 0){
    mostrarModal(
    "⚠️ Error",
    "Cantidad inválida"
);
    return;
}

let stockAnterior =
p.cantidad;

p.cantidad -= cantidad;

if(p.cantidad < 0){
    p.cantidad = 0;
}

let stockNuevo =
p.cantidad;

if(!p.historial){
    p.historial = [];
}

p.historial.push({
    fecha: fechaActual(),
    tipo: "SALIDA",
    cantidad: cantidad,
    stockAnterior: stockAnterior,
    stockNuevo: stockNuevo
});

p.modificado =
fechaActual();

guardarLocal();

mostrarProductos();

mostrarModal(
    "✅ Correcto",
    "Salida registrada"
);

}

);};


// function editar(codigo){

// const p = productos.find(
//     producto => producto.codigo === codigo
// );

// if(!p) return;

// document.getElementById("codigo").value = p.codigo;
// document.getElementById("nombre").value = p.nombre;
// document.getElementById("descripcion").value = p.descripcion;
// document.getElementById("cantidad").value = p.cantidad;
// document.getElementById("area").value = p.area;

// editando = productos.findIndex(
//     producto =>
//     producto.codigo === codigo
// );

// document
// .getElementById("formularioProducto")
// .style.display = "block";

// }

function eliminarProducto(codigo){

const index =
productos.findIndex(
    producto =>
    producto.codigo === codigo
);

if(index === -1) return;

mostrarConfirmacion(

"⚠️ Eliminar producto",

productos[index].nombre +
"\n" +
productos[index].codigo,

function(){

    productos.splice(
        index,
        1
    );

    guardarLocal();

    mostrarProductos();

    mostrarModal(
        "✅ Correcto",
        "Producto eliminado"
    );

}

);

};

function limpiar(){

document.getElementById("codigo").value = "";
document.getElementById("nombre").value = "";
document.getElementById("descripcion").value = "";
document.getElementById("cantidad").value = "";
document.getElementById("area").value = "";
}

document
.getElementById("buscar")
.addEventListener("input",mostrarProductos);

mostrarProductos();

function reiniciarInventario(){

mostrarConfirmacion(

"⚠️ Reiniciar inventario",

"Esta acción eliminará todos los productos",

function(){

    productos = [];

    guardarLocal();

    mostrarProductos();

    mostrarModal(
        "✅ Correcto",
        "Inventario reiniciado"
    );

}

);

}

document
.querySelectorAll("input, textarea")
.forEach(campo => {

    campo.addEventListener("input", () => {

        if(
            campo.type === "file" ||
            campo.type === "number"
        ){
            return;
        }

        campo.value =
        campo.value.toUpperCase();

    });

});

function abrirFormulario(){

    limpiar();

    editando = null;

    document
    .getElementById("formularioProducto")
    .style.display = "block";

}

function cerrarFormulario(){

    document
    .getElementById("formularioProducto")
    .style.display = "none";

    limpiar();

    editando = null;

};

function verHistorial(codigo){

    const p = productos.find(
        producto =>
        producto.codigo === codigo
    );

    if(!p) return;

    if(!p.historial ||
       p.historial.length === 0){

        mostrarModal(
            "❌ Error",
            "Sin movimientos registrados"
        );

        return;
    }


    let contenido ="";

    [...p.historial]
    .reverse()
    .forEach(h=>{

    contenido += `

    <div style="
    padding:10px;
    margin-bottom:10px;
    border-bottom:1px solid #444;">

    <b style="
    color:
    ${h.tipo === "ENTRADA" ? "#4CAF50" :
    h.tipo === "SALIDA" ? "#f44336" :
    h.tipo === "AJUSTE" ? "#ff9800" :
    "#2196f3"};
    ">

    ${h.tipo}

    </b><br>

    ${h.fecha}<br><br>

    Movimiento:
    ${h.cantidad}<br>

    ${h.stockAnterior}
    →
    ${h.stockNuevo}

    </div>
    `;


    });

    
    
    mostrarHistorialModal(
    "📜 HISTORIAL DE " +
    p.nombre,
    contenido
    );

};

function actualizarEstadisticas(){

    const totalProductos =
    productos.length;

    const totalExistencias =
    productos.reduce(
        (total,p) =>
        total + Number(p.cantidad),
        0
    );

    document
    .getElementById("totalProductos")
    .innerHTML =
    "📦 Productos: " +
    totalProductos;

    document
    .getElementById("totalExistencias")
    .innerHTML =
    "📊 Existencias: " +
    totalExistencias;
};


if("serviceWorker" in navigator){

    navigator.serviceWorker
    .register("service-worker.js")

    .then(() => {

        console.log(
            "Service Worker registrado"
        );

    });

};