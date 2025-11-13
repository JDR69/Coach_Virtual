from django.db import models


class Musculo(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    nombre = models.CharField(max_length=255)
    url = models.URLField()

    def __str__(self):
        return str(self.nombre)


class DetalleMusculo(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    porcentaje = models.CharField(max_length=255)
    idMusculo = models.ForeignKey(Musculo, on_delete=models.CASCADE)
    idEjercicio = models.ForeignKey('Ejercicio', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id)


class Ejercicio(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    nombre = models.CharField(max_length=255)
    url = models.URLField(blank=True, default='')
    estado = models.BooleanField()

    def __str__(self):
        return str(self.nombre)


class EjercicioAsignado(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    series = models.IntegerField()
    repeticiones = models.IntegerField()

    def __str__(self):
        return str(self.id)
