import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/auth/auth_provider.dart';
import '../../core/category_provider.dart';
import '../../features/1_auth/login_page.dart';
import '../../features/1_auth/register_page.dart';
import '../../features/2_category/select_category_page.dart';
import '../../features/3_musculo/musculo_page.dart';
import '../widgets/main_layout.dart';

// Placeholder para la página de inicio
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Provider.of<AuthProvider>(context, listen: false).signOut();
            },
          ),
        ],
      ),
      body: const Center(child: Text('Bienvenido')),
    );
  }
}


class AppRouter {
  final AuthProvider authProvider;
  final CategoryProvider categoryProvider;

  AppRouter({required this.authProvider, required this.categoryProvider});

  late final GoRouter router = GoRouter(
    refreshListenable: Listenable.merge([authProvider, categoryProvider]),
    initialLocation: '/login',
    routes: [
      ShellRoute(
        builder: (context, state, child) {
          return MainLayout(child: child);
        },
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const HomePage(),
          ),
          // Otras rutas que usarán el MainLayout
          GoRoute(
            path: '/musculo',
            builder: (context, state) => const MusculoPage(),
          ),
        ],
      ),
      GoRoute(
        path: '/select-category',
        builder: (context, state) => const SelectCategoryPage(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterPage(),
      ),
    ],
    redirect: (BuildContext context, GoRouterState state) {
      final isAuthenticated = authProvider.isAuthenticated;
      final isInitializing = authProvider.initializing || !categoryProvider.isInitialized;
      final onLoginPage = state.matchedLocation == '/login';
      final onRegisterPage = state.matchedLocation == '/register';
      final onSelectCategoryPage = state.matchedLocation == '/select-category';
      final onMusculoPage = state.matchedLocation == '/musculo';

      if (isInitializing) {
        return null;
      }

      if (!isAuthenticated && !onLoginPage && !onRegisterPage) {
        return '/login';
      }

      if (isAuthenticated) {
        if (onLoginPage || onRegisterPage) {
          return categoryProvider.selectedCategory != null ? '/musculo' : '/select-category';
        }
        if (categoryProvider.selectedCategory == null && !onSelectCategoryPage) {
          return '/select-category';
        }
        if (categoryProvider.selectedCategory != null && !onMusculoPage && !onSelectCategoryPage) {
          return '/musculo';
        }
      }

      return null;
    },
  );
}