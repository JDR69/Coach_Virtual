import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class MainLayout extends StatelessWidget {
  final Widget child;
  const MainLayout({required this.child, Key? key}) : super(key: key);

  /// Pestañas y rutas (ajústalas si cambias tus rutas)
  /// - Home:     "/"
  /// - Perfil:   "/profile" (si aún no existe, mostramos SnackBar)
  /// - Planes:   "/musculo" (ya existe en tu AppRouter)
  static const List<_TabItem> _tabs = <_TabItem>[
    _TabItem(path: '/', icon: Icons.home, label: 'Home'),
    _TabItem(path: '/profile', icon: Icons.person, label: 'Perfil'),
    _TabItem(path: '/musculo', icon: Icons.fitness_center, label: 'Planes'),
  ];

  /// Determina el índice activo según la URL actual
  int _indexFromLocation(String location) {
    // Normalizamos: si la ruta empieza con el path de la pestaña, la consideramos activa
    final idx = _tabs.indexWhere(
      (t) => location == t.path || location.startsWith('${t.path}/'),
    );
    if (idx != -1) return idx;

    // Fallback: si no matchea nada, vuelve a Home
    return 0;
  }

  /// Intenta navegar a la pestaña i; si la ruta no existe, muestra SnackBar (no crashea)
  void _onTap(BuildContext context, int i) {
    final dest = _tabs[i].path;

    // Si la pestaña es Perfil y aún no tienes esa ruta, solo mostramos un aviso y salimos.
    if (dest == '/profile') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('La sección Perfil estará disponible pronto.'),
        ),
      );
      return;
    }

    // Para Home ("/") y Planes ("/musculo") navegamos normal
    context.go(dest);
  }

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    final currentIndex = _indexFromLocation(location);

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (i) => _onTap(context, i),
        items: _tabs
            .map(
              (t) =>
                  BottomNavigationBarItem(icon: Icon(t.icon), label: t.label),
            )
            .toList(),
      ),
    );
  }
}

class _TabItem {
  final String path;
  final IconData icon;
  final String label;
  const _TabItem({required this.path, required this.icon, required this.label});
}
