"""
Django management command para poblar la base de datos con datos iniciales de músculos, ejercicios y detalles.
Basado en BD_MUSCULOS.md

Uso:
    python manage.py seed_musculos
    python manage.py seed_musculos --clear  # Borra datos existentes primero
"""
from django.core.management.base import BaseCommand
from musculos.models import Musculo, Ejercicio, DetalleMusculo, Tipo


class Command(BaseCommand):
    help = 'Poblar base de datos con datos iniciales de músculos, ejercicios y detalles'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Eliminar todos los datos existentes antes de insertar',
        )

    def handle(self, *args, **options):
        self.stdout.write("=" * 60)
        self.stdout.write(self.style.SUCCESS("🚀 INICIANDO POBLACIÓN DE BASE DE DATOS"))
        self.stdout.write("=" * 60)
        
        if options['clear']:
            self.clear_data()
        
        self.seed_tipos()
        self.seed_musculos()
        self.seed_ejercicios()
        self.seed_detalles()
        
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(self.style.SUCCESS("✅ POBLACIÓN COMPLETADA"))
        self.stdout.write("=" * 60)
        self.stdout.write("\n📊 Resumen:")
        self.stdout.write(f"  - Tipos: {Tipo.objects.count()}")
        self.stdout.write(f"  - Músculos: {Musculo.objects.count()}")
        self.stdout.write(f"  - Ejercicios: {Ejercicio.objects.count()}")
        self.stdout.write(f"  - Detalles: {DetalleMusculo.objects.count()}")
        self.stdout.write("")

    def clear_data(self):
        """Elimina todos los datos existentes"""
        self.stdout.write("\n🗑️  Limpiando datos existentes...")
        DetalleMusculo.objects.all().delete()
        Ejercicio.objects.all().delete()
        Musculo.objects.all().delete()
        Tipo.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("✅ Datos eliminados"))

    def seed_tipos(self):
        """Inserta los tipos de ejercicio"""
        self.stdout.write("\n📝 Insertando tipos...")
        tipos_data = [
            {'id': 1, 'nombre': 'Principal', 'estado': True},
            {'id': 2, 'nombre': 'Secundario', 'estado': True},
        ]
        
        for tipo_data in tipos_data:
            tipo, created = Tipo.objects.get_or_create(
                id=tipo_data['id'],
                defaults={
                    'nombre': tipo_data['nombre'],
                    'estado': tipo_data['estado']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"  ✓ Tipo creado: {tipo.nombre}"))
            else:
                self.stdout.write(self.style.WARNING(f"  ⚠ Tipo ya existe: {tipo.nombre}"))

    def seed_musculos(self):
        """Inserta los músculos"""
        self.stdout.write("\n💪 Insertando músculos...")
        musculos_data = [
            {'id': 4, 'nombre': 'Espalda', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763604770/plwajctd1bmiaz7tc9ai.png'},
            {'id': 5, 'nombre': 'Pectorales', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763604900/lozehp9xse2jk0bebq74.png'},
            {'id': 6, 'nombre': 'Abdominales', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763604953/pawh9dn24zfrpchfag8g.png'},
            {'id': 7, 'nombre': 'Brazos', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763604987/sektsdmnzjrzrdb1ziyl.png'},
            {'id': 8, 'nombre': 'Piernas', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763605250/lko0ysnyhslnmixk4le9.png'},
            {'id': 9, 'nombre': 'Rodilla', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763605419/dq0vqy6dcggcenypviqj.png'},
        ]
        
        for musculo_data in musculos_data:
            musculo, created = Musculo.objects.get_or_create(
                id=musculo_data['id'],
                defaults={
                    'nombre': musculo_data['nombre'],
                    'url': musculo_data['url']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"  ✓ Músculo creado: {musculo.nombre}"))
            else:
                self.stdout.write(self.style.WARNING(f"  ⚠ Músculo ya existe: {musculo.nombre}"))

    def seed_ejercicios(self):
        """Inserta los ejercicios"""
        self.stdout.write("\n🏋️  Insertando ejercicios...")
        ejercicios_data = [
            {'id': 3, 'nombre': 'Remo sentado en máquina', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763608918/rmbx2k6sjjuw6puwejwk.gif', 'estado': True},
            {'id': 4, 'nombre': 'Remo con mancuernas', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763608975/mhhvbnw6vvi33d6bxcqz.gif', 'estado': True},
            {'id': 5, 'nombre': 'Remo sentado en polea baja', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763609058/ucq1yvu64owemhcaojih.gif', 'estado': True},
            {'id': 6, 'nombre': 'Remo unilateral de pie en polea', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763609107/goqpdjoplofvfijya6kx.gif', 'estado': True},
            {'id': 7, 'nombre': 'Flexiones', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763609718/vxovdtgeio24tphfqxgs.gif', 'estado': True},
            {'id': 8, 'nombre': 'Press de banca con mancuernas', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763609767/rqggibhnjqpt77mqmmu6.gif', 'estado': True},
            {'id': 9, 'nombre': 'Aperturas inclinadas con mancuernas', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763609864/g9dyvja3tsal4fvtyvqb.gif', 'estado': True},
            {'id': 10, 'nombre': 'Press inclinado con mancuernas', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763609903/wk6abpvgkec6vndgypto.gif', 'estado': True},
            {'id': 11, 'nombre': 'Aperturas en máquina Mariposa', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763610163/n6s6rehxkgiwiwxltgj.gif', 'estado': True},
            {'id': 12, 'nombre': 'Plancha', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763610214/robowud7tp0tnsomju7n.gif', 'estado': True},
            {'id': 13, 'nombre': 'Elevación de piesrnas en el suelo', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763610227/ga5myoe1c7rvnlsdjisp.gif', 'estado': True},
            {'id': 14, 'nombre': 'Elevación de piernas en banco', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763610319/unwmijpgd0km2qarqvhq.gif', 'estado': True},
            {'id': 15, 'nombre': 'Curl de bíceps con mancuernas de pie', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763610353/jlyeogqte2xi1hvxdwtg.gif', 'estado': True},
            {'id': 16, 'nombre': 'Remo inclinado con mancuernas', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763610423/gz7onxfhrhuuechwsp5p.gif', 'estado': True},
            {'id': 17, 'nombre': 'Sentadilla Hack', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763610458/diuthklvq2yd6tqcflz1.gif', 'estado': True},
            {'id': 18, 'nombre': 'Prensa de piernas', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763610518/ptdtxoykgv3ngji3bqca.gif', 'estado': True},
            {'id': 19, 'nombre': 'Elevación de talones con barra', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763610552/i2dwa1ihjuhbj1yyy799.gif', 'estado': True},
            {'id': 20, 'nombre': 'Zancadas con mancuernas', 'url': 'https://res.cloudinary.com/dwerzrgya/image/upload/v1763610615/u8wsrsqh0sxhb9d6no93.gif', 'estado': True},
        ]
        
        for ejercicio_data in ejercicios_data:
            ejercicio, created = Ejercicio.objects.get_or_create(
                id=ejercicio_data['id'],
                defaults={
                    'nombre': ejercicio_data['nombre'],
                    'url': ejercicio_data['url'],
                    'estado': ejercicio_data['estado']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"  ✓ Ejercicio creado: {ejercicio.nombre}"))
            else:
                self.stdout.write(self.style.WARNING(f"  ⚠ Ejercicio ya existe: {ejercicio.nombre}"))

    def seed_detalles(self):
        """Inserta los detalles de músculo-ejercicio"""
        self.stdout.write("\n🔗 Insertando detalles músculo-ejercicio...")
        detalles_data = [
            {'id': 1, 'porcentaje': '85', 'idEjercicio_id': 3, 'idMusculo_id': 4, 'idTipo_id': 2},
            {'id': 2, 'porcentaje': '80', 'idEjercicio_id': 4, 'idMusculo_id': 4, 'idTipo_id': 2},
            {'id': 3, 'porcentaje': '85', 'idEjercicio_id': 5, 'idMusculo_id': 4, 'idTipo_id': 2},
            {'id': 4, 'porcentaje': '80', 'idEjercicio_id': 6, 'idMusculo_id': 4, 'idTipo_id': 2},
            {'id': 5, 'porcentaje': '70', 'idEjercicio_id': 7, 'idMusculo_id': 5, 'idTipo_id': 2},
            {'id': 6, 'porcentaje': '75', 'idEjercicio_id': 8, 'idMusculo_id': 5, 'idTipo_id': 2},
            {'id': 7, 'porcentaje': '90', 'idEjercicio_id': 9, 'idMusculo_id': 5, 'idTipo_id': 2},
            {'id': 8, 'porcentaje': '70', 'idEjercicio_id': 10, 'idMusculo_id': 5, 'idTipo_id': 2},
            {'id': 9, 'porcentaje': '95', 'idEjercicio_id': 11, 'idMusculo_id': 5, 'idTipo_id': 2},
            {'id': 10, 'porcentaje': '100', 'idEjercicio_id': 12, 'idMusculo_id': 6, 'idTipo_id': 2},
            {'id': 11, 'porcentaje': '80', 'idEjercicio_id': 13, 'idMusculo_id': 6, 'idTipo_id': 2},
            {'id': 12, 'porcentaje': '85', 'idEjercicio_id': 14, 'idMusculo_id': 6, 'idTipo_id': 2},
            {'id': 13, 'porcentaje': '95', 'idEjercicio_id': 15, 'idMusculo_id': 7, 'idTipo_id': 2},
            {'id': 14, 'porcentaje': '90', 'idEjercicio_id': 17, 'idMusculo_id': 8, 'idTipo_id': 2},
            {'id': 15, 'porcentaje': '90', 'idEjercicio_id': 18, 'idMusculo_id': 8, 'idTipo_id': 2},
            {'id': 16, 'porcentaje': '100', 'idEjercicio_id': 19, 'idMusculo_id': 8, 'idTipo_id': 2},
            {'id': 17, 'porcentaje': '90', 'idEjercicio_id': 20, 'idMusculo_id': 8, 'idTipo_id': 2},
            {'id': 18, 'porcentaje': '90', 'idEjercicio_id': 3, 'idMusculo_id': 4, 'idTipo_id': 1},
            {'id': 19, 'porcentaje': '85', 'idEjercicio_id': 5, 'idMusculo_id': 4, 'idTipo_id': 1},
            {'id': 20, 'porcentaje': '80', 'idEjercicio_id': 6, 'idMusculo_id': 4, 'idTipo_id': 1},
            {'id': 21, 'porcentaje': '90', 'idEjercicio_id': 18, 'idMusculo_id': 8, 'idTipo_id': 1},
            {'id': 22, 'porcentaje': '100', 'idEjercicio_id': 19, 'idMusculo_id': 8, 'idTipo_id': 1},
            {'id': 23, 'porcentaje': '80', 'idEjercicio_id': 20, 'idMusculo_id': 8, 'idTipo_id': 1},
            {'id': 24, 'porcentaje': '100', 'idEjercicio_id': 12, 'idMusculo_id': 6, 'idTipo_id': 1},
            {'id': 25, 'porcentaje': '70', 'idEjercicio_id': 13, 'idMusculo_id': 6, 'idTipo_id': 1},
            {'id': 26, 'porcentaje': '90', 'idEjercicio_id': 11, 'idMusculo_id': 5, 'idTipo_id': 1},
            {'id': 27, 'porcentaje': '60', 'idEjercicio_id': 7, 'idMusculo_id': 5, 'idTipo_id': 1},
            {'id': 28, 'porcentaje': '90', 'idEjercicio_id': 15, 'idMusculo_id': 7, 'idTipo_id': 1},
        ]
        
        for detalle_data in detalles_data:
            try:
                detalle, created = DetalleMusculo.objects.get_or_create(
                    id=detalle_data['id'],
                    defaults={
                        'porcentaje': detalle_data['porcentaje'],
                        'idEjercicio_id': detalle_data['idEjercicio_id'],
                        'idMusculo_id': detalle_data['idMusculo_id'],
                        'idTipo_id': detalle_data['idTipo_id']
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"  ✓ Detalle creado: ID {detalle.id}"))
                else:
                    self.stdout.write(self.style.WARNING(f"  ⚠ Detalle ya existe: ID {detalle.id}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  ❌ Error al crear detalle ID {detalle_data['id']}: {e}"))
