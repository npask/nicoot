var vor = 'none'
var jetzt = 'none'
var nownum = '0'
var testlist = null;
function inmusik(path,title,titlea,author,chose) {
    jetzt = path;
    var norm = "<div class='Song' onclick="+ '"' +"setIT('"+ path +"', '"+ author +"', '"+ titlea +"')" + '"' +"><img src='https://nmusik-data.netlify.app/musik/"+ path +"/cover.png'></img><a class='right'><img src='data/image/play.png' width='30px' height='27px'></a><br><br><a>"+ title +"</a><br><a class='von' id='test'>"+ author +"</a></div>";
    var filt = "<div class='Song' onclick="+ '"' +"setIT('"+ path +"', '"+ author +"', '"+ titlea +"')" + '"' +"><img src='https://nmusik-data.netlify.app/musik/"+ path +"/cover.png' style='filter: blur(5px);'><span class='Center'>Cover Gespert</span></img><a class='right'><img src='data/image/play.png' width='30px' height='27px'></a><br><a>"+ title +"</a><br><a class='von' id='test'>"+ author +"</a></div>";
    var lont = "<div class='Song' onclick="+ '"' +"setIT('"+ path +"', '"+ author +"', '"+ titlea +"')" + '"' +"><img src='https://nmusik-data.netlify.app/musik/"+ path +"/cover.png'></img><a class='right'><img src='data/image/play.png' width='30px' height='27px'></a><br><a>"+ title +"</a><br><a class='von' id='test'>"+ author +"</a></div>";
    var lona = "<div class='Song' onclick="+ '"' +"setIT('"+ path +"', '"+ author +"', '"+ titlea +"')" + '"' +"><img src='https://nmusik-data.netlify.app/musik/"+ path +"/cover.png'></img><a class='right'><img src='data/image/play.png' width='30px' height='27px'></a><br><br><a>"+ title +"</a><br><a class='vong' id='test'>"+ author +"</a></div>";
    if (path!='✔') {testlist = testlist+"if(musik=='"+ vor+"'){setIT('"+ path +"', '"+ author +"', '"+ titlea +"')};"} else {console.log(testlist.substring(4))}
    if (path!='✔') {if ( chose == "1") {document.getElementById('musik').innerHTML = filt+document.getElementById('musik').innerHTML;} else if(chose=="2"){document.getElementById('musik').innerHTML = lont+document.getElementById('musik').innerHTML;} else if(chose=='3') {document.getElementById('musik').innerHTML = lona + document.getElementById('musik').innerHTML;} else {document.getElementById('musik').innerHTML = norm +  document.getElementById('musik').innerHTML;}} else {document.getElementById('for').innerHTML = document.getElementById('for').innerHTML+"}"}
    if (vor != jetzt) {vor = jetzt}
    nownum += 1;
}
function loadmusik() {
    inmusik('say_so','Say So','Say So','Doja Cat','1')
    inmusik('therapy','Therapy','Therapy','Crono','0',)
    inmusik('flovers', 'Flovers', 'Flovers', 'Miley Cyrus','0',)
    inmusik('night_dancer', 'Night Dancer', 'Night Dancer', 'imase','0',)
    inmusik('multidimensional', 'Multidimensional', 'Multidimensional', 'Sarah, the Illstrumentalist','3')
    inmusik('mach_die_robbe', 'Mach die Robbe', 'Mach die Robbe', 'Julien Bam','0')
    inmusik('turn_up', 'Turn Up', 'Turn Up', 'Monako','0')
    inmusik('friday', 'Friday', 'Friday', 'Mufasa & Hypeman','0')
    inmusik('kann_es_sein_das_du_dumm_bist', 'Kann es sein, dass <a>du dumm bist?<a>', 'Kann es sein, dass du dumm bist?', 'Das Lumpenpack','2')
    inmusik('feuerwerk', 'Feuerwerk (Lyrics)', 'Feuerwerk (Lyrics)', 'Wincent Weiss','0')
    inmusik('we_are_the_robots', 'We Are the Robots', 'We Are the Robots', 'Insan3lik3(feat. Temu)','0')
    inmusik('west_coast', 'West Coast', 'West Coast', 'OneRepublic','0')
    inmusik('i_aint_worried', "I Aint Worried", "I Aint Worried", 'OneRepublic','0')
    inmusik('sunshine', 'Sunshine', 'Sunshine', 'OneRepublic','0')
    inmusik('keep_it_running', 'Keep it Running', 'Keep it Running', 'imprismed','0')
    inmusik('super_sonic_racing', 'Super Sonic <a>Racing</a>', 'Super Sonic Racing', 'Unbekannt','2')
    inmusik('how_about_an_old_fashioned', 'How About an Old <a>Fashioned</a>', 'How About an Old Fashioned', 'Harper Rey','2')
    inmusik('hayat', 'Hayat', 'Hayat', 'OOYY','0')
    inmusik('1am_omw', '1am Omw', '1am Omw', 'Ballpoint','0')
    inmusik('its_not_me', 'Its Not Me', 'Its Not Me', 'Arthur Benson','0')
    inmusik('reese_puff', 'Mario tries Reese’s <a>puffs</a>', 'Mario tries Reese’s puffs', 'Beenux','2')
    //Das als letztes
    inmusik('✔')
}