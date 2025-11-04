import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/category_provider.dart';

class MusculoPage extends StatefulWidget {
  const MusculoPage({Key? key}) : super(key: key);

  @override
  State<MusculoPage> createState() => _MusculoPageState();
}

class _MusculoPageState extends State<MusculoPage> {
  final List<String> _selectedMuscles = [];

  // Catálogo de grupos musculares según la categoría
  final Map<String, List<Map<String, String>>> _muscleGroups = {
    'gym': [
      {'name': 'Pecho', 'description': 'Ejercicios y series recomendadas.'},
      {'name': 'Espalda', 'description': 'Ejercicios y series recomendadas.'},
      {'name': 'Hombros', 'description': 'Ejercicios y series recomendadas.'},
      {'name': 'Piernas', 'description': 'Ejercicios y series recomendadas.'},
      {'name': 'Brazos', 'description': 'Ejercicios y series recomendadas.'},
      {'name': 'Core', 'description': 'Ejercicios y series recomendadas.'},
    ],
    'fisio': [
      {'name': 'Cuello', 'description': 'Ejercicios de rehabilitación.'},
      {'name': 'Hombro', 'description': 'Ejercicios de rehabilitación.'},
      {'name': 'Codo', 'description': 'Ejercicios de rehabilitación.'},
      {'name': 'Muñeca y Mano', 'description': 'Ejercicios de rehabilitación.'},
      {'name': 'Espalda Baja', 'description': 'Ejercicios de rehabilitación.'},
      {'name': 'Cadera', 'description': 'Ejercicios de rehabilitación.'},
      {'name': 'Rodilla', 'description': 'Ejercicios de rehabilitación.'},
      {'name': 'Tobillo y Pie', 'description': 'Ejercicios de rehabilitación.'},
    ],
  };

  void _toggleMuscleSelection(String muscle) {
    setState(() {
      _selectedMuscles.contains(muscle)
          ? _selectedMuscles.remove(muscle)
          : _selectedMuscles.add(muscle);
    });
  }

  void _clearSelection() => setState(_selectedMuscles.clear);

  void _changeCategory() {
    // Limpia categoría; el redirect del GoRouter te llevará a /select-category
    context.read<CategoryProvider>().clearCategory();
  }

  void _goToExercises() {
    // Aquí navegas a tu pantalla de ejercicios, enviando la selección
    // Por ahora sólo imprime.
    // Ejemplo si usas GoRouter: context.go('/ejercicios', extra: _selectedMuscles);
    // Ajusta según tu ruteo real.
    // ignore: avoid_print
    print('Navegar a ejercicios con: $_selectedMuscles');
  }

  @override
  Widget build(BuildContext context) {
    // Lee la categoría en vivo; si no existe, usa 'gym' por defecto
    final selectedCategory =
        context.watch<CategoryProvider>().selectedCategory ?? 'gym';
    final currentMuscleGroups = _muscleGroups[selectedCategory] ?? [];

    return Scaffold(
      body: SafeArea(
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Colors.blue[900]!,
                Colors.purple[900]!,
                Colors.indigo[900]!,
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),

          child: LayoutBuilder(
            builder: (context, constraints) {
              // Responsive 2 columnas en móvil, 3 en pantallas grandes
              final width = constraints.maxWidth;
              final cross = width >= 900 ? 3 : 2;
              // Altura fija por tile para evitar overflow
              // Sube/baja estos valores si quieres más/menos aire.
              final double tileHeight = width >= 600 ? 126 : 122;

              return Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 600),
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      children: [
                        // ---- Cabecera ----
                        const Text(
                          'Elige las zonas de trabajo',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Puedes elegir más de uno. Seleccionados: ${_selectedMuscles.length}',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.white.withOpacity(0.8),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // ---- Grid scrollable ----
                        Expanded(
                          child: GridView.builder(
                            padding: const EdgeInsets.only(bottom: 8),
                            gridDelegate:
                                SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: cross,
                                  crossAxisSpacing: 16,
                                  mainAxisSpacing: 16,
                                  mainAxisExtent: tileHeight,
                                ),
                            itemCount: currentMuscleGroups.length,
                            itemBuilder: (context, index) {
                              final muscle = currentMuscleGroups[index];
                              final name = muscle['name']!;
                              final isSelected = _selectedMuscles.contains(
                                name,
                              );
                              return _MuscleSelectionCard(
                                title: name,
                                subtitle: muscle['description']!,
                                isSelected: isSelected,
                                onTap: () => _toggleMuscleSelection(name),
                              );
                            },
                          ),
                        ),

                        const SizedBox(height: 12),
                        // ---- Acciones inferiores (sin overflow) ----
                        Wrap(
                          alignment: WrapAlignment.center,
                          spacing: 12,
                          runSpacing: 12,
                          children: [
                            _ActionButton(
                              text: 'Cambiar categoría',
                              onPressed: _changeCategory,
                              backgroundColor: Colors.white.withOpacity(0.1),
                              textColor: Colors.white,
                            ),
                            _ActionButton(
                              text: 'Limpiar selección',
                              onPressed: _clearSelection,
                              backgroundColor: Colors.white.withOpacity(0.1),
                              textColor: Colors.white,
                            ),
                            _ActionButton(
                              text: 'Siguiente',
                              onPressed: _selectedMuscles.isEmpty
                                  ? null
                                  : _goToExercises,
                              backgroundColor: _selectedMuscles.isEmpty
                                  ? Colors.white.withOpacity(0.2)
                                  : Colors.purple[700]!,
                              textColor: Colors.white,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

class _MuscleSelectionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool isSelected;
  final VoidCallback onTap;

  const _MuscleSelectionCard({
    required this.title,
    required this.subtitle,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        height: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: isSelected
              ? LinearGradient(
                  colors: [
                    Colors.blue.shade600.withOpacity(0.7),
                    Colors.purple.shade600.withOpacity(0.7),
                  ],
                )
              : null,
          color: isSelected ? null : Colors.white.withOpacity(0.10),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: Colors.white.withOpacity(isSelected ? 0.30 : 0.20),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.20),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),

        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cabecera: título + “check”
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),

                AnimatedContainer(
                  duration: const Duration(milliseconds: 150),
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: isSelected ? Colors.white : Colors.transparent,
                    border: Border.all(
                      color: Colors.white.withOpacity(0.45),
                      width: 2,
                    ),
                  ),
                  child: isSelected
                      ? const Icon(Icons.check, size: 16, color: Colors.purple)
                      : null,
                ),
              ],
            ),

            Text(
              subtitle,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 13,
                color: Colors.white.withOpacity(0.75),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final Color backgroundColor;
  final Color textColor;

  const _ActionButton({
    required this.text,
    required this.onPressed,
    required this.backgroundColor,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: backgroundColor,
        foregroundColor: textColor,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: textColor.withOpacity(0.5)),
        ),
        elevation: 3,
      ),
      child: Text(text, style: const TextStyle(fontSize: 16)),
    );
  }
}
