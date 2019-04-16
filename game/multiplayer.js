const mqtt = require('mqtt');

exports.initialize = (redis, uuid, config) => {
  
  var options 		= {clientId: 'gameserver', qos: 2};
  var mqttClient  = mqtt.connect(config.mqtt, options);
  mqttClient.subscribe("#");

  mqttClient.on("message", (topic, data) =>{
    data = JSON.parse(data.toString())
    switch (topic){
      case "matchmaking":
        matchMake(data);
        break;
      case "leavematch":
        leaveMatch(data);
        break;
      case "join_room":
        joinRoom(data);
        break;
    }
  })


  let matchMake = (data) =>{
    console.log("Player matchmaking: " + data.client_id);
    redis.HSET("matchmaking", data.client_id, data.name);
  }

  let leaveMatch = (data) =>{
    if(data.room != "" && data.room != "room404"){
      console.log(`Player ${data.client_id} left the game ${data.room}`);
      mqttClient.publish(data.room, JSON.stringify({"action" : "leavematch", "client_id" : data.client_id}));
      redis.HGET(`room_${data.room}`, "connected", (err, res) =>{
        if(res <= 1){
          redis.DEL(`room_${data.room}`);
        }else{
          redis.HINCRBY(`room_${data.room}`, "connected", -1);
        }
      })
    }
  }

  let joinRoom = (data) =>{
    redis.HGET(`room_${data.room}`, data.client_id, (err, res) =>{
      console.log(data.room)
      if(res == null){

      }else{
        redis.HGETALL(`room_${data.room}`, (err, res) =>{
          console.log(`[SENDING GAME PLAYERS] room: ${data.room}`)
          redis.HINCRBY(`room_${data.room}`, "connected", 1);
          mqttClient.publish(`room_${data.room}`, JSON.stringify({"action" : "join", "client_id" : data.client_id, "players": res}));
        })
      }
    })
  }


  setInterval(() =>{

    redis.HGETALL("matchmaking", (err, res) =>{
      if(err){
        console.log(err);
      }else{
        if(res !== null){
          var data = Object.entries(res)
          if(Object.keys(res).length >= 2){

            let p1 = {client_id: data[0][0], name: data[0][1], player: 1};
            let p2 = {client_id: data[1][0], name: data[1][1], player: 2};
            let players = [p1, p2];

            let room = uuid();
            let send = {players, room};

            redis.HDEL("matchmaking", p1.client_id);
            redis.HDEL("matchmaking", p2.client_id);
            redis.HSET(`room_${room}`, p1.client_id, JSON.stringify(p1));
            redis.HSET(`room_${room}`, p2.client_id, JSON.stringify(p2));
            redis.HSET(`room_${room}`, "connected", 0);

            // redis.EXPIRE(`room_${room}`, 20);

            mqttClient.publish(p1.client_id, JSON.stringify(send));
            mqttClient.publish(p2.client_id, JSON.stringify(send));

            console.log(`[Matchmaked]: ${p1.name} and ${p2.name}` )
          }
        }
      }
    })

  },500);

  

}