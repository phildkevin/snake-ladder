let players   = [];
let turn      = 1;
let connected = 0;



$(document).on("click", "#matchmaking", function(){
  matchMaking();
})

let matchMaking = () =>{
  let name = localStorage.getItem('name');
  console.log(name)
  if(name === null){
    swal({
      title: 'Matchmaking',
      text: "Enter username",
      input: 'text',
      showCancelButton: true,
      closeOnConfirm: false,
    }).then(function (textinput) {
      if (textinput === false) return false;

      if (textinput.value === "") {
        swal.showInputError("You need to write something!");
        return false
      }

      name = textinput.value;
      localStorage.setItem("name", name);

      swal({
        title: 'Matchmaking',
        text: 'Finding Opponents',
        type: 'info',
        showCancelButton: false,
        showConfirmButton: false,
        closeOnClickOutside: false
      })
    
      mqClient.publish('matchmaking', JSON.stringify({name, client_id}))
    })
  }else{
    swal({
      title: 'Matchmaking',
      text: 'Finding Opponents',
      type: 'info',
      showCancelButton: false,
      showConfirmButton: false,
      closeOnClickOutside: false
    })
  
    mqClient.publish('matchmaking', JSON.stringify({name, client_id}))
  }

  
}

let joinGame = () =>{
  mqClient.publish("join_room", JSON.stringify({room, client_id}));
}


let plotGamePlayerList = (players) =>{
  if(players.length > 0){
    var player = ``;
    for(var x = 0; x < players.length; x++){
      let you     = localStorage.getItem("name");
      let pdata   = JSON.parse(players[x]);
      let ifyou   = you == pdata.name ? "(You)" : pdata.name;

      if(pdata.name == you){
        player += `
          <div class="other-player active">
            <span class="other-player-info">${ifyou}<b class="other-player-stat">(title)</b></span>
          </div>
        `;
      }else{
        player += `
          <div class="other-player">
            <span class="other-player-info">${pdata.name}<b class="other-player-stat">(title)</b></span>
          </div>
        `;
      }


    }
  }

  $('#other-player-list').html(player);

}

let sendDicePosition = (position) =>{
  let data = {action: "roll", position};
  if(turn == 1){
    mqClient.publish(room, JSON.stringify(data));
  }
}

let playerTurn = (data) =>{
  if(data.turn == client_id){
    console.log("Your turn")
  }
}

mqClient.on('message', (topic, data) =>{
  data = JSON.parse(data.toString())
  console.log(data)
  switch (topic){
    case client_id:
      swal({
        title: 'Matchmaking',
        text: 'Match Found',
        type: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        closeOnClickOutside: false
      });

      setTimeout(() =>{
        window.location.href = `/game/room/${data.room}`;
      }, 2000)
      
      break;
    case `room_${room}`:
        switch (data.action){
          case "join":
            connected = data.players.connected;
            delete data.players.connected;
            players = Array.from(Object.values(data.players));
            plotGamePlayerList(players);
            break;
          case "roll":
              plotDicePosition(data);
            break;
          case "turn":
              playerTurn(data);
            break;
          case "win":
            break;
        }
      break;
  }
    
});



$(document).ready(function(){
  if(room != "" && room.length == 36){
    joinGame();
  }
})
