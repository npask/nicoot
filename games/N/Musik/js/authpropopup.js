// (c) AuthPro JS v1.0

class AuthPro {
  acc= ''
  initiated = false
  auth_url = "https://www.authpro.com/auth/{user}/"
  popup = null
  popup_type = null
  popup_loaded = false

  constructor(acc) {
    if (! acc) throw new Error("No AuthPro username specified");
    this.auth_url=this.auth_url.replace(/{user}/,acc);
    this.acc=acc;
    //alert(this.auth_url);
    //document.addEventListener("DOMContentLoaded", function(){ this.initDOM.bind(this) } );
    document.addEventListener("DOMContentLoaded", this.initDOM.bind(this), false );
    this.initiated=true;
  }

  initDOM() {
    let ec = document.querySelectorAll('.ap_popup');
    for (let e of ec) {
      let a=e.getAttribute('data-action');
      e.addEventListener('click', (e) => { e.preventDefault(); this.Popup(a); }, false);
    }
    let lc = document.getElementsByTagName('a');
    for (let l of lc) {
      let a=l.getAttribute('href'); //alert(a);
      let r=a.match(/^authpro:(\w+)$/);
      if (r) { l.addEventListener('click', (e) => { e.preventDefault(); this.Popup(r[1]); }, false); }
    }

    document.addEventListener('click', (e) => { 
      //console.log(e.target);
     //e.preventDefault();
      if (this.popup===null) { return; }
      if (!this.popup_loaded) { return; }
      if (!document.getElementById('ap_form_box').contains(e.target)) {
        this.popup_remove();
      }
    });
    // load css
    let head = document.getElementsByTagName('HEAD')[0];
    let csslink = document.createElement('link');
    csslink.rel = 'stylesheet';
    csslink.type = 'text/css';
    csslink.href = 'https://www.authpro.com/css/apbuttons.css';
    document.head.appendChild(csslink);
  }


  json_url(a) { if (!a) throw new Error("empty action request"); return this.auth_url+'?mode=API_JSON&action='+a; }
  async json_get(a) { let r = await fetch(this.json_url(a)); let rj=await r.json(); return rj; } //.then((r) => (r.json())).then((d) => { return(d.message); }); },
  tc(d,c) { 
  	let dn='apc_'+this.acc+'_'+c.toLowerCase() ;
  	if (!d) { console.warn("no container id specified at "+c+', using '+dn); d=dn; }
  	if (document.getElementById(d)==null) {
  	  console.warn('container '+d+' does not exists, creating new one for '+c);
  	  let s = document.createElement('span'); s.id=d; document.currentScript.parentNode.appendChild(s); 
  	}
  	return d;
  }
  resp(d,g) { 
  	if (g.result!='OK') { console.warn('bad result in '+this.resp.caller.name+': '+g.message); } 
  	else { document.getElementById(d).innerHTML=g.message; } 
  }

  async Members_count(d) { d=this.tc(d,'Members_count'); let g = await this.json_get('members_count'); this.resp(d,g); }
  async Members_online_count(d) { this.tc(d,'Members_online_count'); let g = await this.json_get('members_online_count'); this.resp(d,g); }

  popup_loadone() {
    let a=this.popup_type; //console.log(this);
    let cb=this.popup.querySelector("#ap_form_cb");
    if (cb) {
      cb.style.display='block';
      cb.addEventListener('click', (e) => { this.popup_remove(); }, false );
    }
    if (a == '') { //login
      var aplinks=this.popup.querySelectorAll("a");
      for (let apl of aplinks) {
        let r=apl.href.match(/^https?:\/\/[/w.]+authpro\.com[\w\/&\?=-]+action=(\w+)/);
        //if (r) { apl.href="javascript:this.Popup('"+r[1]+"')"; }
        if (r) { apl.addEventListener('click', (e) => { e.preventDefault(); this.Popup(r[1]); }, false); }
      }
    }
    this.popup_type=a;
    this.popup_loaded=true;
  //alert(p.right);
  }
  popup_remove() {
    if (this.popup_loaded) {
      this.popup.parentNode.removeChild(this.popup);
      this.popup_type=null;
      this.popup_loaded=false;
    }
  }

  Popup(a) {
//  alert(this.auth_url+a);
  	if (a=='login') a='';
	this.popup_remove();
  	var ap_pop_css = document.createElement('style');
  	ap_pop_css.innerHTML = "#ap-modal-pop { display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.5); backdrop-filter: blur(5px);}";
  	document.head.appendChild(ap_pop_css);
  	var ap_pop_div=document.createElement("div");
  	ap_pop_div.id = 'ap-modal-pop';
  	ap_pop_div.innerHTML = '<span id="ap_login_up"></span>';
  	var ap_pop_script = document.createElement("script");
  	ap_pop_script.src = this.auth_url + '?mode=JS&JSid=ap_login_up&cb=1&action=' + a;
  	ap_pop_script.addEventListener("load", this.popup_loadone.bind(this), false ); //this.popup_loadone(a)
  	ap_pop_div.appendChild(ap_pop_script); 
  	//console.log(ap_pop_script);
  	document.body.appendChild(ap_pop_div);
  	document.getElementById("ap-modal-pop").style.display = "block";
  	//var ap_pop_box=ap_pop_div.getElementById("ap_pop_box");
  //alert(document.getElementById("ap_form_head"));
  //document.querySelector("#ap_form_head").appendChild(ap_pop_cb); 

  	this.popup=ap_pop_div;
  	this.popup_type=a;
  }
}


