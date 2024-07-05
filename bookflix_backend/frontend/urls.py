"""
URL configuration for bookflix_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from frontend import views

urlpatterns = [
    # path('usuarios/registrar/', views.registrar_usuario, name='registrar_usuario'),
    # path('usuarios/iniciar_sesion/', views.iniciar_sesion, name='iniciar_sesion'),
    # path('usuarios/obtener_usuario/<int:email>/', views.obtener_usuario, name='obtener_usuario'),   
    # path('usuarios/cerrar_sesion', views.cerrar_sesion, name="cerrar_sesion"),
    # path('usuarios/perfil/<str:email>/', views.informacion_usuario, name='perfil'),
    
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('busqueda-avanzada/', views.busqueda_avanzada, name='busqueda_avanzada'),
    path('detail/', views.detail, name='detail'),
    path('login/', views.login, name='login'),
    path('profile/', views.profile, name='profile'),
    path('recent/', views.recent, name='recent'),
    path('registro/', views.registro, name='registro'),
    path('review/', views.review, name='review'),
]
