let room = "";
let players = [];
let turn    = 1;

let matchMaking = () =>{
  let name = localStorage.getItem('name');

  mqClient.publish('matchmaking', JSON.stringify({name, client_id}))
}


let plotGamePlayerList = (players) =>{
  if(players.length > 0){
    for(var x = 0; x < players.length; x++){
      let you   = localStorage.getItem("name");
      let ifyou = you == players[x].name ? "(You)" : ""
      $('#player_list').append(`<h5>${players[x].name} ${ifyou}</h5>`)
    }
  }
}

let sendDicePosition = (position) =>{
  let data = {action: "roll", position};
  if(turn == 1){
    mqClient.publish(room, JSON.stringify(data));
  }
}

matchMaking();



mqClient.on('message', (topic, data) =>{
  data = JSON.parse(data.toString())
  console.log(data)
  switch (topic){
    case client_id:
      plotGamePlayerList(data.players);
      mqClient.subscribe(data.room)
      room    = data.room;
      players = data.players;
      break;
    // case room:
    //     if(data.action == "roll"){
    //       plotDice(data);
    //     }
    //   break;
  }
    
});