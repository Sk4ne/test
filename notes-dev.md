## Pasos para crear un login de usuario

* El primer paso es crear la ruta, * creamos un archivo auth en la carpeta controller 
* Obtenemos el email y la password de req.body * Verificamos que el email exista con findOne({email}) 
* Verificar que el usuario este activo 
* Verificar que la contraseña sea correcta 
* Generar el JWT (En la carpeta helpers creamos el archivo para generar el token) generar-jwt.ts.
* Creamos un middleware para proteger las rutas (validar-jwt.js)
* Validamos el rol - creamos un archivos validar-roles.js (rol admin) carpeta middlewares
* IMPORTAMOS EN LA CARPETA ROUTES los archivos de validaciones

## Consideraciones Generales

```js
1. Todos los emails van a terminar con `86@correo.com` y la contraseña va a ser `A1s&23` - Fase Dev 
2. El usuario con rol ADMIN_ROLE puede editar y eliminar sus propias encuestas. 
3. El usuario sin privilegios USER_ROLE tiene permisos de lectura, solo puede ver las encuestas disponibles.
```

## TASK
- [ ] Crear el repositorio de la API en GITLAB
- [x] Desintalar los paquetes que no se este usando
- [x] Implementar express-validator en la ruta question.
- [x] Validar que se ingrese una typeQuestion Valid al hacer el push a un array de Question
- [x] Eliminar un pregunta del array Question.
- [x] Validar que el titulo de las preguntas sea unico.
- [x] Crear el modelo de usuario
- [x] Validación de la contraseña
- [x] Aplicar validaciones en la ruta
- [x] Ruta login
- [x] Definir los roles de usuario - ADMIN
- [x] La api no me deja crear usuarios en formato JSON desde POSTMAN. SOLUCIONAR
- [x] Subir la imagen de los usuarios a cloudinary - código optimizado
- [x] Si no mando la imagen se queja el código el -file es required
- [x] Eliminar imagenes de cloudinary cuando se elimina un usuario.
- [x] Mover la imagen por default a la pantalla principal de cloudinary
- [ ] Eliminar imagenes de cloudinary cuando se actualiza o elimina un usuario.
- [x] Corregir el error que tira multer cuando actualizo un usuario y no paso la imágen.
- [ ] Crear un módulo para reutilizar la eliminación de las imagenes 
- [ ] Organizar las carpeta de la api en postman.
- [x] Borrar de la DB los usuarios que no tienen la pass encriptada
- [x] Crear un index en la carpeta models para organizar mejor los archivos.
- [x] Si un usuario no elige una imagen al registrarse se le asigna una por defecto.  VALIDAR
- [x] Crear un ruta para eliminar todos los usuarios
- [x] Validar que el usuario ingrese una contraseña segura
- [x] Optimizar la validación de la contraseña
- [x] Actualizar la contraseña.
- [ ] Ver los vídeos de fazt y midudev sobre testing en node
- [ ] Implementar passportjs para la autenticación con redes sociales.
