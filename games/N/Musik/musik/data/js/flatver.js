function openflatver() {document.getElementById('flatver').style.display='block';}
function closeflatver() {document.getElementById('flatver').style.display='none';}
function setTextF(author,title) {
    document.getElementById('tfl').innerText = title
    document.getElementById('afl').innerText = author
}
function togglef(content) {
    document.getElementById('togglef').innerHTML = content
}