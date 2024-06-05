const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fetch = require('node-fetch');
const path = require('path');
const fs = require("fs");
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let users = []
let status = []
let games = []
let colors = []
let onetimepasscode = "lol&AllByNico"

app.get('/admin', (req, res) => {
  const { p } = req.query
  if(p == onetimepasscode){
    res.status(200).sendFile(path.join(__dirname, 'admin', 'panel.html'))
  } else {
    res.status(403).sendFile(path.join(__dirname, 'admin', 'authorization-failed.html'))
  }
});

app.get('/key', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'admin', 'key.html'))
});

app.get('/users', (req, res) => {
  const { p } = req.query
  if(p == onetimepasscode){
    res.status(200).sendJson(users)
  } else {
    res.status(403).sendFile(path.join(__dirname, 'src', 'authorization-failed.html'))
  }
});

function generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_<>|@€²³µ°^⌂⁒↑←→↓↪↩▢▥▨▬▭▣▦▩▮▯▤▧◊▰▱◀▶◁▷▲△◄►◅▻◓◒●◌◍◎◉○◈◇◆⫻⫸⫷⫺⫴⫵⫲äöüÄÖÜ";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

//Klick Simulator
const leaderboardList = [];
let previousData = null;

const gameIdOne = io.of('/gameid1');
gameIdOne.on('connection', (socket) =>{
  socket.on("lboard", (namee, klick, colorr) => {
    if (namee+""+klick !== previousData) {
      const name = namee
      const color = colorr
      const score = klick
      const existingPlayerIndex = leaderboardList.findIndex(
        (player) => player.name === name
      );
      if (existingPlayerIndex !== -1) {
        leaderboardList[existingPlayerIndex].score = score;
        leaderboardList[existingPlayerIndex].color = color;
      } else {
        leaderboardList.push({ name, score, color });
      }
      leaderboardList.sort((a, b) => b.score - a.score);
      socket.emit("lboard", leaderboardList);
      previousData = name+""+klick;
    }
  }); 
})

//Snake
const snakeNamespace = io.of('/gameid3');

let players = [];
let food = [];

for(let i=0;i<200;i++){
  setTimeout(function(){food.push({ x: Math.floor(Math.random() * 499), y: Math.floor(Math.random() * 499) })},i*1)
}

snakeNamespace.on('connection', (socket) => {
    console.log('a user connected to the snake game:', socket.id);
    let ytmp = Math.floor(Math.random() * 490) + 3
    players.push({
        id: socket.id,
        position: [{ x: ytmp, y: Math.floor(Math.random() * 499) },{ x: (ytmp-1), y: Math.floor(Math.random() * 499)},{ x: (ytmp-2), y: Math.floor(Math.random() * 499)}],
        direction: 'RIGHT',
        color: randomHexColor(),
        name: ''
    });

    socket.emit('currentPlayers', players);
    socket.emit('foodLocation', food);
    socket.broadcast.emit('newPlayer', players.find(player => player.id === socket.id));

    socket.on('disconnect', () => {
        console.log('user disconnected from the snake game:', socket.id);
        players = players.filter(player => player.id !== socket.id);
        snakeNamespace.emit('playerDisconnected', socket.id);
    });

    socket.on('playerMovement', (movementData) => {
        const player = players.find(player => player.id === socket.id);
        if (player) {
            player.direction = movementData.direction;
        }
    });
  
    socket.on('name', (name)=>{
      const player = players.find(player => player.id === socket.id);
      player.name = name
    })
});

function randomHexColor() {
    var r = Math.floor(Math.random() * 256); // Roter Wert zwischen 0 und 255
    var g = Math.floor(Math.random() * 256); // Grüner Wert zwischen 0 und 255
    var b = Math.floor(Math.random() * 256); // Blauer Wert zwischen 0 und 255

    // In Hexadezimal umwandeln
    var hexR = r.toString(16).padStart(2, '0'); // r in Hexadezimal umwandeln und auf zwei Stellen auffüllen
    var hexG = g.toString(16).padStart(2, '0'); // g in Hexadezimal umwandeln und auf zwei Stellen auffüllen
    var hexB = b.toString(16).padStart(2, '0'); // b in Hexadezimal umwandeln und auf zwei Stellen auffüllen
  
    return '#' + hexR + hexG + hexB;
}

function gameLoop() {
    players.forEach(player => {
        movePlayer(player);

        // Check collision with food
        const head = player.position[0];
        food.forEach((f, index) => {
            if (head.x === f.x && head.y === f.y) {
                player.position.push({ ...f });
                food[index] = { x: Math.floor(Math.random() * 499), y: Math.floor(Math.random() * 499) };
                snakeNamespace.emit('foodLocation', food);
            }
        });

        // Check collision with other players
        players.forEach(otherPlayer => {
            if (otherPlayer.id !== player.id) {
                otherPlayer.position.forEach(part => {
                    if (head.x === part.x && head.y === part.y) {
                        snakeNamespace.to(player.id).emit('gameOver');
                        players = players.filter(p => p.id !== player.id);
                        snakeNamespace.emit('died', player.id);
                    }
                });
            }
        });
    });

    snakeNamespace.emit('playerUpdates', players);
}

function movePlayer(player) {
    const newHead = { ...player.position[0] };

    switch (player.direction) {
        case 'LEFT':
            newHead.x--;
            break;
        case 'RIGHT':
            newHead.x++;
            break;
      case 'UP':
            newHead.y--;
            break;
        case 'DOWN':
            newHead.y++;
            break;
    }

    // Keep the player within bounds
    if (newHead.x < 0) newHead.x = 500;
    if (newHead.x > 500) newHead.x = 0;
    if (newHead.y < 0) newHead.y = 500;
    if (newHead.y > 500) newHead.y = 0;

    player.position.unshift(newHead);

    if (player.position.length > 1) {
        player.position.pop();
    }
}

setInterval(gameLoop, 1000 / 15);

//Game ID 5
const gameIdFive = io.of('/gameid5');
gameIdFive.on('connection', (socket) => {  
  socket.on('public-chat-message', async (msg, from) => {
    let time;    
    const url = 'https://timeapi.io/api/Time/current/zone?timeZone=Europe/Amsterdam';
    if(msg != ""){
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        
        time = tooZero(data.day) + "." + tooZero(data.month) + "." + tooZero(data.year) + " | " + tooZero(data.hour) + ":" + tooZero(data.minute) + ":" + tooZero(data.seconds)    
        
        gameIdFive.emit('public-chat-message', msg, from, time);
      } catch (error) {
        console.error('Es gab ein Problem mit dem Fetch-Vorgang:', error);
      }
    }
  });
});

//Function

function tooZero(numm){
  if(numm >= 9){return "0"+numm;} else {return numm;}
}

//Freigaben
app.use(express.static(path.join(__dirname, 'public')));
app.use('/info', express.static(path.join(__dirname, 'info')));

//Get Status from User
app.get('/statusFromUser', (req, res) => {
  const { name } = req.query
  let numm = "?"
  let statusnumm = "?"
  
  for(let i=0; i < users.length; i++){
    if(users[i].name == name){
      numm = i
    }
  }
  
  setTimeout(function(){
    if(numm != "?"){
      for(let i=0;i < status.length; i++){
        if(status[i].name == name){
          statusnumm = i
          res.status(200).json(status[i])
        }
      }
      setTimeout(function(){
        res.status(404).json({error:"404", message:"User not online"})
      },10)
    } else {
      res.status(404).json({error:"404", message:"User not found in database"})
    }
  }, 10)
});

//app.use(cors({
//  origin: ['https://nicoot.glitch.me'],
//  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//  credentials: true,
//}));

io.on('connection', (socket) => {
  //Login System
  socket.on('TryLogin', (json, NeedAllData) => {
    let data = JSON.parse(json)
    let numm = "?"
    
    if(data.name == ""){
      io.to(socket.id).emit('SendTryLogin', false)
    } else if(data.pass == ""){
      io.to(socket.id).emit('SendTryLogin', false)
    } else {
        if(users.length == 0){
          io.to(socket.id).emit('SendTryLogin', false)
        } else {
          
          for(let i=0; i<users.length; i++){
            if(users[i].name == data.name && users[i].pass == data.pass){
              numm = i
            }
          }
      
          setTimeout(function(){
            if(numm != "?"){
              if(NeedAllData == true){
                io.to(socket.id).emit('SendTryLogin', true, JSON.stringify(users[numm]))
              } else {
                io.to(socket.id).emit('SendTryLogin', true)
              }
            } else {
              io.to(socket.id).emit('SendTryLogin', false)
            }
          },10)
        }
    }
  });
  
  socket.on("NewAccount", (json) =>{
    //Add acount to system
  });
  
  socket.on("CangeAccountData", (name, pass, newName, call, color, lang, MessageSound) =>{
    if(name != undefined || pass != undefined){
      console.log('New Data')
      let numm = "?";
    
      for(let i = 0; i<users.length;i++){
        if(users[i].name == name && users[i].pass == pass){
          numm = i
        }
      }
    
      setTimeout(function(){
        if(numm != "?"){
          if(newName != undefined){users[numm].name = newName}
          if(call != undefined){users[numm].lang = call}
          if(color != undefined){users[numm].color = color}
          if(lang != undefined){users[numm].lang = lang}
          if(MessageSound != undefined){users[numm].MessageSound = MessageSound}
        }
      }, 5)
    } 
  });
  
  //Get Colors
  socket.on("getDataColorFromUsers", () =>{
    socket.emit("colors", colors)
  })
  
  
  //Change Data
  socket.on("changeColor", (login, pass, RGBcolor) =>{
    if(login != undefined || pass != undefined || RGBcolor != undefined){
      let numm = "?";
    
      for(let i = 0; i<users.length;i++){
        if(users[i].name == login && users[i].pass == pass){
          numm = i
        }
      }
    
      setTimeout(function(){
        if(numm != "?"){
          users[numm].color = RGBcolor
        }
      }, 5)
    }    
  });
  
  //System
  
  socket.on('GetData', (login, pass, from) =>{
    let numm = "?"
    let willGet = "?"
    let willGetNumm = "?"
    
    willGet = from.split('|')    
    willGetNumm = willGet[1]    
    willGet = willGet[0]
    
    for(let i=0; i<users.length;i++){
      if(login == users[i].name && pass == users[i].pass){
        numm = i
      }
    }
    
    setTimeout(function(){
      if(numm == "?" || willGet == "?" || willGetNumm == "?"){
        io.to(socket.id).emit('SendData', "Unknow account")
      } else {
        io.to(socket.id).emit('SendData', getDataFromUser(numm, willGet, willGetNumm))
      }
    },700)
  })
  
  socket.on('SaveData', (login, pass, game, JsonStringify) => {
    let numm = "?"
    let storeAtrubute = null
    
    for(let i=0; i<users.length;i++){
      if(login == users[i].name && pass == users[i].pass){
        numm = i
      }
    }
    
    if(numm != "?"){
      let splited = game.split('|')
      if(splited[0] == "GameId"){
        if(splited[1] == "1" && games[1]){
          storeAtrubute = games[1].dataSaveAtribute
          users[numm][storeAtrubute] = JSON.parse(JsonStringify)
        }
      }
    }
  })
  
  //Status
  socket.on("login", (wer) =>{
    console.log('New User online:', wer)
    status.push({
      "name": wer,
      "state": "online",
      "id": socket.id
    })
  });
  
  socket.on("SetStatus", (wer, type, status) =>{
    //Add acount to system
  });
  
  socket.on("disconnect", ()=>{
    for(let i=0;i < status.length; i++){
      if(status[i].id == socket.id){
        status.pop(status[i])
      }
    }
  });
  
  // Murder
  
  
});

//System

function getDataFromUser(userI, willGet, willGetNumm){
  if(willGet == "GameId"){
     let gameSaveAtribute = null
     
     for(let i=0;i<games.length;i++){
       if(i == willGetNumm){
         gameSaveAtribute = games[i].dataSaveAtribute
       }
     }
     
     if(gameSaveAtribute != null){
       return users[userI][gameSaveAtribute];
     } else {
       return undefined;
     }
  } else {
    return undefined;
  }
}

//Server

function saveUsers(){  
  fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error('Fehler beim speichern von Global:', err);
    }
  });

  fs.readFile("public/games.json", "utf8", (err, data) => {
    if (err) {
      return;
    }
    try {
      games = JSON.parse(data);
    } catch (parseError) {
      console.error("Ladern der Daten Error: " + parseError);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Online`);
  
  //Daten
  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      return;
    }
    try {
      users = JSON.parse(data);
      setInterval(function(){
        for(let i=0;i<users.length;i++){
          colors.push({name:users[i].name,color:users[i].color})
        }
      },10000)
    } catch (parseError) {
      console.error("Ladern der Daten Error: " + parseError);
    }
  });
  
  //OTK  
  onetimepasscode = generatePassword(Math.floor(Math.random()*40)+50) // 50-90 langes passwort
  console.log(onetimepasscode);
  
  //Auto Save
  setInterval(saveUsers,3000);
});
