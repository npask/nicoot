
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const snakeSocket = io('/gameid3');
        let gridSize = 500; // Fixed grid size
        let tileCount = 50; // Adjust tile count for larger tiles
        let tileSize = gridSize / tileCount;
        let localPlayer = {};
        let lastfood;
        let lastPlayers;
        let offsetX;
        let offsetY;
        let onetime = false
        let died = false

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            tileSize = Math.min(canvas.width / tileCount, canvas.height / tileCount);
        }
      
        function leaderboard(){
          lastPlayers.sort((a, b) => b.position.length - a.position.length);
          document.getElementById('leaderboard').innerHTML= '<div class="top"><a>NAME</a><a class="score">SCORE</a></div>'
          for(let i=0;i<lastPlayers.length;i++){
            let ele = document.createElement('div')
            ele.innerHTML = '<div><a>' + lastPlayers[i].name + '</a><a class="score">' + lastPlayers[i].position.length + '</a></div>'
            document.getElementById('leaderboard').appendChild(ele)
          }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        snakeSocket.on('currentPlayers', (serverPlayers) => {
            localPlayer.id = snakeSocket.id;
            serverPlayers.forEach(player => {
                if (player.id === snakeSocket.id) {
                    localPlayer.position = player.position;
                }
            });
        });

        snakeSocket.on('playerUpdates', (serverPlayers) => {
            serverPlayers.forEach(player => {
                if (player.id === snakeSocket.id) {
                    localPlayer.position = player.position;
                }
            });
            lastPlayers = serverPlayers
            if(onetime == false){onetime = true;setTimeout(leaderboard,1000)}
            draw(lastfood);
            drawPlayers(serverPlayers);
            if(died == false){document.getElementById('cords').innerText = "X: "+localPlayer.position[0].x+", Y: "+localPlayer.position[0].y}
        });

        snakeSocket.on('foodLocation', (serverFood) => {
            lastfood = serverFood
            leaderboard()
        });

        document.addEventListener('keydown', (event) => {
            document.getElementById('conrolls').style.display = "none"
            getDirectionFromKey(event.key);
        });

        function getDirectionFromKey(key) {
            switch (key) {
                case 'ArrowUp':
                    snakeSocket.emit('playerMovement', { direction:"UP" });
                    return 'UP';
                case 'ArrowDown':
                    snakeSocket.emit('playerMovement', { direction:"DOWN" });
                    return 'DOWN';
                case 'ArrowLeft':
                    snakeSocket.emit('playerMovement', { direction:"LEFT" });
                    return 'LEFT';
                case 'ArrowRight':
                    snakeSocket.emit('playerMovement', { direction:"RIGHT" });
                    return 'RIGHT';
                default:
                    return null;
            }
        }

        function draw(food) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'green';
          
            drawBorder()

            // Calculate player's offset to keep it centered
            offsetX = (canvas.width / 2) - (localPlayer.position[0].x * tileSize);
            offsetY = (canvas.height / 2) - (localPlayer.position[0].y * tileSize);

            localPlayer.position.forEach(part => {
                ctx.fillRect(
                    (part.x * tileSize) + offsetX,
                    (part.y * tileSize) + offsetY,
                    tileSize, tileSize
                );
            });

            ctx.fillStyle = 'red';
            food.forEach(f => {
                ctx.fillRect(
                    (f.x * tileSize) + offsetX,
                    (f.y * tileSize) + offsetY,
                    tileSize, tileSize
                );
            });
        }
      
        function drawPlayers(players) {
            players.forEach(player => {
                ctx.fillStyle = "black";
                player.position.forEach(part => {
                    ctx.fillRect(
                        (part.x * tileSize) + offsetX,
                        (part.y * tileSize) + offsetY,
                        tileSize, tileSize
                    );
                    ctx.fillStyle = player.color;
                });
            });
        }
      
        function drawBorder() {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

          //Oben
          ctx.fillRect((0 * tileSize) + offsetX,(0 * tileSize) + offsetY,tileSize*501,tileSize*0.5);
          //Links
          ctx.fillRect((0 * tileSize) + offsetX,(0 * tileSize) + offsetY,tileSize*0.5,tileSize*501);
          //Unten
          ctx.fillRect((0 * tileSize) + offsetX,(501 * tileSize) + offsetY,tileSize*501,tileSize*0.5);
          //Rechts
          ctx.fillRect((501 * tileSize) + offsetX,(0 * tileSize) + offsetY,tileSize*0.5,tileSize*501);
        }
      
        snakeSocket.on('gameOver', () => {
            died = true
            document.getElementById('cords').innerText = "You died(reload to <a href='.'>rejoin</a>)"
        });
      
        snakeSocket.on('died', (name) => {
            createMessage(name+' has died! ☠')
        });
      
        snakeSocket.on('disconnect', () => {
            document.getElementById('cords').innerText = "⚠ Error, Verbindung zum Server ist fehlgeschlagen! ⚠"
        });

        snakeSocket.on('connect_error', () => {
            document.getElementById('cords').innerText = "⚠ Error, Verbindung zum Server ist fehlgeschlagen! ⚠"
        });

        snakeSocket.on('connect', () =>{
          snakeSocket.emit('name', mydata.name)
        })
      
        function createMessage(innertHtml){
          let element = document.createElement('a')
          element.innerHTML = innertHtml
          element.id = innertHtml.replace(/ /g, '');
          document.getElementById('message').appendChild(element)
          
          setTimeout(function(){
            document.getElementById(innertHtml.replace(/ /g, '')).remove()
          },2690)
        }