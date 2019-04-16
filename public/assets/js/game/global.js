
let host        = "ws://owl-mqtt.herokuapp.com:80";
let c_type    	= location.protocol;
let client_id   = "client_" + getCookie('client_id');
let url         = window.location.href;
let room        = url.split("/").pop();
let will        = {topic: "leavematch", payload: JSON.stringify({client_id, room})};
let mqClient    = mqtt.connect(host, {clientId: client_id, qos: 1, will});

mqClient.subscribe(client_id, {qos: 1});
mqClient.subscribe(`room_${room}`, {qos: 1});



function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}