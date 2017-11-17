=================
Cargografias 
=================
### La línea de tiempo de Funcionarios Polícitcos

Version v.6

<img src="http://40.media.tumblr.com/71df2704f63865f5d42697631e73d4f5/tumblr_nfmcfzeGMG1qeky8ko1_1280.jpg">

[http://www.cargografias.org](http://www.cargografias.org)



Cargografías es una linea de tiempo que muestra los cargos públicos que tuvo cada funcionario a lo largo de su vida. Es una fuente de consulta que busca facilitar el analisis y comprensión de la historia reciente argentina.

La base de datos de Cargografias, fue creada sumando y curando diversas fuentes. No esta completa y se seguira completando y corrigiendo continuamente. Asimismo, la herramienta de visualizacion y consulta, seguira creciendo y agregando funciones.

Cargografías esta siempre dispuesto a corregir, aumentar y editar la base de datos para que la información sea fiel a la realidad y accesible a todos los ciudadanos.


=======================
BUSCAR Y COMPARAR 
=========================
Cargografías aspira a una arquitectura de datos que pueda reflejar, sintetizar y simplificar el entramado gubernamental. Una forma de humanizar esta estructura es a fuerza de nombres y apellidos, partidos, cargos y funciones.


* No es una historia, pero sí un recorrido.
* No es una denuncia, pero sí un dato.
* El eje rector son los funcionarios públicos.
* Los destinatarios, los ciudadanos. 


Cargografías busca agrupar en una sola herramienta, datos publicos que se encuentran dispersos o inaccesibles, para brindarlos a la comunidad.



Requerimientos
==============


### Que software tenes que instalar?


Antes de empezar, asegurate tener los siguientes programas instalados.
* [Node.js]


Setup
=========


### Node.Js - /server
### MongoDB 

### Como empezar?

* Instala todas las librerias. Utilizando el comando

```bash
$ npm install
```
 en la carpeta principal del repositorio.  

* Bajate la base de datos de tu instancia con el cargografias-loader

https://github.com/cargografias/cargografias-loader


* Crea un archivo .env en tu root, Podes utilizar .env.example como guia.
```text
MONGO_URL=mongodb://localhost/cargo
PORT=3001
BASE_STATIC_PATH=//localhost:3002
```

* Inicia el servidor nodejs utilizando el comando

```bash
$  node server.js 
```

* En otra consola, inicia el servidor de archivos estaticos 

```bash
$  node static-local.js
```

* Abri tu navegador en 'http://localhost:3001' y navega.



PLANES FUTUROS 
========================

- Mejorar la interfase y la performance del sitio 
- Sumar otras fuentes de datos (DDJJ de La Nacion Data, por ej) 
- Conseguir financiación para pagar gastos (hosting, galletitas, horas de programadores) 
- Mostrar las Bio de los funcionarios (fechas, foto, CV) 
- Relacionar los cargos por bloques y votaciones (Década Votada) 
- Visualizar los partidos y frentes políticos 
- Liberar nuestros datos, y hacer una API de consulta 
 -Permitir al visitante corregir datos o aportar nuevos facilmente 

[¿Tenés mas ideas? ¿Ganas de sumarte? Contactanos aqui]
(https://docs.google.com/forms/d/1NoOYENvhHXqpLO3WpB8l6R8ofJkJiShLlx2A_DfrNd0/viewform)


Active Collaborators
=======
* [Andres Snitcofsky] 
* [Martín Rabaglia @ Genosha] 
* [Manu Paiva @ Genosha]
* [Ezequiel Romero @ Genosha]


Past Collaborators
=========
* [Palamago]
* [Daniel Calligaro]


