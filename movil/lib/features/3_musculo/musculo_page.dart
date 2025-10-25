import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/category_provider.dart';

class MusculoPage extends StatefulWidget {
  const MusculoPage({Key? key}) : super(key: key);

  @override
  State<MusculoPage> createState() => _MusculoPageState();
}

class _MusculoPageState extends State<MusculoPage> {
  late String _selectedCategory;
  List<String> _selectedMuscles = [];

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

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _selectedCategory =
        Provider.of<CategoryProvider>(context).selectedCategory ?? 'gym';
  }

  void _toggleMuscleSelection(String muscle) {
    setState(() {
      if (_selectedMuscles.contains(muscle)) {
        _selectedMuscles.remove(muscle);
      } else {
        _selectedMuscles.add(muscle);
      }
    });
  }

  void _clearSelection() {
    setState(() {
      _selectedMuscles.clear();
    });
  }

  void _changeCategory() {
    Provider.of<CategoryProvider>(context, listen: false).clearCategory();
    // GoRouter.of(context).go('/select-category'); // Esto se manejará en el redirect de GoRouter
  }

  void _goToExercises() {
    // Implementar navegación a la página de ejercicios con los músculos seleccionados
    print('Navegar a ejercicios con: $_selectedMuscles');
  }

  @override
  Widget build(BuildContext context) {
    final currentMuscleGroups = _muscleGroups[_selectedCategory] ?? [];

    return Scaffold(
      body: Container(
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
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Text(
                    'Elige las zonas de trabajo',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Puedes elegir más de uno. Seleccionados: ${_selectedMuscles.length}',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.white.withOpacity(0.8),
                    ),
                  ),
                  const SizedBox(height: 48),
                  Expanded(
                    child: GridView.builder(
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 16,
                            mainAxisSpacing: 16,
                            childAspectRatio: 2.5,
                          ),
                      itemCount: currentMuscleGroups.length,
                      itemBuilder: (context, index) {
                        final muscle = currentMuscleGroups[index];
                        final isSelected = _selectedMuscles.contains(
                          muscle['name'],
                        );
                        return _MuscleSelectionCard(
                          title: muscle['name']!,
                          subtitle: muscle['description']!,
                          isSelected: isSelected,
                          onTap: () => _toggleMuscleSelection(muscle['name']!),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 48),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
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
                        onPressed: _goToExercises,
                        backgroundColor: Colors.purple[700]!,
                        textColor: Colors.white,
                      ),
                    ],
                  ),
                ],
              ),
            ),
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
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: isSelected
              ? Colors.purple[700]!.withOpacity(0.7)
              : Colors.white.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected
                ? Colors.purple[700]!
                : Colors.white.withOpacity(0.2),
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 12,
                color: Colors.white.withOpacity(0.7),
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
  final VoidCallback onPressed;
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
