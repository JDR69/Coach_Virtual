import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/auth/token_storage.dart';
import 'endpoints.dart';

class ApiClient {
  final http.Client _client;

  ApiClient({http.Client? client}) : _client = client ?? http.Client();

  Future<http.Response> get(String path, {Map<String, String>? headers}) async {
    final uri = Uri.parse('${Endpoints.apiBaseUrl}$path');
    final allHeaders = await _getHeaders(headers);
    return _client.get(uri, headers: allHeaders);
  }

  Future<http.Response> post(String path, {Map<String, String>? headers, Object? body}) async {
    final uri = Uri.parse('${Endpoints.apiBaseUrl}$path');
    final allHeaders = await _getHeaders(headers);
    return _client.post(uri, headers: allHeaders, body: jsonEncode(body));
  }

  Future<http.Response> put(String path, {Map<String, String>? headers, Object? body}) async {
    final uri = Uri.parse('${Endpoints.apiBaseUrl}$path');
    final allHeaders = await _getHeaders(headers);
    return _client.put(uri, headers: allHeaders, body: jsonEncode(body));
  }

  Future<http.Response> delete(String path, {Map<String, String>? headers}) async {
    final uri = Uri.parse('${Endpoints.apiBaseUrl}$path');
    final allHeaders = await _getHeaders(headers);
    return _client.delete(uri, headers: allHeaders);
  }

  Future<Map<String, String>> _getHeaders(Map<String, String>? additionalHeaders) async {
    final headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };

    final token = await TokenStorage.getAccessToken();
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }

    if (additionalHeaders != null) {
      headers.addAll(additionalHeaders);
    }

    return headers;
  }
}