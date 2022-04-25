require('colors')

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require('./helpers/inquirer');
const Tareas = require('./models/tareas');


const main = async() => {

    let opt = ''
    const tareas = new Tareas()

    const tareasDB = leerDB();

    if (tareasDB){ // cargar tareas
        tareas.cargarTareasFromArray(tareasDB)
    }

    do {
        // Imprimir el menú
        opt = await inquirerMenu()
        
        // Gestiona las funciones de las opciones
        switch (opt) {
            case '1': // crear tareas
                const desc = await leerInput('Descripción:')
                console.log(desc)
                tareas.crearTarea(desc)
            break;

            case '2': // listar tareas
                tareas.listadoCompleto()
            break

            case '3': // listar tareas completadas
                tareas.listarPendientesCompletadas()
            break

            case '4': // listar tareas pendientes
                tareas.listarPendientesCompletadas(false)
            break

            case '5': // completar tareas
                const ids = await mostrarListadoChecklist( tareas.listadoArr )
                tareas.toggleCompletadas(ids)
            break

            case '6': // borrar tareas
                const id = await listadoTareasBorrar(tareas.listadoArr)
                if (id !== '0'){
                    const ok = await confirmar('¿Está seguro de que desea borrarlo?')
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada')
                    }
                }
            break


        
            default:
                break;
        }


        guardarDB(tareas.listadoArr)


        await pausa()

    } while (opt !== '0');


    // pausa()

}

main();