// Registro
const inputNombreUsuarioNuevo = document.getElementById("nombres");
const inputApellidoUsuarioNuevo = document.getElementById("apellidos");
const inputFechaUsuarioNuevo = document.getElementById("fecha");
const inputCorreoUsuarioNuevo = document.getElementById("correo");
const inputContraseniaUsuarioNuevo = document.getElementById("contrasenia");
const inputPaisUsuarioNuevo = document.getElementById("pais");
const radiosSexoUsuarioNuevo = document.querySelectorAll('input[name="sexo"]');
const checkboxCondicionesUsuarioNuevo = document.getElementById("condiciones");

usuariosRegistrados = {};

let btnRegistro = document.getElementById("btn-registro");

if (localStorage.getItem("usuariosRegistrados")) {
  usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados"));
  console.log(
    "Usuarios registrados cargados desde localStorage:",
    usuariosRegistrados
  );
} else {
  console.log("No hay usuarios registrados en localStorage.");
}

if (btnRegistro) {
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
      validar()
    let nuevoUsuario = {
      nombre: nombreUsuarioNuevo,
      apellido: apellidoUsuarioNuevo,
      fecha: fechaUsuarioNuevo,
      correo: correoUsuarioNuevo,
      contrasenia: contraseniaUsuarioNuevo,
      pais: paisUsuarioNuevo,
      genero: generoSeleccionado,
    };

    usuariosRegistrados[correoUsuarioNuevo] = nuevoUsuario;
    localStorage.setItem(
      "usuariosRegistrados",
      JSON.stringify(usuariosRegistrados)
    );

    console.log(nuevoUsuario);
    console.log(usuariosRegistrados);

    window.location.href = "login.html";
  });
}

// Login
const inputEmailUsuario = document.getElementById("email");
const inputContraseniaUsuario = document.getElementById("password");
const btnLogin = document.getElementById("btn-login");
let usuarioLogueado;
const errorMsg = document.getElementById("error-msg");

// Cargar usuario logueado desde localStorage
if (localStorage.getItem("usuarioLogueado")) {
  usuarioLogueado = localStorage.getItem("usuarioLogueado");
  console.log("Usuario logueado cargado desde localStorage:", usuarioLogueado);
} else {
  console.log("No hay usuario logueado en localStorage.");
}

if (btnLogin) {
  btnLogin.addEventListener("click", (event) => {
    event.preventDefault();

    const emailUsuario = inputEmailUsuario.value;
    const contrasenia = inputContraseniaUsuario.value;

    // Verificar si el usuario ya está logueado
    if (usuarioLogueado) {
      console.log("El usuario ya está logueado:", usuarioLogueado);
      return;
    }

    // Verificar si existe un usuario registrado con el correo electrónico ingresado
    if (usuariosRegistrados[emailUsuario]) {
      // Verificar si la contraseña coincide
      if (usuariosRegistrados[emailUsuario].contrasenia === contrasenia) {
        // Las credenciales son correctas
        usuarioLogueado = emailUsuario;
        localStorage.setItem("usuarioLogueado", usuarioLogueado);
        console.log("Inicio de sesión exitoso para:", emailUsuario);
        console.log(usuarioLogueado);
        window.location.href = "profile.html";
      } else {
        // La contraseña es incorrecta
        errorMsg.style.display = "block";
      }
    } else {
      // El usuario no está registrado
      errorMsg.style.display = "block";
    }
  });
}


// Profile
document.addEventListener("DOMContentLoaded", function () {
  const usuarioLogueado = localStorage.getItem("usuarioLogueado");
  const esPaginaProfile = window.location.pathname.endsWith("profile.html");

  if (!usuarioLogueado && esPaginaProfile) {
    window.location.href = "login.html";
  }
});


function cargarPerfil() {
  const usuarioLogueado = localStorage.getItem("usuarioLogueado");
  const nombreProfile = document.getElementById("profile-nombre");
  const correoProfile = document.getElementById("profile-correo");
  const passwordProfile = document.getElementById("profile-password");

  if (usuarioLogueado && usuariosRegistrados[usuarioLogueado]) {
    nombreProfile.innerText = usuariosRegistrados[usuarioLogueado].nombre;
    correoProfile.innerHTML = usuarioLogueado;
    const password = usuariosRegistrados[usuarioLogueado].contrasenia;
    const censoredPassword = "*".repeat(password.length);
    passwordProfile.innerText = censoredPassword;
  } else {
    nombreProfile.innerText = "";
    correoProfile.innerHTML = "";
    passwordProfile.innerText = "";
  }
}


if (window.location.pathname.includes("profile.html")) {
  cargarPerfil();
}

const eliminarCuenta = document.getElementById("profile-link-eliminar");

if (eliminarCuenta) {
  eliminarCuenta.addEventListener("click", (event) => {
    event.preventDefault();

    delete usuariosRegistrados[usuarioLogueado];
    localStorage.removeItem("usuarioLogueado");
    usuarioLogueado = null; // Establecer usuarioLogueado en null

    // Guardar el objeto actualizado de usuariosRegistrados en el localStorage
    localStorage.setItem(
      "usuariosRegistrados",
      JSON.stringify(usuariosRegistrados)
    );

    window.location.href = "../index.html";
  });
}


const navegador = document.querySelector(".navbar ul");

if (navegador) {
  if (localStorage.getItem("usuarioLogueado")) {
    console.log(localStorage.getItem("usuarioLogueado"));
    // Crear el nuevo elemento <li>
    const nuevoItem = document.createElement('li');
    const isIndex = window.location.pathname.includes("index.html");
    const logoutHref = isIndex ? "#" : "../index.html"; // Si está en index.html, se establece el enlace como '#', de lo contrario, como '../index.html'
    nuevoItem.innerHTML = `<a href="${logoutHref}"><i class="fa fa-sign-out cerrar-sesion"></i></a>`;
    // Agregar el nuevo elemento al final de la lista
    navegador.appendChild(nuevoItem);
    
    // Si el usuario está en index.html, agregar un evento click al enlace para manejar el cierre de sesión
    if (isIndex) {
      nuevoItem.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar que el enlace redireccione
        localStorage.removeItem("usuarioLogueado"); // Eliminar la información de inicio de sesión
        usuarioLogueado = null;
        window.location.reload(); // Recargar la página para eliminar el enlace de cierre de sesión
      });
    }
  } else {
    // Obtener el elemento hijo que deseas eliminar
    const itemEliminar = document.querySelector('.cerrar-sesion');
    if (itemEliminar) {
      // Eliminar el elemento del DOM
      itemEliminar.parentElement.removeChild(itemEliminar);
    }
  }
}



const cerrarSesion = document.querySelectorAll(".cerrar-sesion");

if (cerrarSesion) {
  cerrarSesion.forEach(elemento => {
    elemento.addEventListener("click", (event) => {
      event.preventDefault();


      localStorage.removeItem("usuarioLogueado");
      usuarioLogueado = null; 
      window.location.href = "../index.html";
      console.log("sesion eliminada con exito");
    });
  });
}
//validaciones
function validar() {
  console.log("arranco funcion validar")
  
  var nombres = document.getElementById("nombres").value;
  // Expresión regular para validar que no haya números en el nombre
  var nombreRegex = /^[a-zA-Z\s]*$/;

  // Verificar si el nombre cumple con la expresión regular
  if (!nombreRegex.test(nombres)) {
      // Si no cumple, mostramos un mensaje de error
      alert('El nombre no puede contener números.');
      // Detenemos el envío del formulario
      event.preventDefault();
  }
  var apellidos = document.getElementById("apellidos").value;
  var apellidoRegex = /^[a-zA-Z\s]*$/;
  if (!apellidoRegex.test(apellidos)) {
    // Si no cumple, mostramos un mensaje de error
    alert('El Apellido no puede contener números.');
    // Detenemos el envío del formulario
    event.preventDefault();
}
  var fecha = document.getElementById("fecha").value;
  var correo = document.getElementById("correo").value;
  var correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)){
    alert('El correo no es válido.');
    // Detenemos el envío del formulario
    event.preventDefault();
}
  var contrasenia = document.getElementById("contrasenia").value;
  var pais = document.getElementsByName("pais")[0].value;
  var sexo = document.querySelector('input[name="sexo"]:checked');
  var condiciones = document.getElementById("condiciones").checked;
  var fecha = document.getElementById("fecha").value;
  var valido = true;

  if (nombres === "" ||
      apellidos ==="" || 
      fecha ==="" || 
      correo ==="" ||
      contrasenia === "" ||
      pais === ""|| 
      sexo === "" || 
      condiciones === "" )
      valido = false; {
      alert ('Todos los campos deben estar completos.')
  event.preventDefault();
}
}

