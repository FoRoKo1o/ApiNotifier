const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const secretKey = process.env['secretKey'];

function encryptData(data) {
  const cipher = crypto.createCipher('aes-256-cbc', secretKey);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptData(encryptedData) {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

let users = [];

try {
  const encryptedUserData = fs.readFileSync('users.json', 'utf8');
  const decryptedUserData = decryptData(encryptedUserData);
  users = JSON.parse(decryptedUserData).users; // Access the 'users' property
} catch (error) {
  console.error('Error reading users.json:', error);
}

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const userId = uuidv4();

  users.push({ id: userId, username, password });

  const updatedUserData = { users }; // Create an object with the 'users' array

  const encryptedUserData = encryptData(JSON.stringify(updatedUserData, null, 2));
  fs.writeFileSync('users.json', encryptedUserData, 'utf8');

  res.status(201).json({ message: 'User registered successfully', userId });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({ message: 'Login successful', userId: user.id });
});

app.post('/addmessage', (req, res) => {
  const { userId, date, hour, message } = req.body; // Added 'hour' field

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const newMessage = {
    userId,
    date,
    hour, // Include 'hour' field
    message,
  };

  let messages = [];

  try {
    const encryptedMessagesData = fs.readFileSync('messages.json', 'utf8');
    const decryptedMessagesData = decryptData(encryptedMessagesData);
    messages = JSON.parse(decryptedMessagesData).messages;
  } catch (error) {
    console.error('Error reading messages.json:', error);
  }

  messages.push(newMessage);

  const updatedMessagesData = { messages };

  const encryptedMessagesData = encryptData(JSON.stringify(updatedMessagesData, null, 2));
  fs.writeFileSync('messages.json', encryptedMessagesData, 'utf8');

  res.status(201).json({ message: 'Message added successfully' });
});

app.get('/getmessages/:userId', (req, res) => {
  const { userId } = req.params;

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  let messages = [];

  try {
    const encryptedMessagesData = fs.readFileSync('messages.json', 'utf8');
    const decryptedMessagesData = decryptData(encryptedMessagesData);
    messages = JSON.parse(decryptedMessagesData).messages;
  } catch (error) {
    console.error('Error reading messages.json:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  const userMessages = messages.filter((message) => message.userId === userId);

  res.status(200).json({ messages: userMessages });
});

app.post('/removemessage', (req, res) => {
  const { userId, date, hour, message } = req.body;

  let messages = [];

  try {
    const encryptedMessagesData = fs.readFileSync('messages.json', 'utf8');
    const decryptedMessagesData = decryptData(encryptedMessagesData);
    messages = JSON.parse(decryptedMessagesData).messages;
  } catch (error) {
    console.error('Error reading messages.json:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  const messageIndex = messages.findIndex(
    (msg) => msg.userId == userId && msg.date == date && msg.hour == hour && msg.message == message
  );

  if (messageIndex === -1) {
    return res.status(404).json({ message: 'Message not found' });
  }

  messages.splice(messageIndex, 1);

  const updatedMessagesData = { messages };

  const encryptedMessagesData = encryptData(JSON.stringify(updatedMessagesData, null, 2));
  fs.writeFileSync('messages.json', encryptedMessagesData, 'utf8');

  res.status(200).json({ message: 'Message removed successfully' });
});
/* DEVELOP ONLY

app.get('/getallmessages', (req, res) => {
  let messages = [];

  try {
    const encryptedMessagesData = fs.readFileSync('messages.json', 'utf8');
    const decryptedMessagesData = decryptData(encryptedMessagesData);
    messages = JSON.parse(decryptedMessagesData).messages;
  } catch (error) {
    console.error('Error reading messages.json:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  res.status(200).json({ messages });
});

app.get('/getallusers', (req, res) => {
  let usersData = [];

  try {
    const encryptedUsersData = fs.readFileSync('users.json', 'utf8');
    const decryptedUsersData = decryptData(encryptedUsersData);
    usersData = JSON.parse(decryptedUsersData).users;
  } catch (error) {
    console.error('Error reading users.json:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  res.status(200).json({ users: usersData });
});
*/
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
