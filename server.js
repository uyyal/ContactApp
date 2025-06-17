const path=require('path')
const express=require('express');//Imports the express framework, which is used to build web applications and APIs.
const app = express();// Creates an instance of an Express application to define routes and handle requests.
const {connect}=require('mongoose') //Imports the mongoose library to interact with MongoDB.

// using handlebars here
const {engine}=require('express-handlebars')//Imports the express-handlebars package, a popular templating engine for building dynamic views.
let routing=require('./router/router')
//Extracts the connect method from mongoose to establish a connection with a MongoDB database.

let{PORT,MONGODB_URI}=require('./Config/index') // Loads configuration settings (such as PORT and MONGODB_URI) from a custom module/file named Config/index.js.

// const schema=require('./Schema/schema') //Intended to import a Mongoose schema for MongoDB collections but is currently commented out.






//app.engine('handlebars', engine()): Registers Handlebars as the templating engine under the alias handlebars.
app.engine('handlebars',engine({
    helpers: {
    // 👇 Custom helper ifCond for conditional rendering in templates
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=': return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<': return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=': return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=': return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&': return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||': return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default: return options.inverse(this);
      }
    }
  }
})); //to set the handlebars engine
app.set('view engine','handlebars') //to start the handlebars engine



//Purpose: Configures the Express app to parse incoming request bodies encoded as application/x-www-form-urlencoded (a common encoding for form submissions).
//{ extended: true }:
// Allows parsing of nested objects in the body, e.g., { key: { subkey: value } }.
// When false, the body will be parsed as a simple string or array.
// Why Important: Enables easy access to req.body in POST/PUT requests from forms
app.use(express.urlencoded({extended: true}))
 


//Purpose: Defines an asynchronous function to establish a connection to the MongoDB database.
let connectDb=async()=>{
    await connect(MONGODB_URI)//Connects to MongoDB using the connection string (MONGODB_URI)..//Uses await to ensure the app doesn't proceed until the connection is established.
    console.log('MongoDb connected successfully')
}
connectDb();//Invokes the connectDb function to connect to the database when the application starts.



app.get('/',(req,res)=>{//Defines a route for the root URL (/).
    res.render('home',{title:'Home page'})//Renders a template file named home using the view engine.
})//Passes an object { title: 'Home page' } to the template for dynamic rendering (e.g., the page title).



//Purpose: Defines a route for /form
app.get('/form',(req,res)=>{
    res.render('./contact_App/addContact',{title:'form-data'})//Renders a template file located at ./contact_App/addContact.
})//Passes an object { title: 'form-data' } to the template.



//Purpose: Mounts a router (imported as routing) to the /api path
// How It Works:
// All routes defined in the routing module will now be prefixed with /api.
// Example: If routing has a route /contacts, it will be accessible at /api/contacts.
app.use('/api',routing)


//Purpose: Starts the Express server and listens on the specified PORT
app.listen(PORT,err=>{//The port number where the server will listen for requests.(5000)
    if(err) throw err
    console.log(`Server is running on port ${PORT}`)
})
