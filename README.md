# Acortador de URLs

## Definición de cliente

Como usuario, al acceder a la aplicación y no estar registrado ni logado, debo ver la página de registro.
Si no tengo cuenta deberé registrarme para poder acceder a la página principal.
Si tengo cuenta, puedo ir a la página de login para acceder (debería haber un link en la página de registro que me lleve a login y viceversa).

Una vez registrado y logado, la aplicación deberá redirigirme automáticamente a la página principal, donde veré un campo de texto para introducir la URL que quiero acortar
y un botón para obtener la URL acortada. Debajo (o a la derecha en escritorio) debería ver una lista con las URLs que, como usuario, he creado (en caso de no haber creado ninguna, debería aparecer un mensaje indicándolo)

En dicha lista, también debería aparecer el número de veces totales que ha sido usada cada URL, el número de veces que el usuario la ha usado y el número de veces que otros usuarios
(independientemente de que estuvieran registrados en la aplicación) la han usado.

Cada vez que introduzca una URL en el campo de texto y obtenga la URL acortada, la lista con todas las URLS creadas debería actualizarse añadiendo la recién creada.

Cuando tenga la URL acortada en pantalla, si pincho en ella, debería aparecer con un color de fondo e indicar con un mensaje que la URL ha sido copiada al portapapeles. Esta opción también
debería estar en cada una de las URLs de la lista (sería óptimo un icono, al lado de la URL acortada, típico de portapapeles, para dar pistas al usuario de que se puede copiar solo haciendo click)

En la esquina superior derecha debería ver mi nombre de usuario junto a un icono o botón de apagado en el que, si hago click sobre él, salga de la aplicación y me lleve de nuevo a la página de login
(sería muy positivo que apareciese un modal preguntando si estamos seguros de querer hacer logout en lugar de salir directamente sin avisar antes)

## Definición técnica

### Backend

Debemos tener un nuevo modelo, "Links", para guardar todas las URLs creadas y guardar también quién creó dicha URL y cuántas veces se usa cada una. Deberá tener los siguientes campos:
- id (uuid v4, PK)
- short_url (text, unique not null) (solo se guarda el path de la url. Sin dominio. Piensa cómo generar una parte aleatoria, ej: "/short/aJ34vG90")
- origin_url (text, not null) (URL original)
- uses_by_creator (integer, default 0) (usos que ha hecho de esta url solo quien la crease)
- uses (integer, default 0) (usos totales)
- creation_date (date, default now)
- created_by (users id, FK, update cascade, delete cascade)

Crea una nuevo endpoint POST /short/generator (solo para usuarios registrados, si no lo está, 401):
- Recibirá la URL que se quiere transformar en un body como el siguiente:
```
{
  "url": "https://www.thebridge.tech"
}
```
- Generará un token (busca cómo generar un token aleatorio de 8 caracteres alfanuméricos)
- Generará una nueva entrada en la tabla "Links" con un nuevo id, short_url, origin_url, creation_date y created_by
- La respuesta será como esta:
```
{
  "success": true,
  "data": {
    "url": "/short/aJ34vG90"
  }
}
```

Crea un nuevo endpoint GET /short/:id (puede ser usado por cualquier usuario):
- Comprueba que los params tienen una longitud de 8 caracteres. Si no, devuelve que la URL no está bien formada
- Busca esa url en la BBDD. Si no la encuentras, devuelve que la URL no está bien formada
- Si encuentras la URL, obtén la "origin_url"
- Actualiza la tabla sumando 1 a "uses"
- Si el usuario que ha hecho la petición es el mismo usuario que está logado, suma 1 también a "uses_by_creator"
- Devuelve una orden de redirección al cliente a la URL de la BBDD "origin_url" (busca cómo devolver un redirect a cliente)

Modifica el endpoint para obtener la información del usuario y que satisfaga las necesidades de la parte cliente (Panel)

### Frontend

*Empieza el proyecto pensando y maquetando siempre en móvil, luego en escritorio

Debemos tener 3 páginas:
- Register (Sin proteger, pero si estamos logados, nos redirigirá al Panel)
- Login (Sin proteger, pero si estamos logados, nos redirigirá al Panel)
- Panel (Protegida, si no estamos logados, nos redirigirá al Login)

La página "Register" contendrá un formulario:
- Título h1 "Create account"
- Campo email (requerido)
- Campo username (requerido)
- Campo password (requerido, longitud mínima de 4 caracteres)
- Campo submit (si todo va bien, redirigir a Login)

La página "Login" contendrá un formulario:
- Título h1 "Login"
- Campo email (requerido)
- Campo password (requerido, longitud mínima de 4 caracteres)
- Campo submit (si todo va bien, redirigir a Panel)

La página "Panel" contendrá en el centro:
- Título h1 "Panel"
- Campo para introducir la URL que se quiere acortar
- Botón "Generate" (desactivado si el campo anterior está vacío)
- Section donde aparecerá la URL generada (pon un icono al lado de un portapapeles). Este elemento será clickable y tendrá la característica de pegar la URL que contiene en el portapapeles

La página "Panel", debajo (derecha en escritorio) contendrá:
- Lista con todas las URLs acortadas generadas por el usuario que está logado
- Cada elemento será: URL, número de usos totales, número de usos del usuario logado
- Si dejamos el cursor encima de la URL, aparecerá un tooltip (texto emergente) con la URL a la que apunta
- Si clickamos en alguno de estos elementos, el fondo cambiará de color y le URL acortada irá a nuestro portapapeles
- Cuando se genere una nueva URL acortada, esta lista deberá actualizarse con la nueva URL

La página "Panel" contendrá en la esquina superior derecha:
- El nombre del usuario en negrita
- Justo al lado habrá un botón o un icono de apagado
- Haciendo click en este elemento, la aplicación mostrará un modal preguntando si deseas salir de la aplicación
- En caso afirmativo, desconectar al usuario y redirigir a la página de Login
- En caso negativo, solo quitar el modal

![image](https://github.com/TheBridge-FullStackDeveloper/fs-pt0123-url-shorter-exercise/assets/31268447/755fa4c4-5abf-40fe-ae02-598db04be9e0)

## EXTRA

Tienes todavía energias? Añade dos validaciones extras!

### Frontend

Cuando el usuario pegue una URL, comprueba que al menos contenga "http://" o "https://" o busca alguna expresión regular para que valide que sea una URL válida

### Backend

Cuando te llegue una URL para generar una nueva URL corta, valida que la URL recibida llegue a algún sitio, para eso intenta obtener un statusCode de 200 haciendo una petición a dicha URL.
Si no obtienes un código 2XX, devuelve un error
