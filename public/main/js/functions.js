let games;

function editNavigator(){
    document.getElementById('Profilecircle').style.width = "20" + "px"
    document.getElementById('Profilecircle').style.height = "auto"
    if(window.innerWidth <= 550){
        document.getElementById('sidenava').style.display = ""
        document.getElementById('titleNav').style.display = "none"
        document.getElementById('searchNav').style.display = "none"
        document.getElementById('sidenav').style.display = "none"
        document.getElementById('body').style.animation = ""
        document.getElementById('body').style.marginLeft = "2px"
    } else {
        document.getElementById('sidenava').style.display = "none"
        document.getElementById('titleNav').style.display = ""
        document.getElementById('searchNav').style.display = "" 
        document.getElementById('sidenav').style.display = ""
        document.getElementById('body').style.animation = "SlideInFromLeftVWE 1s ease-out"
        document.getElementById('body').style.marginLeft = "10vw"
    }
}

function backgroundUpdate(){
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.style.background = "black";
    document.body.style.color = "white";
    if(document.getElementById('timeblack')){
      document.getElementById('timeblack').style.background = "black"
    }
    if(document.getElementById('ProjectSite')){
      document.getElementById('ProjectSite').style.background = "black"
      document.getElementById('ProjectSite').style.color = "white"
    }
  } else {
    document.body.style.background = "white";
    document.body.style.color = "black";
    if(document.getElementById('timeblack')){
      document.getElementById('timeblack').style.background = "white"
    }
    if(document.getElementById('ProjectSite')){
      document.getElementById('ProjectSite').style.background = "white"
      document.getElementById('ProjectSite').style.color = "black"
    }
  }
}

function startLoadAnimations(){
  setTimeout(function(){
    document.getElementById('NavTop').style.display = ""
    document.getElementById('sidenav').style.display = ""
    document.getElementById('body').style.display = ""
    document.getElementById('timeblack').style.top = "-101%"
    document.getElementById('LoadingSound').pause()
    TestIfGameInUrl()
    translate()
    setTimeout(function(){
      translate()
    },2000)
    document.getElementById('timeblack').remove()
    document.body.style.overflow = ""
    document.body.style.overflowY = "auto"
    setInterval(editNavigator,100)
  },1)
}

function TestIfGameInUrl(){
  if(urlSplited.length >=2 && urlSplited[1].split('=')[0] == "ShowGameID"){
    let bannerURL;
    let Titel = "..."
    let Owner = "..."
    let gameURL = "./"
    let Likes = 0;
    let dislikes = 0;
    let GameId = urlSplited[1].split('=')[1]
    let Realesae = "...";
    let lastUpdate = "...";
    let Modus = "..."
    let lang = "..."
    let ii;
    
    for(let i=0;i<games.length; i++){
      let s = games[i]
      if(s.gameid == GameId){
        ii = i
        Titel = s.name
        Owner = s.author
        gameURL = s.url
        Realesae = s.release
        lastUpdate = s.lastupdate
        Likes = s.liked.length 
        dislikes = s.disliked.length
        bannerURL = s.bannerurl
        Modus = s.gamePlayer
        lang = s.lang
      }
    }
    
    if(bannerURL == "" || bannerURL == null){
      bannerURL = "https://cdn.glitch.global/4a60a434-4a01-4047-82ab-7f4df411125b/classicBanner.png?v=1707561006310"
    }
              
    setTimeout(function(){
      const total = Likes + dislikes;
      const likePercentage =  (Likes / total) * 100;
      
      let e = document.createElement('div')
      e.className = "ProjectSite"
      e.id = "ProjectSite"
      e.innerHTML = `
        <a id="arrow-left-back" onclick="window.location.href = 'https:/'+'/nicoot.glitch.me/main/in.html'">
            <i style="color: red;" class="fa-solid fa-arrow-left">
            </i>
        </a>
        <img src="${bannerURL}">
        <div class="i">
            <h2>${Titel}</h2>
            <p>by ${Owner}</p>
            <bar><inner style="width: ${likePercentage}%;"></inner></bar>
            <button onclick='openGame("${ii}")'><i class="fa-solid fa-play fa-xl"></i> Play</button>
        </div>
        <div class="z">
            <hr>
            <a>Information:</a>
            <br>
            <div class="y">
                <p>Created:<br> ${Realesae}</p>
                <p>Last Update:<br> ${lastUpdate}</p>
                <p>Author:<br> ${Owner}</p>
                <p>Modus:<br> ${Modus}</p>
                <p>Language:<br> ${lang}</p>
            </div>
        </div>`
      setInterval(function(){document.getElementById("arrow-left-back").innerHTML = `<i style="color: red;" class="fa-solid fa-arrow-left"></i>`},2002)
      document.body.appendChild(e)
    },10)
  }
}

function logout(){
  localStorage.setItem('login', null)
  window.location.href = "/"
}

function loaders(){
  let elements = document.querySelectorAll('#dotloader')
  for(let i = 0; i<elements.length;i++){
    let s = elements[i]    
    s.innerHTML = "."
  }
  setTimeout(function(){
      for(let i = 0; i<elements.length;i++){
        let s = elements[i]
        s.innerHTML = ".."
      }
      setTimeout(function(){
        for(let i = 0; i<elements.length;i++){
          let s = elements[i]
          s.innerHTML = "..."
        }
        setTimeout(function(){
          for(let i = 0; i<elements.length;i++){
            let s = elements[i]
            s.innerHTML = ""
          }
      },250)
    },250)
  },250)
}

let handynavDebounce = false;

document.getElementById('sidenava').addEventListener("click", function(){
    if(document.getElementById('topnav').style.top == "-100%" && handynavDebounce == false){
        document.getElementById('sidenava').getElementsByTagName('i')[0].style.rotate = "90deg"
        document.getElementById('topnav').style.display = ""
        setTimeout(() => {
            document.getElementById('topnav').style.top = "0px"            
        }, 1);
        document.body.style.overflow = "hidden"
    } else if(handynavDebounce == false){
        handynavDebounce = true
        document.getElementById('sidenava').getElementsByTagName('i')[0].style.rotate = "0deg"
        document.getElementById('topnav').style.top = "-100%"
        setTimeout(() => {
            document.getElementById('topnav').style.display = "none"
          handynavDebounce = false
        }, 500);
        document.body.style.overflow = ""
    }
});

let alredylisted = false;

async function fetchGames() {
    try {
        const response = await fetch('/games.json');
        games = await response.json();
        if(!alredylisted){
          alredylisted = true
          for (let i = 0; i < games.length; i++) {
            const s = games[i];
            let image = s.image
            let element = document.createElement('div')
            element.className = "game"
            
            if(image == ""){
              image = "/src/unknowCover.png"
            }
            
            element.innerHTML = "<img onclick='window.location.href = `https:/`+`/nicoot.glitch.me/main/in.html?ShowGameID="+s.gameid+"`' src='"+image+"'><a>by "+s.author+"</a><br>" + s.name + "<button onclick='openGame(`" + i + "`)'><i class='fa-solid fa-play'></i></button>"
            if(s.display == true){
              document.getElementById('games').appendChild(element)
            } else if(login == "nico"){
              document.getElementById('games').appendChild(element)
            }
          }
        }
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

function openGame(i){
  document.getElementById('iframe').style.display = "block"
  document.getElementById('iframe').src = games[i].url
  document.getElementById('GameStop').style.display = ""
  document.body.style.overflowY = "hidden"
  document.getElementById('iframe').scrollIntoView()
}

function loadFriends(){ //<div><div></div><a>Bot</a><span>spielt nichts</span></div>
  document.getElementById('friends').innerHTML = ""
  let friennds = mydata.friends
  for(let i = 0; i < friennds.length; i++){
    let s = friennds[i]
    let ele = document.createElement('div')
    ele.id = s+"friends"
    ele.innerHTML = "<div></div><a>" + s + "</a><span>...</span>"
    document.getElementById('friends').appendChild(ele)
  }
  
  setTimeout(function(){
    design()
  },200)
}

function design(){
  let friennds = mydata.friends
  for(let i = 0; i < friennds.length; i++){
    let s = friennds[i]
    let color = null
    
    for(let i = 0; i < colors.length; i++){
      if(s == colors[i].name){
        color = colors[i].color
      }
    }
    
    document.getElementById(s+"friends").querySelectorAll('div')[0].style.background = color
  }
}

let MessageAlredy = false

function showSystemNicootMessage(title, Subtitle){
  if(!MessageAlredy){
    MessageAlredy = true
    document.getElementById('MessagesFromSystem').style.display = ""
    document.getElementById('MessagesFromSystem').getElementsByTagName('a')[0].innerHTML = title
    document.getElementById('MessagesFromSystem').getElementsByTagName('a')[1].innerHTML = Subtitle
    if(mydata.MessageSound == "1"){
      document.getElementById('Message1Sound').play()
    } else if(mydata.MessageSound == "2"){
      document.getElementById('Message2Sound').play()
    } else if(mydata.MessageSound == "3"){
      document.getElementById('Message3Sound').play()
    } else if(mydata.MessageSound == "4"){
      document.getElementById('Message4Sound').play()
    } else if(mydata.MessageSound == "5"){
      document.getElementById('Message5Sound').play()
    } else {document.getElementById('Message1Sound').play()}
    setTimeout(function(){
      MessageAlredy = false
      document.getElementById('MessagesFromSystem').style.display = "none"
    },4999)
  } else {
    setTimeout(function(){
      showSystemNicootMessage(title, Subtitle)
    },200)
  }
}

