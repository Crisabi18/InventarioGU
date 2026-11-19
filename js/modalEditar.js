let productoEditando =
null;

function nuevoProducto(){

    productoEditando = null;

    document.getElementById(
    "editCodigo"
    ).value = "";

    document.getElementById(
    "editNombre"
    ).value = "";

    document.getElementById(
    "editDescripcion"
    ).value = "";

    document.getElementById(
    "editCantidad"
    ).value = "";

    document.getElementById(
    "editArea"
    ).value = "";

    document.getElementById("codigo").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("area").value = "";


    document.getElementById(
    "tituloEditar"
    ).innerText =
    "📦 Nuevo producto";

    document.getElementById(
    "modalEditar"
    ).style.display =
    "flex";

};


function editar(codigo){

const p =
productos.find(
producto =>
producto.codigo === codigo
);

if(!p) return;

productoEditando = p;

document.getElementById(
"editCodigo"
).value = p.codigo;

document.getElementById(
"editNombre"
).value = p.nombre;

document.getElementById(
"editDescripcion"
).value = p.descripcion;

document.getElementById(
"editCantidad"
).value = p.cantidad;

document.getElementById(
"editArea"
).value = p.area;

document.getElementById(
"tituloEditar"
).innerText =
"✏️ Editar producto";

document.getElementById(
"modalEditar"
).style.display =
"flex";

};

function cerrarEditar(){

document.getElementById(
"modalEditar"
).style.display =
"none";

};



function guardarEdicionModal(){

if(productoEditando === null){

    document.getElementById("codigo").value =
    document.getElementById("editCodigo").value;

    document.getElementById("nombre").value =
    document.getElementById("editNombre").value;

    document.getElementById("descripcion").value =
    document.getElementById("editDescripcion").value;

    document.getElementById("cantidad").value =
    document.getElementById("editCantidad").value;

    document.getElementById("area").value =
    document.getElementById("editArea").value;

    guardarProducto();

    cerrarEditar();

    mostrarToast(
    "✅ Correcto",
    "Producto Guardado"
    );

    return;

}



if(!productoEditando) return;

productoEditando.codigo =
document.getElementById(
"editCodigo"
).value
.trim()
.toUpperCase();

productoEditando.nombre =
document.getElementById(
"editNombre"
).value
.trim()
.toUpperCase();

productoEditando.descripcion =
document.getElementById(
"editDescripcion"
).value
.trim()
.toUpperCase();

productoEditando.area =
document.getElementById(
"editArea"
).value
.trim()
.toUpperCase();

const cantidadNueva =
Number(
document.getElementById(
"editCantidad"
).value
);

const cantidadAnterior =
productoEditando.cantidad;

if(
cantidadAnterior !== cantidadNueva
){

if(
!productoEditando.historial
){
productoEditando.historial = [];
}

productoEditando.historial.push({

fecha:
fechaActual(),

tipo:
"AJUSTE",

cantidad:
cantidadNueva -
cantidadAnterior,

stockAnterior:
cantidadAnterior,

stockNuevo:
cantidadNueva

});

}

productoEditando.cantidad =
cantidadNueva;

productoEditando.modificado =
fechaActual();

guardarLocal();

mostrarProductos();

cerrarEditar();

mostrarToast(
"✅ Correcto",
"Producto actualizado"
);

};

