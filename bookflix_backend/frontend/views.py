import json
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from frontend.models import Usuario

@csrf_exempt
def registrar_usuario(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        email = data.get('email')
        contrasenia = data.get('contrasenia')
        direccion = data.get('direccion')
        telefono = data.get('telefono')
        
        Usuario.registrar_usuario(nombre, apellido, email, contrasenia, direccion, telefono)

        # Ejemplo de respuesta JSON con el mensaje y la lista actualizada de usuarios
        response_data = {'mensaje': 'Usuario registrado exitosamente'}
        return JsonResponse(response_data)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)
        
def obtener_usuarios(request):
    usuarios = Usuario.listar_usuarios() 
    for usuario in usuarios:
        print(usuario.nombre, usuario.apellido, usuario.email)  # Imprimir en la consola los datos del usuario
    return JsonResponse({'mensaje': 'Usuarios obtenidos con éxito'})

@csrf_exempt
def obtener_usuario(email):
    try:
        usuario = Usuario.obtener_usuario(email)

        usuario_info = {
            'nombre': usuario.nombre,
            'apellido': usuario.apellido,
            'email':usuario.email,
            'contraseña':usuario.contrasenia,
            'is_online':usuario.is_online
        }

        return JsonResponse(usuario_info)
    
    except Usuario.DoesNotExist:
        return JsonResponse({
            'error': 'Usuario no encontrado'
        }, status=404)

@csrf_exempt
def iniciar_sesion(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            email = body.get('email')
            contrasenia = body.get('contrasenia')

            usuario = Usuario.iniciar_sesion(email, contrasenia)
            if usuario is not None:
                return JsonResponse({'mensaje': 'Login exitoso', 'usuario': usuario.email})
            else:
                return JsonResponse({'mensaje': 'Credenciales incorrectas'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'mensaje': 'JSON inválido'}, status=400)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)

@csrf_exempt 
def cerrar_sesion(request):
    if request.method == 'POST':
        try: 
            body_unicode = request.body.decode('utf-8')
            front = json.loads(body_unicode)
            email = front.get('email')
            
            print (email)
            
            usuario = Usuario.cerrar_sesion(email)
            
            if usuario is not None:
                return JsonResponse({'mensaje': 'Cerro sesion exitosamente', 'usuario': usuario.email})
            else:
                return JsonResponse({'mensaje': 'Problemas al cerrar sesion'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'mensaje': 'JSON inválido'}, status=400)
    else:
        return JsonResponse({'mensaje': 'Método no permitido'}, status=405)
            
@csrf_exempt       
def informacion_usuario(request, email):
  if request.method == 'GET':
        usuario = Usuario.mostrar_informacion(email)
        
        usuario_dict = {
            'nombre': usuario.nombre,
            'apellido': usuario.apellido,
            'email': usuario.email,
            'telefono':usuario.telefono,
            'direccion':usuario.direccion
        }
        
        return JsonResponse(usuario_dict)  # Devuelve los datos del usuario como JSON
  else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

# frontend/views.py
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def index(request):
    return render(request, 'index.html')

@csrf_exempt
def about(request):
    return render(request, 'pages/about.html')

@csrf_exempt
def busqueda_avanzada(request):
    return render(request, 'pages/busqueda-avanzada.html')

@csrf_exempt
def detail(request):
    return render(request, 'pages/detail.html')

@csrf_exempt
def login(request):
    return render(request, 'pages/login.html')

@csrf_exempt
def profile(request):
    return render(request, 'pages/profile.html')

@csrf_exempt
def recent(request):
    return render(request, 'pages/recent.html')

@csrf_exempt
def registro(request):
    return render(request, 'pages/registro.html')

@csrf_exempt
def review(request):
    return render(request, 'pages/review.html')
