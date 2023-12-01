const fs = require('fs').promises;
const multer = require('multer');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  })
});

const usersFile = 'users.json';

async function readUsers() {
  try {
    const data = await fs.readFile(usersFile);
    return JSON.parse(data).users;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function writeUsers(users) {
  try {
    await fs.writeFile(usersFile, JSON.stringify({ users: users }, null, 2));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

app.get('/create-user', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'create-user.html'));
});

app.get('/users', async (req, res) => {
  const users = await readUsers();
  res.json(users);
});

app.post('/create-user', upload.single('image'), async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const birthday = req.body.birthday;
  const image = req.file.filename;
  const occupation = req.body.occupation;

  const user = {
    id: Date.now().toString(), // Unikt ID för varje användare
    firstName: firstName,
    lastName: lastName,
    username: username,
    birthday: birthday,
    image: image,
    occupation: occupation
  };

  const users = await readUsers();
  users.push(user);
  const success = await writeUsers(users);
  if (success) {
    res.json({ message: 'Användare skapad!', user: user });
  } else {
    res.json({ message: 'Något gick fel!' });
  }
});

app.put('/users/:id', async (req, res) => {
    console.log("PUT-rutt anropad");
  const userId = req.params.id;

  console.log("body:  ",req)
  const updatedUserData = req.body;

  const users = await readUsers();
  const userToUpdate = users.find(user => user.id === userId);

  if (userToUpdate) {
    userToUpdate.firstName = updatedUserData.firstName || userToUpdate.firstName;
    userToUpdate.lastName = updatedUserData.lastName || userToUpdate.lastName;
    userToUpdate.username = updatedUserData.username || userToUpdate.username;
    userToUpdate.birthday = updatedUserData.birthday || userToUpdate.birthday;
    userToUpdate.occupation = updatedUserData.occupation || userToUpdate.occupation;

    const success = await writeUsers(users);
    if (success) {
      res.status(200).json(userToUpdate);
    } else {
      res.status(500).send('Något gick fel vid uppdatering av användaren.');
    }
  } else {
    res.status(404).send('Användaren hittades inte.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});