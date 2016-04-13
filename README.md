# MongoDB para gestionar un CMS 
   
Estructura del proyecto:


    / index.js -> Servidor web

    / templates
    
    --------- /  buildStructure.html    -> Constructor de la plantilla
    
    --------- /  editEntry.html         -> Editor de la plantilla
    
    --------- /  index.html             -> Pagnia principal con la lista de las entradas publicadas
    
    --------- /  login.html             -> Login y registro
    
    --------- /  manager.html           -> Adminsitracion(para usuarios) Falta corregir fallos
    
    --------- /  view.html              -> Vista de una entrada del blog
    
    / static   -> css, javascript ..
    
    / routes  -> routas para acceder a los servicios del servidor
    
    / handlers  -> controladores para cada ruta
    
    / models  -> modelos de datos para MongoDB (usuario y entrada del blog)
    
    / controllers  -> controlador de la base de datos
    
    
    ### MongoDB
    
    Para conectarse a mongoDB se utiliza mongoose
    
      mongoose.connect('mongodb://localhost/blog');
      
    que se ejecuta en docker en loclahost.
    
    ### Servidor Web
    
    El servidor web esta implementado con hapijs (http://hapijs.com/).
    Tiene certificados autofirmados. Para gestionar el estado de la conexion se utiliza el plugin hapi-auth-cookie que permite gestionar la autenticación.
    
 
