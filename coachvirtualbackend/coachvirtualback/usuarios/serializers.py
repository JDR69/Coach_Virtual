from rest_framework import serializers
from .models import Usuario, Alertas


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'fecha_nacimiento', 'genero', 'altura', 'peso', 'password'
        ]
        extra_kwargs = {'email': {'required': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario(**validated_data)
        user.set_password(password or Usuario.objects.make_random_password())
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class AlertasSerializer(serializers.ModelSerializer):
    """
    - `usuario`: solo lectura; se toma del request.user.
    - `fecha`: se pasa manualmente desde el body.
    - `estado`: opcional, default=True si no se manda.
    """
    class Meta:
        model = Alertas
        fields = ['id', 'mensaje', 'fecha', 'estado', 'usuario']
        read_only_fields = ['usuario']   # <- solo usuario es de solo lectura
        extra_kwargs = {
            'estado': {'required': False}  # <- no es obligatorio en POST
        }

    def create(self, validated_data):
        # asignar automáticamente el dueño
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['usuario'] = request.user
        return super().create(validated_data)
