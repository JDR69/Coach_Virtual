from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    fecha_nacimiento = models.DateField(null=True, blank=True)
    genero = models.CharField(max_length=10, null=True, blank=True)
    altura = models.CharField(max_length=10, null=True, blank=True)
    peso = models.CharField(max_length=10, null=True, blank=True)

    email = models.EmailField(unique=True)
    def __str__(self):
        return self.username

class Plan(models.Model):
    nombre = models.CharField(max_length=15)
    descripcion = models.CharField(max_length=100)
    precio = models.IntegerField()
    
    def __str__(self):
        return self.nombre

class Alertas(models.Model):
    mensaje = models.CharField(max_length=100)
    fecha = models.DateField()
    estado = models.BooleanField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"Alerta para {self.usuario.nombre}: {self.mensaje}"

class DetallePlan(models.Model):
    fecha_inicio = models.DateField()
    fecha_final = models.DateField()
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.usuario.nombre} - {self.plan.nombre}"

class Objetivo(models.Model):
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre

class TipoPrograma(models.Model):
    nombre = models.CharField(max_length=20)
    
    def __str__(self):
        return self.nombre

class ProgramaEntrenamiento(models.Model):
    nombre = models.CharField(max_length=30)
    fecha_inicio = models.DateField()
    fecha_final = models.DateField()
    estado = models.BooleanField()
    tipo_programa = models.ForeignKey(TipoPrograma, on_delete=models.CASCADE)
    objetivo = models.ForeignKey(Objetivo, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nombre

class Dia(models.Model):
    nombre = models.CharField(max_length=20)
    
    def __str__(self):
        return self.nombre

class TipoEntrenamiento(models.Model):
    nombre = models.CharField(max_length=20)
    
    def __str__(self):
        return self.nombre

class DiasEntrenamiento(models.Model):
    descripcion = models.CharField(max_length=100)
    tipo_entrenamiento = models.ForeignKey(TipoEntrenamiento, on_delete=models.CASCADE)
    dia = models.ForeignKey(Dia, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.dia.nombre} - {self.tipo_entrenamiento.nombre}"

class Mediciones(models.Model):
    calorias = models.IntegerField()
    cronometrio = models.CharField(max_length=12)
    
    def __str__(self):
        return f"Calorías: {self.calorias}, Tiempo: {self.cronometrio}"

class Sesion(models.Model):
    fecha = models.DateField()
    comentario = models.CharField(max_length=100)
    estado = models.BooleanField()
    dias_entrenamiento = models.ForeignKey(DiasEntrenamiento, on_delete=models.CASCADE)
    sesion_padre = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return f"Sesión {self.fecha} - {self.dias_entrenamiento}"

class Musculo(models.Model):
    nombre = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre

class Ejercicios(models.Model):
    nombre = models.CharField(max_length=50)
    estado = models.BooleanField()
    
    def __str__(self):
        return self.nombre

class DetalleMusculo(models.Model):
    porcentaje = models.CharField(max_length=5)
    musculo = models.ForeignKey(Musculo, on_delete=models.CASCADE)
    ejercicio = models.ForeignKey(Ejercicios, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.ejercicio.nombre} - {self.musculo.nombre} ({self.porcentaje}%)"

class EjerciciosAsignados(models.Model):
    series = models.IntegerField()
    repeticiones = models.IntegerField()
    sesion = models.ForeignKey(Sesion, on_delete=models.CASCADE)
    ejercicio = models.ForeignKey(Ejercicios, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.ejercicio.nombre} - {self.series}x{self.repeticiones}"
