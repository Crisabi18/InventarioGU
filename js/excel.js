function exportarExcel(){

    if(productos.length === 0){

    mostrarModal(
        "⚠️ Sin datos",
        "No hay productos para exportar"
    );

    return;

    }

    const libro =
    XLSX.utils.book_new();

    const nombreArchivo =
    prompt(
    "Nombre del archivo:",
    "Almacen_Central"
    );

    if(
    nombreArchivo === null
    ){
        return;
    }

    // ==================
    // HOJA INVENTARIO
    // ==================

    const inventario = productos.map(p=>({

        CODIGO: p.codigo,

        NOMBRE: p.nombre,

        DESCRIPCION: p.descripcion,

        CANTIDAD: p.cantidad,

        AREA: p.area,

        ULTIMA_MODIFICACION:
        p.modificado

    }));

    const hojaInventario =
    XLSX.utils.json_to_sheet(
        inventario
    );

    XLSX.utils.book_append_sheet(
        libro,
        hojaInventario,
        "INVENTARIO"
    );



    // ==================
    // HOJA HISTORIAL
    // ==================

    const historialCompleto = [];

    productos.forEach(p=>{

        if(!p.historial) return;

        p.historial.forEach(h=>{

            historialCompleto.push({

                FECHA: h.fecha,

                CODIGO: p.codigo,

                PRODUCTO: p.nombre,

                TIPO: h.tipo,

                MOVIMIENTO: h.cantidad,

                ANTES:
                h.stockAnterior ?? "",

                DESPUES:
                h.stockNuevo ?? ""

            });

        });

    });

    const hojaHistorial =
    XLSX.utils.json_to_sheet(
        historialCompleto
    );

    XLSX.utils.book_append_sheet(

        libro,

        hojaHistorial,

        "HISTORIAL"

    );


    XLSX.writeFile(
    libro,
    nombreArchivo + ".xlsx"
    );


    // ==================
    // GUARDAR ARCHIVO
    // ==================

    const fecha =
    new Date()
    .toISOString()
    .slice(0,10);

    XLSX.writeFile(
        libro,
        `inventario_${fecha}.xlsx`
    );



    // ==================
    // GUARDAR FECHA
    // ==================

    const ultima =
    fechaActual();

    localStorage.setItem(
        "ultima_exportacion",
        ultima
    );

    document
    .getElementById(
    "ultimaExportacion"
    )
    .innerHTML =
    "🕒 Última exportación: " +
    ultima;

};

function importarExcel(event){

    const archivo =
    event.target.files[0];

    if(!archivo) return;

    const lector =
    new FileReader();

    lector.onload = function(e){

        const datos =
        new Uint8Array(
            e.target.result
        );

        const libro =
        XLSX.read(
            datos,
            {type:"array"}
        );

        // HOJA INVENTARIO

        const hojaInventario =
        libro.Sheets["INVENTARIO"];

        const inventario =
        XLSX.utils.sheet_to_json(
            hojaInventario
        );

        productos = [];

        inventario.forEach(item=>{

            productos.push({

                codigo:
                item.CODIGO || "",

                nombre:
                item.NOMBRE || "",

                descripcion:
                item.DESCRIPCION || "",

                cantidad:
                Number(
                    item.CANTIDAD
                ) || 0,

                area:
                item.AREA || "",

                modificado:
                item.ULTIMA_MODIFICACION || "",

                historial:[]
            });

        });

        // HOJA HISTORIAL

        const hojaHistorial =
        libro.Sheets["HISTORIAL"];

        if(hojaHistorial){

            const historial =
            XLSX.utils.sheet_to_json(
                hojaHistorial
            );

            historial.forEach(h=>{

                const producto =
                productos.find(
                    p =>
                    p.codigo === h.CODIGO
                );

                if(producto){

                    producto.historial.push({

                        fecha:
                        h.FECHA || "",

                        tipo:
                        h.TIPO || "",

                        cantidad:
                        Number(
                            h.MOVIMIENTO
                        ) || 0,

                        stockAnterior:
                        Number(
                            h.ANTES
                        ) || 0,

                        stockNuevo:
                        Number(
                            h.DESPUES
                        ) || 0

                    });

                }

            });

        }

        guardarLocal();

        mostrarProductos();

        mostrarModal(
            "✅ Éxito",
            "Inventario importado correctamente"
        );

    };

    lector.readAsArrayBuffer(
        archivo
    );

};