import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ExercisesPage extends StatelessWidget {
  final List<String> groups;
  const ExercisesPage({Key? key, required this.groups}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final exByGroup = {
      'Pecho': ['Press banca', 'Aperturas', 'Flexiones'],
      'Espalda': ['Dominadas', 'Remo', 'Jalón al pecho'],
      'Hombros': ['Press militar', 'Elevaciones laterales', 'Pájaro'],
      'Piernas': ['Sentadilla', 'Peso muerto rumano', 'Zancadas'],
      'Brazos': ['Curl bíceps', 'Fondos', 'Extensiones tríceps'],
      'Core': ['Plancha', 'Crunch', 'Elevación de piernas'],
    };

    final set = <String>{};
    for (final g in groups) {
      set.addAll(exByGroup[g] ?? const <String>[]);
    }
    final exercises = set.toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ejercicios seleccionados'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/musculo'),
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF0F172A), Color(0xFF1E1B4B), Color(0xFF1E1B4B)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: groups
                  .map(
                    (g) => Chip(
                      label: Text(g),
                      backgroundColor: Colors.white10,
                      labelStyle: const TextStyle(color: Colors.white),
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 16),
            ...exercises.map(
              (e) => Card(
                color: Colors.white10,
                child: ListTile(
                  title: Text(e, style: const TextStyle(color: Colors.white)),
                  subtitle: const Text(
                    '3–4 series · 8–12 reps',
                    style: TextStyle(color: Colors.white70),
                  ),
                ),
              ),
            ),
            if (exercises.isEmpty)
              const Padding(
                padding: EdgeInsets.all(24),
                child: Text(
                  'No hay ejercicios configurados todavía.',
                  style: TextStyle(color: Colors.white70),
                ),
              ),
            const SizedBox(height: 12),
            Center(
              child: ElevatedButton(
                onPressed: exercises.isEmpty ? null : () {},
                child: const Text('Entrenar ahora (IA)'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
