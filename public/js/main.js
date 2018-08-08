var offset = 0;
var limit = 811;
var geturl = "http://www.pokeapi.co/api/v2/pokemon/?offset=" + offset + "&limit=" + limit;
var pockemons = [];
var focusNumber = -1;

var pockInput = document.getElementById('search');
var pockList = document.getElementById('pockelist');


function sendRequest(geturl){
  var getlist = new XMLHttpRequest(); 
  getlist.open('GET', geturl, false); 
  getlist.send();
  if (getlist.status != 200) {
    alert( getlist.status + ': ' + getlist.statusText );
  } else {
    var pockemonsObj = JSON.parse(getlist.responseText);
    pockemons = pockemonsObj.results;
  };  
};

sendRequest(geturl);

function filterPockemons(prefix, pockemons) {
  if(pockInput.value.length > 1 ) {
   return pockemons.filter(function (el) {
    var regexp = new RegExp(prefix, 'gi');
     return el.name.match(regexp);            
    });
  };
};

function showSuggestions() {
  pockList.innerHTML = '';
  pockList.classList.remove("is-selected");
  var matchedPocks = filterPockemons(this.value, pockemons);
  if(pockInput.value.length > 1 ) {
      var size = 5;
      var names = matchedPocks.slice(0, size).map(function(el) {
        var listitem = document.createElement("LI");
        var listlink = document.createElement("A");                 
        var suggesttext = document.createTextNode(el.name);  
        listlink.href = '#';
        listlink.appendChild(suggesttext)       
        listitem.appendChild(listlink);                             
        pockList.appendChild(listitem);
      });
  
    var links =  document.getElementsByTagName('A');
    for(var i=0; i<links.length; i++) {
    //Event hendlers for mobile tap    
      links[i].onclick = function(e){
        pockInput.value = e.target.textContent;
        pockList.className += " is-selected";
        return false;
      }; 
    };
  };
};

function listNavigation(e) {
  if (e.keyCode == 40) {  
    listStep(+1);
  };
  if(e.keyCode==38) {
    listStep(-1);
  };
  if(e.keyCode==8 || e.keyCode==39) {
    focusNumber = -1;
  };
};

function listStep(num) {
  focusNumber += num;
  if (focusNumber >= pockList.childNodes.length) {
    focusNumber = pockList.childNodes.length - 1;
  };
  if (focusNumber < 0) {
    focusNumber = 0;
  };
  var selected = pockList.childNodes[focusNumber];
  selected.id += "selected-li";
  selected.className += 'current';               
};

function choosePockemon(e){
  if (e.keyCode == 13 && pockList.childNodes.length ) {             
    pockInput.value = pockList.childNodes[focusNumber].textContent;
    pockList.className += " is-selected";

  };
};
function chooseMobile(e){
  pockInput.value = e.target.textContent;
  pockList.className += " is-selected";
}

pockInput.addEventListener('change', showSuggestions);
pockInput.addEventListener('keyup', showSuggestions);
pockInput.addEventListener('keyup', listNavigation);
pockInput.addEventListener('keyup', choosePockemon);
