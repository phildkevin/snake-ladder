
let host        = "ws://owl-mqtt.herokuapp.com:80";
let c_type    	= location.protocol;
let random    	= Math.random().toString().replace(/\./ig, '');
let client_id   = "client_" + random;
let mqClient    = mqtt.connect(host, {clientId: client_id, qos: 1});

mqClient.subscribe(client_id, {qos: 1});
mqClient.subscribe('snakeroom');
