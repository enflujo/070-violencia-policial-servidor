<h1 align="center">
  Datasheet Server
</h1>

<p align="center">
  <strong>Convierte los datos de una hoja de cálculo en una API dinámica y estructurada. </strong><br>
</p>
<p align="center">
  <a href="https://github.com/forensic-architecture/datasheet-server/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Datasheet Server is released under the MIT license." />
  </a>
  <a href="https://travis-ci.com/forensic-architecture/datasheet-server">
    <img src="https://travis-ci.com/forensic-architecture/datasheet-server.svg?branch=develop" alt="Build Status"/>
  </a>
</p>

<h3 align="center">
  <a href="#usar-este-repositorio">Usar este repositorio</a>
</h3>

Datasheet server hace que los recursos de una hoja de cálculo estén disponibles como una API estructurada.

- **Gestor de datos estructurados**. Permite que cualquier persona administre datos dinámicamente y hace que estos estén disponibles en un formato estructurado que puede usarse en interfaces frontend y otras aplicaciones.
- **Diseñado para un flujo de trabajo dinámico**. Hace referencia a datos en una hoja de cálculo y agrega una capa de direccionamiento indirecto que evita que las rutas de la API se interrumpan cuando se realizan cambios.
- **Transformación de datos personalizable**. Permite crear nuevos "blueprints" para especificar la estructura de la API a partir de los datos de origen.
- **Arquitectura extensible**. Actualmente es compatible con Google Sheet como fuente y con un lenguaje de consulta similar a REST, pero estructurado de forma modular con la intención de admitir otras fuentes y lenguajes de consulta.

## Datasheer server

Datasheet server es un servidor Node desarrollado en [Forensic Architecture](https://forensic-architecture.org) para hacer que los datos que los investigadores están modificando dinámicamente se puedan consumir simultáneamente en aplicaciones programáticas como una API. Permite que los datos estén disponibles a través de queries estructurados para aplicaciones web frontend, motores de juego, entre otros.

Consultar datos directamente desde hojas de cálculo es frágil, pues depende del mantenimiento de una estructura rígida en las hojas. Al poner Datasheet Server como un proxy entre las hojas de origen y sus consumidores, es posible modificar las hojas de forma dinámica sin dañar las aplicaciones. Un administrador de datos puede usar Datasheet Server para asegurarse de que las aplicaciones siempre reciban datos elegibles, sin renunciar a las hojas de cálculo como fuentes.

Para ver cómo ejecutar una instancia local del servidor de hojas de datos, consulte [esta wiki (ENG)](https://github.com/forensic-architecture/timemap/wiki/running-timemap-and-datasheet-server-locally) que explica cómo usarlo para alimentar datos de una hoja de Google a una instancia local de [Timemap](https://github.com/enflujo/timemap).

#### [Fuentes](#fuentes)

Las fuentes se especifican en [src/config.js](https://github.com/enflujo/datasheet-server/blob/develop/src/config.js). ACtualmente Datasheet server solo soporta como fuentes hojas de cálculo de Google.

###### [Hojas de cálculo de Google]

| sheets | Una lista de objectos, uno por cada hoja [sheet] que se use como fuente. Cada objeto _sheet_ tiene un `nombre` (String), un `id` (String), y un campo `tabs` (objecto), que se explican a continuación. | objecto |

Cada hoja de cálculo de Google Sheet usada como fuente requiere un objeto correspondiente en `sheets`. El objecto debe estar estructurado de la siguiente manera:

| Opción  | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Tipo   |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| nombre  | Usado para para hacer referencia a los datos proporcionados desde esta fuente                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | string |
| ruta/id | La ruta a la hoja XLSX en su servidor local, o el ID de la hoja en Google. (Puede encontrarlo en la barra de direcciones cuando la Hoja está abierta en un navegador. Es la cadena que sigue a 'spreadsheets/d/').                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | string |
| tabs    | Un objeto que mapea cada pestaña en la fuente a uno o más Blueprinters. Todos los Blueprinters en la [carpeta blueprinters](/lib/blueprinters) están disponibles a través de una sola importación como en la parte superior de [example.config.js](/src/example.config.js). <br> Para asociar correctamente un Blueprinter, el objeto _key_ debe ser _el nombre de la pestaña con todas las letras minúsculas y los espacios reemplazados por un '-'_. Por ejemplo, si el nombre de la pestaña en la hoja de cálculo de Google Sheets es 'Info Sobre SHEEP', el objeto _key_ debería ser'info-sobre-sheep'. <br> El valor debe ser la función Blueprinter que desea utilizar para los datos en esa pestaña. Si necesita más de un endpoint para una sola pestaña, puede tener múltiples blueprinters haciendo que el elemento sea un array. | object |

Vea src/config.js para ver una hoja de configuración de ejemplo.

## [Usar este repositorio](#quickstart)

Para usar este repositorio por primera vez de forma local:

### Correr localmente

1. Clonar el repositorio

```
git clone https://github.com/enflujo/datasheet-server.git
```

2. Instalar las dependencias en la carpeta local del repositorio usando yarn o npm:

```sh
yarn # npm install
```

3. Ejecutar el servidor de desarrollo:

```sh
yarn dev # npm run dev
```

### Correr con Docker

Para crear una nueva instancia del servidor con [Docker](https://www.docker.com/) instalado, siga los pasos de la guía anterior, y después cree una imagen localmente. (Docker debe estar instalado):

```sh
docker build -t datasheet-server .
```

Luego puede ejecutar el contenedor y poner a disposición el puerto correspondiente. (`4040` por defecto):

```sh
docker run -d -p 4040:4040 datasheet-server
```

Si se ejecuta en un servidor en la nube, probablemente necesitará poner ceros a la IP del host:

```sh
docker run -d -p 0.0.0.0:4040:4040 datasheet-server
```

### Publicar en un servidor externo

1. Seguir las instrucciones de [### correr localmente](#quickstart) pero estando conectadx al servidor externo.

2. Instalar PM2

```sh
yarn global add pm2 # npm install pm2@latest -g
```

3. Preparar la aplicación

```sh
yarn build # npm run build
```

4. Lanzar la aplicación

```sh
pm2 start VIOLENCIA-POLICIAL  # pm2 start <nombre_de_la_app>
```

### Reiniciar en un servidor externo

Si se realizan cambios en la aplicación o es necesario reiniciarla:

1. Actualizar el repositorio en el servidor (git pull).

2. Detener la aplicación

```sh
pm2 stop VIOLENCIA-POLICIAL  # pm2 stop <nombre_de_la_app>
```

3. Preparar la nueva versión de la aplicación

```sh
yarn build # npm run build
```

4. Reiniciar la aplicación

```sh
pm2 restart VIOLENCIA-POLICIAL  # pm2 restart <nombre_de_la_app>
```

5. Salir del servidor

```sh
exit
```

## Contribuir

### [Código de Conducta (ENG)](CODE_OF_CONDUCT.md)

Queremos y trabajamos por una comunidad inclusiva y respetuosa alrededor de la programación creativa. Antes de contribuir al repositorio original por favor leer el código de conducta de Forensic Architecture.

### [Guía de contribución al repositorio original (ENG)](CONTRIBUTING.md)

Guía sobre el proceso de desarrollo de Forensic Architecture.

## License

Datasheet Server es distribuido bajo [Licencia MIT](https://github.com/forensic-architecture/datasheet-server/blob/develop/LICENSE).
