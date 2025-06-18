const { Router } = require('express');
const router = Router();
const Cnt_Schema = require('../Schema/schema');

// -----------------------------
// Add a Contact (POST request)
// -----------------------------
router.post('/form', async (req, res) => {
  try {
    await Cnt_Schema.create(req.body);
    res.redirect('/', 302);
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).send('Internal Server Error');
  }
});

// --------------------------------------
// Render the Add Contact Form (GET)
// --------------------------------------
router.get('/form', (req, res) => {
  res.render('contact_App/addContact', { title: 'Add_Contact' });
});

// --------------------------------------
// Display All Contacts (GET)
// --------------------------------------
router.get('/allcontacts', async (req, res) => {
  try {
    const payload = await Cnt_Schema.find({}).lean();
    res.render('contact_App/cnt_list', { title: 'All-Contacts', payload });
  } catch (error) {
    console.error('Error fetching all contacts:', error);
    res.status(500).send('Internal Server Error');
  }
});

// --------------------------------------
// Display Single Contact Info (GET)
// --------------------------------------
router.get('/contact/:id', async (req, res) => {
  try {
    const payload = await Cnt_Schema.findById(req.params.id).lean();
    res.render('contact_App/cntinfo', { title: 'Contact Info', payload });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).send('Internal Server Error');
  }
});

// --------------------------------------
// Render Edit Contact Form (GET)
// --------------------------------------
router.get('/edit/:id', async (req, res) => {
  try {
    const editData = await Cnt_Schema.findById(req.params.id).lean();
    res.render('contact_App/edit', { title: 'Edit Contact', editData });
  } catch (error) {
    console.error('Error loading edit form:', error);
    res.status(500).send('Internal Server Error');
  }
});

// --------------------------------------
// Update Contact (POST)
// --------------------------------------
router.post('/edit/:id', async (req, res) => {
  try {
    const contact = await Cnt_Schema.findById(req.params.id);
    contact.fname = req.body.fname;
    contact.lname = req.body.lname;
    contact.nmbr = req.body.nmbr;
    contact.loc = req.body.loc;
    await contact.save();
    res.redirect('/api/allcontacts', 302);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).send('Internal Server Error');
  }
});

// --------------------------------------
// Delete Contact (GET)
// --------------------------------------
router.get('/delete/:id', async (req, res) => {
  try {
    await Cnt_Schema.deleteOne({ _id: req.params.id });
    res.redirect('/api/allcontacts', 302);
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).send('Internal Server Error');
  }
});

// --------------------------------------
// Recommendation: Serve Static CSS
// --------------------------------------
// Instead of using fs.readFile for each CSS file,
// in app.js or server.js, add this once:
// app.use('/static', express.static('public'))
//
// And in HTML use: 
// <link rel="stylesheet" href="/static/contactform.css">

module.exports = router;
