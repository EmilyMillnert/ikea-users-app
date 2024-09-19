// imports the express npm module
const express = require("express");
// imports the cors npm module
const cors = require("cors");
// Creates a new instance of express for our app
const app = express();
const { Sequelize, Model, DataTypes } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Define User model
class User extends Model {}
User.init({
    name: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    site: DataTypes.STRING,
}, { sequelize, modelName: 'user' });

// Sync models with database
sequelize.sync();

const users = [
    { name: "Andreas Andersson",  isAdmin: false, site:"MAlmo"},
    { name: "Emily Millnert", isAdmin: false, site:"MAlmo"},
    { name: "Erik Elvland", isAdmin: false, site:"HBG"},
    { name: "Robert Waltercrantz", isAdmin: false, site: "Almhult"},
    { name: "David Charlton", isAdmin: false, site:"Philly" }
];

// .use is middleware - something that occurs between the request and response cycle.
app.use(cors());
 // We will be using JSON objects to communcate with our backend, no HTML pages.
app.use(express.json());
// This will serve the React build when we deploy our app
app.use(express.static("react-frontend/dist"));

// This route will return 'Hello Ikea!' when you go to localhost:8080/ in the browser
app.get("/", (req, res) => {
    res.json({ data: 'Hello Ikea!' });
});

app.get('/api/seeds', async (req, res) => {
    users.forEach(u => User.create(u));
    res.json(users);
});
app.put('/api/seeds', async (req,res) => {
    console.log(User);
});

app.get('/api/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

app.get("/api/users/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.json(user);
});

app.post('/api/users', async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
});

app.put("/api/users/:id", async (req, res) => {
    const { name, isAdmin, site } = req.body;

    const user = await User.findByPk(req.params.id);
    await user.update({ name, isAdmin, site});
    await user.save();
    res.json(user);
});

app.delete('/api/users/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.json({data: `The user with id of ${req.params.id} is removed.`});
});



// This tells the express application to listen for requests on port 8080
const port = process.env.PORT || 8080;
app.listen(port, async () => {
    console.log(`Server started at ${port}`);
});
