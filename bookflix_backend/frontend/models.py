from django.db import models

from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

class Usuario(models.Model):
    usuarioid = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=45)
    apellido = models.CharField(max_length=45)
    email = models.CharField(max_length=45)
    contrasenia = models.CharField(max_length=45)
    fecha_de_registro = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)

    @classmethod
    def registrar_usuario(cls, nombre, apellido, email, contrasenia):
        usuario = cls(
            nombre = nombre,
            apellido = apellido,
            email = email,
            contrasenia = make_password(contrasenia),
        )

        usuario.save()
        return usuario

    @classmethod
    def iniciar_sesion(cls, email, contrasenia):
        usuario = cls.objects.filter(email = email).first()
    
        if usuario and check_password(contrasenia, usuario.contrasenia) and usuario.is_online == False :
            usuario.is_online = True
            usuario.save() 
            return usuario
        return None

    @classmethod
    def cerrar_sesion(cls, email):
        usuario = cls.objects.filter(email = email).first()
        print (usuario)
        if usuario and usuario.is_online == True:
            usuario.is_online = False
            usuario.save()
            return usuario
        return None

