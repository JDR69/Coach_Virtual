# musculos/models.py
from django.db import models


class Tipo(models.Model):
    nombre = models.CharField(max_length=255)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return str(self.nombre)


class Musculo(models.Model):
    nombre = models.CharField(max_length=255)
    url = models.URLField()

    def __str__(self):
        return str(self.nombre)


class Ejercicio(models.Model):
    nombre = models.CharField(max_length=255)
    url = models.URLField(blank=True, default="")
    estado = models.BooleanField(default=True)

    def __str__(self):
        return str(self.nombre)


class DetalleMusculo(models.Model):
    porcentaje = models.CharField(max_length=255)
    idMusculo = models.ForeignKey(Musculo, on_delete=models.CASCADE)
    idEjercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE)
    # 🔹 Nuevo: referencia al tipo
    idTipo = models.ForeignKey(Tipo, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.idMusculo} - {self.idEjercicio} ({self.porcentaje}) - {self.idTipo}"


class EjercicioAsignado(models.Model):
    idDetalleMusculo = models.ForeignKey(
        DetalleMusculo,
        on_delete=models.CASCADE,
        related_name='ejercicios_asignados',
    )
    series = models.IntegerField()
    repeticiones = models.IntegerField()

    def __str__(self):
        return f"{self.series}x{self.repeticiones} (Detalle {self.idDetalleMusculo_id})"
