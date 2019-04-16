let players       = [];
let players_id    = [];
let turn          = "";
let connected     = 0;
let player_turn   = [];



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
  console.log("[JOINING GAME] ROOM: " + room)
  mqClient.publish("join_room", JSON.stringify({room, client_id}));
}

let gameStart = (data) =>{
  connected  = data.players.connected;
  turn = data.players.first_turn;
  delete data.players.connected;
  delete data.players.first_turn;
  players = Array.from(Object.values(data.players));
  plotGamePlayerList(players);

  $(`#span-${turn}`).addClass('active');
  if(turn == client_id){
    $('#btn-roll-dice').prop('disabled', false);
    $('#dice_first').html("Roll");
  }else{
    $('#btn-roll-dice').prop('disabled', true);
  }

}

let playerTurn = (data) =>{
  console.log(data)
  if(data.next_turn == client_id){
    $('#btn-roll-dice').prop('disabled', false);
    $('#dice_first').html("Roll");
  }else{
    $('#btn-roll-dice').prop('disabled', true);
  }

  turn = data.next_turn;
  player_turn = data.player_turn;
}

let plotGamePlayerList = (players) =>{
  if(players.length > 0){
    var player = ``;
    for(var x = 0; x < players.length; x++){
      let you     = localStorage.getItem("name");
      let pdata   = JSON.parse(players[x]);
      let ifyou   = you == pdata.name ? "(You)" : pdata.name;
      
      if(players_id.indexOf(pdata.client_id) == -1){
        players_id.push(pdata.client_id);
        player_turn.push(pdata.client_id);
      }

      if(pdata.name == you){
        player += `
          <div class="other-player" id="span-${pdata.client_id}">
            <span class="other-player-info">${ifyou}<b class="other-player-stat">(title)</b></span>
          </div>
        `;
      }else{
        player += `
          <div class="other-player" id="span-${pdata.client_id}">
            <span class="other-player-info">${pdata.name}<b class="other-player-stat">(title)</b></span>
          </div>
        `;
      }

      if(pdata.client_id == turn){
        $('#dice_first').html(`${pdata.name} turn`);
      }


    }
  }
  $('#other-player-list').html(player);
}

let sendDicePosition = (position) =>{
  let data = {action: "roll", position};
  if(turn == client_id){
    mqClient.publish(room, JSON.stringify(data));
  }
}

let nextTurn = (data) =>{
  if(turn == client_id){
    if(player_turn.indexOf(client_id) != -1){
      if(player_turn.length == 1){
        player_turn = players_id;
      }

      if(player_turn.indexOf(client_id) > -1){
        player_turn.splice(player_turn.indexOf(client_id), 1);
      }

      next_index  = Math.floor(Math.random() * Math.floor(player_turn.length));
      next_turn   = player_turn[next_index];

      console.table({player_turn, players_id, client_id})


      console.log("[NEXT] : " + next_turn)

      mqClient.publish(`room_${room}`, JSON.stringify({"action" : "turn", next_turn, player_turn}))
    }
  }
}


mqClient.on('connect', () =>{
  if(room != "" && room.length == 36){
    mqClient.subscribe(client_id, {qos: 2});
    mqClient.subscribe(`room_${room}`, {qos: 2});
    joinGame();

  }
})

mqClient.on('message', (topic, data) =>{
  data = JSON.parse(data.toString())
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
              gameStart(data);
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

$(function() {
  // if(room != "" && room.length == 36){
  //   joinGame();
  // }
});
