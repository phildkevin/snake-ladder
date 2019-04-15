const mqtt = require('mqtt');

exports.initialize = (redis, uuid, config) => {
  
  var options 		= {clientId: 'gameserver', qos: 2};
  var mqttClient  = mqtt.connect(config.mqtt, options);
  mqttClient.subscribe("#");

  mqttClient.on("message", (topic, data) =>{
    data = JSON.parse(data.toString())
    switch (topic){
      case "matchmaking":
        matchmake(data);
        break;
      case "leavematch":
        leavematch(data);
        break;
    }
  })


  let matchmake = (data) =>{
    console.log("Player matchmaking: " + data.client_id);
    redis.HSET("matchmaking", data.client_id, data.name);
  }

  let leavematch = (data) =>{
    if(data.room != ""){
      console.log(`Player ${data.client_id} left the game ${data.room}`);
      mqttClient.publish(data.room, {"action" : "leavematch", "client_id" : data.client_id});
    }
  }


  setInterval(() =>{

    redis.HGETALL("matchmaking", (err, res) =>{
      if(err){
        console.log(err);
      }else{
        if(res !== null){
          var data = Object.entries(res)
          if(Object.keys(res).length >= 2){

            

            let p1 = {client_id: data[0][0], name: data[0][1]};
            let p2 = {client_id: data[1][0], name: data[1][1]};
            let players = [p1, p2];

            redis.HDEL("matchmaking", p1.client_id);
            redis.HDEL("matchmaking", p2.client_id);

            let room = "room_" + uuid();
            let send = {players, room};

            mqttClient.publish(p1.client_id, JSON.stringify(send));
            mqttClient.publish(p2.client_id, JSON.stringify(send));

            console.log(`[Matchmaked]: ${p1.name} and ${p2.name}` )
          }
        }
      }
    })

  },500);

  

}