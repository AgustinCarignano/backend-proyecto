# API de Ecommerce

Esta API Rest es parte de mi proyecto final para la carrera de Desarrollador Full Stack. Está desarrollada en Node.js utilizando el framework Express y varias librerías como JsonWebToken, Bcrypt, MongoDB, MongoSession y Passport, entre otras.

## Descripción del proyecto

El objetivo de este proyecto es desarrollar una API para un sistema de Ecommerce que permite a los usuarios crear una cuenta, navegar por los productos disponibles, ver los detalles de cada producto, agregar al carrito y simular un proceso de compra, generando un ticket.

Además, se implementa un sistema de usuarios con dos niveles: nivel básico y nivel premium. Los usuarios tienen la posibilidad de cargar información adicional para ascender al nivel premium y así poder poner productos a la venta.

Para la prueba de funcionalidades, a pesar de no ser el objetivo principal del proyeto, se desarrollaron vistas básicas utilizando el motor de plantillas Handlebars, y se implementa tambien una prueba de chat utilizando servidores sockets.

## Funcionalidades principales

- Registro de usuarios: Los usuarios pueden crear una cuenta en la plataforma.
- Autenticación y autorización: Se utiliza Passport para el registro de usuarios y sistema de login, basado en sesiones (cookie en navegador + session en Mongo), y se utilizan varios middlewares para controlar el acceso a los diferentes recursos.
- Navegación de productos: Los usuarios pueden ver la lista de productos disponibles y los detalles de cada uno.
- Carrito de compras: Los usuarios pueden agregar productos al carrito y gestionar su compra.
- Proceso de compra: Se simula el proceso de compra generando un ticket de compra al finalizar la transacción.
- Gestion de la cuenta para cada usuario: Ver productos propios, tickets de compras anteriores, posibilidad de modificar el nivel de ususario o eliminar la cuenta y los documentos asociados.

## Instalación

1. Clona este repositorio en tu máquina local.
2. Ejecuta `npm install` para instalar todas las dependencias.
3. Crea un archivo `.env` en la raíz del proyecto y configura las variables de entorno necesarias, como la conexión a la base de datos y las claves de encriptación.
4. Ejecuta `npm start` para iniciar el servidor.

## Documentación de la API

Una documentacion parcial puede encontrarse en la ruta `/api/docs`.

## Autor

Agustín Carignano

## Profesor:

Farid Sesin
