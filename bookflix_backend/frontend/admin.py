from django.contrib import admin

from frontend.models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'apellido', 'email','is_online', 'is_staff']
    search_fields = ['nombre', 'apellido', 'email']
    list_filter = ['is_staff', 'fecha_de_registro']
    list_editable = ['is_staff','is_online']