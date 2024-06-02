async function buscarLibros(tipo, cantidad) {
  const url = `https://openlibrary.org/search.json?q=${tipo}&limit=${cantidad}`;
  try {
      const respuesta = await fetch(url);
      const datos = await respuesta.json();

      return datos.docs; 
  } catch (error) {
      console.error('Error al buscar libros:', error);
      return []; // Retorna un array vacío en caso de error
  }
}

async function mostrarLibrosRecientesYRecomendados() {
  try {
      const datos = await buscarLibros('drama', 24); // Obtener 24 libros en total
      const { recientes, recomendados } = dividirLibros(datos, 12); // Dividir en dos grupos de 12 libros
      console.log(datos)
      mostrarLibros(recientes, "home-cont-libros-recientes", 3);
      mostrarLibros(recomendados, "home-cont-libros-recomendados", 3);
      mostrarLibros(recientes, "recientes-contenedor", 12); // Mostrar todos los libros recientes en "recientes-contenedor"
  } catch (error) {
      console.error('Error al mostrar libros recientes y recomendados:', error);
  }
}

function dividirLibros(libros, cantidadPorGrupo) {
  const recientes = libros.slice(0, cantidadPorGrupo);
  const recomendados = libros.slice(cantidadPorGrupo, cantidadPorGrupo * 2);
  return { recientes, recomendados };
}

async function mostrarLibros(datos, contenedorId, cantidadMaxima) {
  const contenedorLibros = document.getElementById(contenedorId);

  if (contenedorLibros) {
      let htmlContenedorLibros = '';
      let contador = 0;

      datos.forEach(documento => {
          if (contador < cantidadMaxima) {
              const coverId = documento.cover_i;
              const urlFoto = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
              const libroData = JSON.stringify(documento).replace(/'/g, "&apos;");

              htmlContenedorLibros += `
                  <div class="home-cont-libro" data-libro='${libroData}'>
                      <h3 class="home-title-libro">${documento.title}</h3>
                      <img src="${urlFoto}" class="home-libro" alt="Carátula del libro">
                      <p class="home-puntuacion">${documento.ratings_average ? documento.ratings_average.toFixed(2) : 'N/A'}</p>
                  </div>
              `;

              contador++;
          } else {
              return;
          }
      });

      contenedorLibros.innerHTML = htmlContenedorLibros;

      // Añadir event listeners a los elementos creados
      const elementosLibros = contenedorLibros.querySelectorAll('.home-cont-libro');
      elementosLibros.forEach(elemento => {
          elemento.addEventListener('click', (event) => {
              const libroData = event.currentTarget.getAttribute('data-libro');
              guardarYRedirigir(libroData);
          });
      });
  } else {
      console.log(`El contenedor ${contenedorId} no está presente en la página.`);
  }
}

function guardarYRedirigir(libroData) {
  localStorage.setItem('libroSeleccionado', libroData);
  window.location.href = 'pages/detail.html';
}

async function buscarDescripcionLibro(libroId) {
  const url = `https://openlibrary.org/works/${libroId}.json`;
  try {
      const respuesta = await fetch(url);
      const datos = await respuesta.json();
      console.log
      return datos; 
  } catch (error) {
      console.error('Error al buscar la descripción del libro:', error);
      return null; 
  }
}

// Código para manejar la página de detalles
async function mostrarDetallesLibro() {
  const libroData = localStorage.getItem('libroSeleccionado');

  if (libroData) {
      const libro = JSON.parse(libroData);
      console.log('Datos del libro después de parsear JSON:', libro); // Depuración

      // Mostrar los datos del libro en `detail.html`
      titulosLibro = document.getElementsByClassName('titulo-libro')
      
      for (let i = 0; i < titulosLibro.length; i++) {
        titulosLibro[i].innerText = libro.title;
    }

      // Obtener la descripción del libro de forma asíncrona
      try {
          const descripcionLibro = await buscarDescripcionLibro(libro.key.slice(7)); // Slice para quitar "/books/"
          document.getElementById('descripcion-libro').innerText = descripcionLibro ? descripcionLibro.description : 'Descripción no disponible';
      } catch (error) {
          console.error('Error al obtener la descripción del libro:', error);
          document.getElementById('descripcion-libro').innerText = 'Error al obtener la descripción del libro';
      }

      document.getElementById('anio-publicacion').innerText = libro.first_publish_year ? libro.first_publish_year : 'Año no disponible';
      const coverId = libro.cover_i;
      const urlFoto = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
      document.getElementById('imagen-libro').src = urlFoto;

      // Otros campos
      document.getElementById('temas-libro').innerText = libro.subject && libro.subject.length > 0 ? libro.subject[0] : 'Temas no disponibles';

      const editorial = libro.publisher && libro.publisher.length > 0 ? libro.publisher[0] : 'Editorial no disponible';
      document.getElementById('editorial-libro').innerText = editorial;

      const notaMedia = libro.ratings_average ? `${libro.ratings_average.toFixed(2)} (${libro.ratings_count} votos)` : 'Nota no disponible';
      document.getElementById('nota-media-libro').innerText = notaMedia;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.endsWith('detail.html')) {
      mostrarDetallesLibro();
  } else {
      mostrarLibrosRecientesYRecomendados();
  }
});



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
if (btnRegistro) {
  btnRegistro.addEventListener("click", (event) => {
    event.preventDefault();

    // Realizar validaciones
    if (!validarCampos()) {
      // Mostrar mensaje de error al usuario
      alert("Por favor, complete todos los campos correctamente.");
      return; // Evitar el registro y la redirección
    }

    // Continuar con el registro si todos los campos son válidos
    // Código para registrar al usuario y redirigirlo
    // ...
  });
}

function validarCampos() {
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
  var correo = document.getElementById("correo").value;
  var correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)){
    alert('El correo no es válido.');
    // Detenemos el envío del formulario
    event.preventDefault();
}
  var contrasenia = document.getElementById("contrasenia").value;
    const regexLongitud = /.{6,}/;
    const regexNumero = /\d/;
    const regexMayuscula = /[A-Z]/;

    // Verificar cada criterio
  if (!regexLongitud.test(contrasenia)) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      event.preventDefault(); 
      // Evita el envío del formulario
      return;
    }

    if (!regexNumero.test(contrasenia)) {
      alert('La contraseña debe contener al menos un número.');
      event.preventDefault(); 
      // Evita el envío del formulario
      return;
    }

    if (!regexMayuscula.test(contrasenia)) {
      alert('La contraseña debe contener al menos una letra mayúscula.');
      event.preventDefault(); 
      // Evita el envío del formulario
      return;
    }

// Si pasa todas las validaciones, el formulario se enviará normalmente.


  // Aquí realiza las validaciones de tus campos
  // Por ejemplo, verifica que todos los campos estén completos y sean válidos
  // Si algo no es válido, devuelve false; de lo contrario, devuelve true

  // Ejemplo de validación básica: verificar si algún campo está vacío
  if (
    !inputNombreUsuarioNuevo.value ||
    !inputApellidoUsuarioNuevo.value ||
    !inputFechaUsuarioNuevo.value ||
    !inputCorreoUsuarioNuevo.value ||
    !inputContraseniaUsuarioNuevo.value ||
    !inputPaisUsuarioNuevo.value ||
    !generoSeleccionado
  ) {
    return false; // Al menos un campo está vacío
  }
  else  {
    Consol.log (error) 
  }
}
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




//API REST
