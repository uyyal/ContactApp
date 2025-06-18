const path = require('path');
const express = require('express');
const { connect } = require('mongoose');
const { engine } = require('express-handlebars');
const routing = require('./router/router');
const { PORT, MONGODB_URI } = require('./Config/index');

const app = express();

// ✅ Handlebars engine with helper
app.engine('handlebars', engine({
  helpers: {
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
}));
app.set('view engine', 'handlebars');

// ✅ Body parser for form data
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB connection
const connectDb = async () => {
  try {
    await connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};
connectDb();

// ✅ Routes
app.get('/', (req, res) => {
  res.render('home', { title: 'Home page' });
});

app.get('/form', (req, res) => {
  res.render('./contact_App/addContact', { title: 'form-data' });
});

app.use('/api', routing);

// ✅ Start server
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is running on port ${PORT}`);
});
