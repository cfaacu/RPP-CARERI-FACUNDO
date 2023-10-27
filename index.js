const datosJSON = '[{"id":1, "nombre":"Clark", "apellido":"Kent", "edad":45, "alterego":"Superman", "ciudad":"Metropolis","publicado":2002},{"id":2, "nombre":"Bruce", "apellido":"Wayne", "edad":35, "alterego":"Batman", "ciudad":"Gotica","publicado":20012},{"id":3, "nombre":"Bart", "apellido":"Alen", "edad":30, "alterego":"Flash", "ciudad":"Central","publicado":2017},{"id":4, "nombre":"Lex", "apellido":"Luthor", "edad":18, "enemigo":"Superman", "robos":500,"asesinatos":7},{"id":5, "nombre":"Harvey", "apellido":"Dent", "edad":20, "enemigo":"Batman", "robos":750,"asesinatos":2},{"id":666, "nombre":"Celina", "apellido":"kyle", "edad":23, "enemigo":"Batman", "robos":25,"asesinatos":1}]';
const datosTabla = JSON.parse(datosJSON);
const COLUMNAS = ["id", "nombre", "apellido", "edad", "alterego", "ciudad", "publicado", "enemigo", "robos", "asesinatos"];


let listaPersonas = datosTabla.map(persona => {
    const esHeroe = persona?.ciudad;
    const { id, nombre, apellido, edad } = persona;
    if (esHeroe) {
        const { alterego, ciudad, publicado } = persona;
        return new Heroe(id, nombre, apellido, edad, alterego, ciudad, publicado);
    } else {
        const { enemigo, robos, asesinatos } = persona;
        return new Villano(id, nombre, apellido, edad, enemigo, robos,asesinatos);
    }
});

function $(elemento)
{
    return document.getElementById(elemento);
}

const tabla = $('contenedor-tabla');
const formulario = $('abm-form');
formulario.style.display = 'none';

function generarCheckbox()
{
    const contenedorcboxes = $('cbox-columnas');
    COLUMNAS.map(columna => {
        const nombre = document.createElement('label');
        const cbox = document.createElement('input');
        nombre.textContent = columna;
        nombre.style.marginLeft = '10px';
        cbox.setAttribute('type', 'checkbox');
        cbox.setAttribute('checked', 'true');
        cbox.setAttribute('id', `cbox-${columna}`);
    
        contenedorcboxes.appendChild(nombre);
        contenedorcboxes.appendChild(cbox);
    });
}

generarCheckbox();

function generarStatusPorDefecto(prop)
{
    const cbox = document.querySelector(`#cbox-${prop}`);
    const columna = document.querySelector(`#cabecera-${prop}`);
    cbox.checked = true;
    columna.style.display = 'table-cell';
}

function cambiarVisibilidadColumnas()
{
    COLUMNAS.map(columna => {
        const filas = document.querySelectorAll(`#celda-${columna}`);
        const cabeceraColumna = $(`cabecera-${columna}`);
        const cboxes = document.querySelectorAll(`#cbox-${columna}`);
        cboxes.forEach(cbox => {
            cbox.onclick = () => {
                const visibilidad = cbox.checked ? 'table-cell' : 'none';
                filas?.forEach(col => {
                    col.style.display = visibilidad;
                });
                cabeceraColumna.style.display = visibilidad;
            }
        })

    });
}

function generarFilas (lista)
{
    const filasAnteriores = tabla.querySelectorAll('tr');
    const filasTabla = $('filas-tabla');

    for (let i = 1; i < filasAnteriores.length; i++) {
        filasTabla.removeChild(filasAnteriores[i]);
    }

    lista.map((persona, index) => {
        const fila = document.createElement("tr");
        fila.setAttribute("id-fila", index);
        fila.setAttribute("class", "fila-generada")

        COLUMNAS.map(columna => {
            const celda = document.createElement("td");
            celda.setAttribute('id', `celda-${columna}`);

            generarStatusPorDefecto(columna);


            celda.textContent = persona[columna] !== undefined && persona[columna] !== null && persona[columna] !== '' ? persona[columna] : 'N/A';
            fila.appendChild(celda);
        });
        filasTabla.appendChild(fila);
    });

    cambiarVisibilidadColumnas();
}

generarFilas(listaPersonas);

function filtrarColumnas()
{
    const selectInput = $('select-filtro');
    const valorSeleccionado = selectInput.value;

    switch (valorSeleccionado) {
        case '1':
            generarFilas(listaPersonas);
            break;
        case '2':
            generarFilas(listaPersonas?.filter(persona => persona instanceof Heroe))
            break;
        case '3':
            generarFilas(listaPersonas?.filter(persona => persona instanceof Villano));
            break;
    }
    $('input-promedio').value = '';
}



function seleccionarTipoPersona(estaEditando, tipoHeroe)
{
    const esHeroe = $('tipo-input').value == '1';

    console.log((estaEditando && tipoHeroe != 'N/A'));
    if ((esHeroe && !estaEditando || (estaEditando && tipoHeroe != 'N/A'))) {
        $('alterego-input').style.display = 'block';
        $('ciudad-input').style.display = 'block';
        $('publicado-input').style.display = 'block';
        $('enemigo-input').style.display = 'none';
        $('robos-input').style.display = 'none';
        $('asesinatos-input').style.display = 'none';
    } else {
        $('alterego-input').style.display = 'none';
        $('ciudad-input').style.display = 'none';
        $('publicado-input').style.display = 'none';
        $('enemigo-input').style.display = 'block';
        $('robos-input').style.display = 'block';
        $('asesinatos-input').style.display = 'block';
    }
}

function abrirFormulario(estaEditando, esHeroe)
{
    seleccionarTipoPersona(estaEditando, esHeroe);
    formulario.style.display = 'flex';
    tabla.style.display = 'none';
    $('boton-eliminar').style.display = estaEditando ? 'block' : 'none';
    $('tipo-input').style.display = estaEditando ? 'none' : 'block';
}

function abrirTabla()
{
    formulario.style.display = 'none';
    tabla.style.display = 'block';
    $('nombre-input').value = '';
    $('apellido-input').value = '';
    $('edad-input').value = '';
    $('alterego-input').value = '';
    $('ciudad-input').value = '';
    $('publicado-input').value = '';
    $('enemigo-input').value = '';
    $('robos-input').value = '';
    $('asesinatos-input').value = '';
}

function generarID() {
    let id;
    let existeIdEnLista;
    
    do {
        id = Math.floor(Math.random() * 1000); 
        
        existeIdEnLista = listaPersonas.some(persona => persona.id === id);
    } while (existeIdEnLista);
    
    return id;
}

function aceptarAccion()
{
    const idPersona = $('id-input').value;
    const nombre = $('nombre-input').value.trim();
    const apellido = $('apellido-input').value.trim();
    const edad = parseInt($('edad-input').value);
    const alterego = $('alterego-input').value.trim();
    const ciudad = $('ciudad-input').value.trim();
    const publicado = parseInt($('publicado-input').value);
    const enemigo = $('enemigo-input').value.trim();
    const robos = parseInt($('robos-input').value);
    const asesinatos = parseInt($('asesinatos-input').value);

    const esHeroe = $('tipo-input').value == '1';
    const generarIdPersona = idPersona ? parseInt(idPersona) : generarID();
    let nuevaPersona;
    console.log("tipo" + $('tipo-input').value);
    if (esHeroe) {
        nuevaPersona = new Heroe(
            generarIdPersona,
            nombre,
            apellido,
            edad,
            alterego,
            ciudad,
            publicado
        );
    } else {
        nuevaPersona = new Villano(
            generarIdPersona,
            nombre,
            apellido,
            edad,
            enemigo,
            robos,
            asesinatos
        );
    }

    console.log(nuevaPersona instanceof Villano);
    if (
        nombre.length > 0 &&
        apellido.length > 0 &&
        edad >= 0 &&
        ((nuevaPersona instanceof Heroe && alterego.length > 0 && ciudad.length > 0 && publicado > 1940) ||
        (nuevaPersona instanceof Villano && enemigo.length > 0 && robos > 0 && asesinatos >0))
    ) {
        listaPersonas = idPersona
            ? [...listaPersonas.filter(persona => persona.id !== parseInt(idPersona)), nuevaPersona]
            : [...listaPersonas, nuevaPersona];
        generarFilas(listaPersonas);
        abrirTabla();
    } else {
        alert('Alguno de los valores no es valido!');
    }
}

function eliminarAccion()
{
    const idPersona = $('id-input').value;
    listaPersonas = [...listaPersonas.filter(persona => persona.id !== parseInt(idPersona))];
    generarFilas(listaPersonas);
    abrirTabla();
}

tabla.addEventListener('dblclick', function (e){
    const fila = e.target.closest('tr');
    const idFila = fila?.getAttribute('id-fila');

    if (fila && idFila) {
        const datos = {};
        const datosCelda = fila?.querySelectorAll('td');

        datosCelda.forEach((_, index) => {
            const columna = COLUMNAS[index];
            const valor = datosCelda[index].textContent;
            datos[columna] = valor;
        });

        $('id-input').value = datos.id || '';
        $('nombre-input').value = datos.nombre || '';
        $('apellido-input').value = datos.apellido || '';
        $('edad-input').value = datos.edad || '';
        $('alterego-input').value = datos.alterego || '';
        $('ciudad-input').value = datos.ciudad || '';
        $('publicado-input').value = datos.publicado || '';
        $('enemigo-input').value = datos.enemigo || '';
        $('robos-input').value = datos.robos || '';
        $('asesinatos-input').value = datos.asesinatos || '';

        console.log(datos.publicado);

        abrirFormulario(true, datos.alterego);
    }
});

const cabeceraColumnas = document.querySelectorAll('th');

cabeceraColumnas.forEach(cabecera => {
    cabecera.addEventListener('click', function() {
        const columna = cabecera.getAttribute('columna');

        listaPersonas.sort((a, b) => {
            if (a[columna] < b[columna]) {
                return -1;
            } else if (a[columna] > b[columna]) {
                return 1;
            } else {
                return 0;
            }
        });

        generarFilas(listaPersonas);
        filtrarColumnas();
    });
});

function calcularPromedio()
{
    const celdasEdad = Array.from(document.querySelectorAll('#celda-edad'));
    const valoresEdad = celdasEdad?.map(valor => parseInt(valor.textContent));
    const promedio = valoresEdad.reduce((acumulador, valor) => acumulador + valor, 0) / valoresEdad.length;
    $('input-promedio').value = promedio.toFixed(2);
}