let room = "";
let players = [];

let matchMaking = () =>{
  let name = localStorage.getItem('name');

  mqClient.publish('matchmaking', JSON.stringify({name, client_id}))
}


let plotGamePlayerList = (players) =>{
  if(players.length > 0){
    var player = ``;
    for(var x = 0; x < players.length; x++){
      let you   = localStorage.getItem("name");
      let ifyou = you == players[x].name ? "(You)" : players[x].name;

      console.log(players[x].name);
      if(players[x].name == you){
        player = `
          <div class="other-player active">
            <span class="other-player-info">${ifyou}<b class="other-player-stat">(title)</b></span>
          </div>
        `;
      }else{
        player = `
          <div class="other-player">
            <span class="other-player-info">${players[x].name}<b class="other-player-stat">(title)</b></span>
          </div>
        `;
      }

      $('#other-player-list').append(player);

    }
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
  }
    
});