function validar(){
    var nombres, apellidos, correo, contrasenia, expresion;
    nombres = document.getElementById("nombres").value;
    apellidos = document.getElementById("apellidos").value;
    correo = document.getElementById("correo").value;
    contrasenia = document.getElementById("contrasenia").value;
expresion = / \w+@ \w+ \.+[a-z]/;

if (nombre === "" || apellidos === "" || correo === "" || contrasenia === ""){
        alert("Todos los campos son obligatorios.");
        return false;
    }
else if (expresion.test(correo)){
    alert ("El correo no es valido.");
    return false;
}
};

