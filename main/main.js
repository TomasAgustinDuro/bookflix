const inputNombreUsuarioNuevo = document.getElementById("nombres");
const inputApellidoUsuarioNuevo = document.getElementById("apellidos");
const inputFechaUsuarioNuevo = document.getElementById("fecha");
const inputCorreoUsuarioNuevo = document.getElementById("correo");
const inputContraseniaUsuarioNuevo = document.getElementById("contrasenia");
const inputPaisUsuarioNuevo = document.getElementById("pais");
const radiosSexoUsuarioNuevo = document.querySelectorAll('input[name="sexo"]');
const checkboxCondicionesUsuarioNuevo = document.getElementById("condiciones");

usuariosRegistrados = {};

let btnRegistro = document.getElementById("btn-registro")

btnRegistro.addEventListener("click", (event) => {
    event.preventDefault(); 

    let nombreUsuarioNuevo = inputNombreUsuarioNuevo.value;
    let apellidoUsuarioNuevo = inputApellidoUsuarioNuevo.value;
    let fechaUsuarioNuevo = inputFechaUsuarioNuevo.value;
    let correoUsuarioNuevo = inputCorreoUsuarioNuevo.value;
    let contraseniaUsuarioNuevo = inputContraseniaUsuarioNuevo.value;
    let paisUsuarioNuevo = inputPaisUsuarioNuevo.value;

    // Obtener valor de type radio
    let generoSeleccionado = null;
    // Iterar sobre cada radio button
    radiosSexoUsuarioNuevo.forEach((radio) => {
        // Verificar si el radio button está seleccionado
        if (radio.checked) {
            // Obtener el valor seleccionado
            generoSeleccionado = radio.value;
        }
    });

    let nuevoUsuario = {
        nombre: nombreUsuarioNuevo,
        apellido: apellidoUsuarioNuevo,
        fecha: fechaUsuarioNuevo,
        correo: correoUsuarioNuevo,
        contrasenia: contraseniaUsuarioNuevo,
        pais: paisUsuarioNuevo,
        genero: generoSeleccionado
    };

    usuariosRegistrados[correoUsuarioNuevo] = nuevoUsuario; 

    console.log(nuevoUsuario);
    console.log(usuariosRegistrados);
});