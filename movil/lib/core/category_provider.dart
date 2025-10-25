import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CategoryProvider with ChangeNotifier {
  static const _categoryKey = 'selected_category';

  String? _selectedCategory;
  bool _isInitialized = false;

  CategoryProvider() {
    _loadCategory();
  }

  String? get selectedCategory => _selectedCategory;
  bool get isInitialized => _isInitialized;

  Future<void> _loadCategory() async {
    final prefs = await SharedPreferences.getInstance();
    _selectedCategory = prefs.getString(_categoryKey);
    _isInitialized = true;
    notifyListeners();
  }

  Future<void> chooseCategory(String category) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_categoryKey, category);
    _selectedCategory = category;
    notifyListeners();
  }

  Future<void> clearCategory() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_categoryKey);
    _selectedCategory = null;
    notifyListeners();
  }
}