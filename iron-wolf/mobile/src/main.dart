import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(IronWolfApp());
}

class IronWolfApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Iron Wolf',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: HomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}