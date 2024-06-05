function load() {
    deleteElements()
    name()
    snackbar('Warnung! Die Website ist in der Alpha version.','warn')
    loadmusik()
    loadingscreen()
    musiktest()
}

var close = document.getElementsByClassName("closebtn");
var i;

for (i = 0; i < close.length; i++) {
  close[i].onclick = function(){
    var div = this.parentElement;
    div.style.opacity = "0";
    setTimeout(function(){ div.style.display = "none"; }, 500);
  }
}

function deleteElements() {
    var elements = document.getElementsByTagName('body')[0].children;
    for (var i = elements.length - 1; i >= 0; i--) {
        if (elements[i].tagName !== 'SCRIPT') {
            if (elements[i].tagName !== 'HEADER') {
                if (elements[i].tagName !== 'META') {
                    if (elements[i].tagName !== 'STYLE') {
                        if (elements[i].tagName !== 'LINK') {
                            if (elements[i].tagName !== 'TITLE') {
                                 if (elements[i].tagName !== 'A') {
                                    if (elements[i].tagName !== 'STYLE') {
                                        if (elements[i].tagName !== 'SECTION') {
                                            if (elements[i].tagName !== 'DIV') {
                                                if (elements[i].tagName !== 'FOOTER') {
                                                  if (elements[i].tagName !== 'NAV') {
                                                     if (elements[i].tagName !== 'UL') {
                                                       if (elements[i].tagName !== 'AUDIO') {
                                                          elements[i].parentNode.removeChild(elements[i]);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
}
function name() {
    document.getElementById("name").innerHTML = login;
}


function snackbar(text, type) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    if (type == "warn") {x.innerHTML = '<a style="color: orange">' + text + '</a>';} else {x.innerHTML = text;}
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function loadingscreen() {
    document.getElementById('id01').style.display='block'
    setTimeout(offloadingscreen, 500);
}
function offloadingscreen() {
    document.getElementById('id01').style.display='none';
}