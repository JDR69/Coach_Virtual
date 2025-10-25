# Asistente Virtual de Entrenamiento Físico y Fisioterapia

El Asistente Virtual es una solución digital integral diseñada para ofrecer acompañamiento personalizado en rutinas de ejercicio y rehabilitación. Su objetivo principal es democratizar el acceso a la guía profesional, permitiendo a los usuarios realizar sus rutinas en casa de forma segura y efectiva.

## Características Clave:

-   **Análisis de Postura en Tiempo Real:** Utiliza visión por computador a través de la biblioteca `@mediapipe/pose` para analizar y corregir la postura del usuario durante los ejercicios, minimizando el riesgo de lesiones.
-   **Interacción Conversacional:** Incorpora una interfaz de chat que permite a los usuarios interactuar con el sistema para recibir instrucciones y resolver dudas.
-   **Plataforma Multi-dispositivo:** El sistema se compone de:
    -   Un **backend** desarrollado en **Python** con el framework **Django** y **Django REST Framework**, que gestiona la lógica de negocio, usuarios, ejercicios y datos.
    -   Un **frontend web** construido con **React**, **Vite** y **Tailwind CSS**, que proporciona la interfaz de usuario principal para la detección de posturas y la gestión de rutinas.
-   **Gestión Personalizada:** Ofrece módulos para administrar sesiones, ejercicios, músculos, objetivos, mediciones y notificaciones, permitiendo una experiencia adaptada al progreso y las metas de cada usuario.

## Importancia:

Este proyecto aborda la necesidad de una guía de ejercicios accesible y precisa, eliminando barreras económicas y geográficas. Al asegurar la correcta ejecución de los movimientos, no solo mejora la efectividad del entrenamiento, sino que también previene lesiones, siendo una herramienta valiosa tanto para la rehabilitación como para el acondicionamiento físico general.