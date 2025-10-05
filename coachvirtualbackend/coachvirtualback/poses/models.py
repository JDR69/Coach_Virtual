from django.db import models

class PoseTrainingData(models.Model):
    """
    Modelo para almacenar datos de entrenamiento de poses.
    Guarda ejemplos de posturas correctas e incorrectas para entrenar modelos ML.
    """
    ejercicio = models.CharField(max_length=50, help_text="Tipo de ejercicio (flexion, sentadilla, etc.)")
    landmarks = models.JSONField(help_text="Array de puntos clave detectados por BlazePose")
    angulos = models.JSONField(help_text="Diccionario de ángulos calculados (codo, rodilla, espalda, etc.)")
    etiqueta = models.CharField(
        max_length=20, 
        choices=[('correcto', 'Correcto'), ('incorrecto', 'Incorrecto')],
        help_text="Etiqueta de la postura"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'pose_training_data'
        ordering = ['-created_at']
        verbose_name = 'Dato de Entrenamiento de Pose'
        verbose_name_plural = 'Datos de Entrenamiento de Poses'
    
    def __str__(self):
        return f"{self.ejercicio} - {self.etiqueta} ({self.created_at})"
