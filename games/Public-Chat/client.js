        const game = io('/gameid5');

        game.on('connect', function(){
            let date = new Date
            const item = document.createElement('div');
            item.className = "System"
            item.innerHTML = "<a style='color: rgba(65, 190, 107, 1)'>Mit Chat verbunden!</a><br><a class='from'>System | " + tooZero(date.getDate()) + "." + tooZero(date.getMonth()) + "." + date.getFullYear() + " | " + tooZero(date.getHours()) + ":" + tooZero(date.getMinutes()) + ":" + tooZero(date.getSeconds()) + "</a>";
            document.getElementById('chat').appendChild(item);
        })
      
        game.on('disconnect',function(){
            let date = new Date
            const item = document.createElement('div');
            item.className = "System"
            item.innerHTML = "<a style='color: rgba(190, 65, 65, 1)'>Verbindung mit Chat verloren!</a><br><a class='from'>System | " + tooZero(date.getDate()) + "." + tooZero(date.getMonth()) + "." + date.getFullYear() + " | " + tooZero(date.getHours()) + ":" + tooZero(date.getMinutes()) + ":" + tooZero(date.getSeconds()) + "</a>";
            document.getElementById('chat').appendChild(item);
        })

        game.on('public-chat-message', function(msg, from, time){
            const item = document.createElement('div');
            let message;
            if(from != "Admin"){
              message = msg.replace(/</g, '').replace(/>/g, '');
            } else {
              message = msg
            }
            if(from != login){
                item.innerHTML = "<a>" + message + "</a><br><a class='from'>"+ from +" | " + time +"</a>";
            } else {
                item.innerHTML = "<a>" + message + "</a><br><a class='from'>Du | " + time +"</a>";
                item.className = "you"
            }
            document.getElementById('chat').appendChild(item);
            var container = document.getElementById('chat');
            container.scrollTop = container.scrollHeight;
        });

        document.getElementById('form').addEventListener('submit', function(e) {
            login = localStorage.getItem('name')
            if(login == "Admin"){
              document.getElementById('input').maxLength = "2147483647"
            }
            e.preventDefault();
            const input = document.getElementById('input');
            game.emit('public-chat-message', input.value, login);
            input.value = '';
        });

setInterval(backgroundUpdate, 100)

function backgroundUpdate(){
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.style.background = "black";
    document.body.style.color = "white";
  } else {
    document.body.style.background = "white";
    document.body.style.color = "black";
  }
}