# MernPCReview
Modules Mern
express 
nodemon (Actualiza automaticamente cambios)
morgan (Permite registrar o ver por consola peticiones del navegador al servidor)
path (Permite interactuar con rutas independientemente del SO
mongoose (Permite conectarnos a la base de datos y definir como se mostrarán los datos.
webpack (dependencia de servidor)
webpack-cli (Para que funcione internamente webpack)
babel (Se encarga de traducir código) .babelrc se encarga de decir qué traducir

Modules User validation.
bcryptjs: used to hash passwords before we store them in our database
body-parser: used to parse incoming request bodies in a middleware
concurrently: allows us to run our backend and frontend concurrently and on different ports
express: sits on top of Node to make the routing, request handling, and responding easier to write
is-empty: global function that will come in handy when we use validator
jsonwebtoken: used for authorization
mongoose: used to interact with MongoDB
passport: used to authenticate requests, which it does through an extensible set of plugins known as strategies
passport-jwt: passport strategy for authenticating with a JSON Web Token (JWT); lets you authenticate endpoints using a JWT
validator: used to validate inputs (e.g. check for valid email format, confirming passwords match)

Modules for Redux validation
axios: promise based HTTP client for making requests to our backend
classnames: used for conditional classes in our JSX
jwt-decode: used to decode our jwt so we can get user data from it
react-redux: allows us to use Redux with React
react-router-dom: used for routing purposes
redux: used to manage state between components (can be used with React or any other view library)
redux-thunk: middleware for Redux that allows us to directly access the dispatch method to make asynchronous calls from our actions

Notes:
jsx = react + html

MERN: Mongodb, Express, React y Nodejs

MongoDB usa js.
Nodejs permite usar js en el servidor (no es práctico ni productivo) por lo que usamos framework optimizado = express.
Front-end (Interfaz) : React.
NodeJS = Entorno que permite usar JS fuera del navegador. Permite crear aplicaciones de escritorio, navegador, etc. Permite usar herramientas como Webpack, babel, etc.

Notas:
Añadir -D al instalar dependencia indica que solo es para DESAROLLO
createStore() creates a Redux store that holds the complete state tree of your app. There should only be a single store in your app.

React es una biblioteca javascript que utiliza varias bibliotecas y optima