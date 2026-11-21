function toggleCalculadora(){

const modal =
document.getElementById(
"modalCalculadora"
);

if(
modal.style.display === "flex"
){

modal.style.display =
"none";

}else{

modal.style.display =
"flex";

}

};

function cerrarCalc(){

document.getElementById(
"modalCalculadora"
).style.display =
"none";

};

function agregarCalc(valor){

document.getElementById(
"pantallaCalc"
).value += valor;

};

function limpiarCalc(){

document.getElementById(
"pantallaCalc"
).value = "";

};

function resolverCalc(){

try{

let resultado =
eval(
document.getElementById(
"pantallaCalc"
).value
);

document.getElementById(
"pantallaCalc"
).value =
resultado;

}catch{

mostrarModal(
"⚠️ Error",
"Ingrese una operación válida"
);

}

}