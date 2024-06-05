var volx = 1;
var ti1 = "N Musik x Player";
var ti2 = document.getElementById('titlea').innerHTML;
var yes = 'false';
var musik = 'none'
var playsound = "0"
function musiktest() {
    if(ti1 == ti2) {yes = 'true';}
}
function Update() {
    var musik = document.getElementById('a');
    var progressed = document.getElementById('progressed');
    progressed.style.width = Math.floor(((musik.currentTime*100/musik.duration))) +"%"
    if(yes == 'true') {
        var progressedflat = document.getElementById('progressedflat');
        var progress_barflat = document.getElementById('progress_barflat');
        progressedflat.style.width = Math.floor(((musik.currentTime*100/musik.duration))) +"%"
        progress_barflat.style.display = "block"
    }
};
function usongcs(e) {
    setTime((e.offsetX/progress_bar.offsetWidth)*document.getElementById('a').duration)
}
function Play() {document.getElementById("a").play();}
function Pause() {document.getElementById("a").pause();}
function zf() {document.getElementById("a").currentTime +=10;}
function zz() {document.getElementById("a").currentTime -=10;}
function setVolumer(voly) {volx = voly;
setVolume(volx)}
function setVolume(vol) {document.getElementById("a").volume = vol;}
function LOOP() {if (document.getElementById("LT").innerHTML == '<i class="fa-solid fa-rotate-left fa-spin fa-spin-reverse fa-2xl" style="color: #2ef531;"></i>') {document.getElementById("LT").innerHTML = '<i class="fa-solid fa-rotate-left fa-2xl"></i>'}else{document.getElementById("LT").innerHTML = '<i class="fa-solid fa-rotate-left fa-spin fa-spin-reverse fa-2xl" style="color: #2ef531;"></i>'}}
document.addEventListener('keydown', (e) => {
    if (e.code === "Space") {
    toggle()
    }
});
function END() {if (document.getElementById("LT").innerHTML == '<i class="fa-solid fa-rotate-left fa-spin fa-spin-reverse fa-2xl" style="color: #2ef531;"></i>'){ document.getElementById('a').play()} else {testofskip()}
}
function Playing() {document.getElementById('toggle').innerHTML = '<i class="fa-solid fa-pause fa-2xl" style="color: #2cf243;"></i>'
if(yes == 'true'){togglef('<i class="fa-solid fa-pause fa-2xl" style="color: #2cf243;"></i>')}}
function Paused() {document.getElementById('toggle').innerHTML = '<i class="fa-solid fa-play fa-2xl" style="color: #2cf243;"></i>'
if(yes == 'true'){togglef('<i class="fa-solid fa-play fa-2xl" style="color: #2cf243;"></i>')}}
function toggle() {if(playsound == "0"){playsound += 1;testofskip()} if (document.getElementById("a").paused) {Play()} else {Pause()}}
function setImage(path) {document.getElementById('imag').innerHTML = '<img src="https://nmusik-data.netlify.app/musik/'+ path + '/cover.png" class="imageso">'
if(yes == "true"){document.getElementById('image').innerHTML = '<img src="https://nmusik-data.netlify.app/musik/'+ path + '/cover.png" class="imagef">'
document.getElementById('background').style.backgroundImage = 'url(https://nmusik-data.netlify.app/musik/'+ path + '/cover.png)'}}
function setTime(Time) {document.getElementById("a").currentTime = Time}
function setText(author, title, path) {
    document.getElementById("TT").innerText = title;
    document.getElementById("TA").innerText = author;
    document.getElementById("titlea").innerText = "N Musik x " + title;
    seeMusik()
    snackbar('N Musik Player spielt ' + title + ' von ' + author + '.', 'norm')
    if (yes=="true") {setTextF(author,title)}
}
function seeMusik() {
   document.getElementById('tf').id = 't'
   document.getElementById('ttf').innerHTML = '<span id="tf"></span>'
}
function setMusik(path) {
    playsound += 1
    document.getElementById('d').style.display = "none"
    document.getElementById('da').innerHTML = '<audio id="a" ontimeupdate="Update()" onended="END()" onpause="Paused()" onplaying="Playing()"><source id="s" src="https://nmusik-data.netlify.app/musik/'+ path +'/sound.mp3" type="audio/mpeg"></audio>';
    setImage(path)
    setVolume(volx)
    setTimeout(() => {
        musik = path
        Play()
    }, 500);
}
function Apple(author,title,path) {
    if ('mediaSession' in navigator) {

        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'N Musik spielt '+title,
          artist: author,
          album: 'N Musik',
          artwork: [
            { src: 'https://nmusik-data.netlify.app/musik/'+path+'/cover.png', sizes: '96x96',   type: 'image/png' },
            { src: 'https://nmusik-data.netlify.app/musik/'+path+'/cover.png', sizes: '128x128', type: 'image/png' },
            { src: 'https://nmusik-data.netlify.app/musik/'+path+'/cover.png', sizes: '192x192', type: 'image/png' },
            { src: 'https://nmusik-data.netlify.app/musik/'+path+'/cover.png', sizes: '256x256', type: 'image/png' },
            { src: 'https://nmusik-data.netlify.app/musik/'+path+'/cover.png', sizes: '384x384', type: 'image/png' },
            { src: 'https://nmusik-data.netlify.app/musik/'+path+'/cover.png', sizes: '512x512', type: 'image/png' },
          ]
        });
      
        navigator.mediaSession.setActionHandler('play', Play());
        navigator.mediaSession.setActionHandler('pause', Pause());
        navigator.mediaSession.setActionHandler('seekbackward', function() {});
        navigator.mediaSession.setActionHandler('seekforward', testofskip());
        navigator.mediaSession.setActionHandler('previoustrack', function() {});
        navigator.mediaSession.setActionHandler('nexttrack', testofskip());
      
      }
}
function setIT(path, author, title) {setMusik(path); setText(author, title,path);if (navigator.vendor != null && navigator.vendor.match(/Apple Computer, Inc./) && navigator.userAgent.indexOf('Safari') != -1){console.log('Apple');document.getElementById('apple').innerHTML="true"}else if (navigator.vendor == null || navigator.vendor != null){console.log('Not Apple')}}


