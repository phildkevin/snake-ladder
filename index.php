<!DOCTYPE html>
<html>
<head>
	<title>Snake and Ladder</title>
	<link rel="stylesheet" type="text/css" href="assets/bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="assets/bootstrap/fa/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="assets/css/style.css">
	<script type="text/javascript" src="assets/js/jquery.min.js"></script>
</head>
<body>

<div class="container mt-50">
	<div class="row">
		<div class="col-md-9">
			<table class="table table-striped table-bordered main_table" id="main_table">
				<tbody>
					<img class="ladder1" src="assets/images/ladder.png">
					<tr class="col_10">
						<td  align="center" class="100" data-value="100"><i class="fa fa-flag"></i></td>		
					</tr>

					<tr class="col_9"></tr>
					<tr class="col_8"></tr>
					<tr class="col_7"></tr>
					<tr class="col_6"></tr>
					<tr class="col_5"></tr>
					<tr class="col_4"></tr>
					<tr class="col_3"></tr>
					<tr class="col_2"></tr>

					<tr class="col_1">
						<td  align="center" class="1" data-value="1">Start</td>
					</tr>

				</tbody>
			</table>
		</div>
		<div class="col-md-3">
			<div class="dice" align="center">
				<div class="row">
					<div class="col-md-12">
						<img src="assets/images/dice/dice-roll.gif" id="dice-roll" class="img-responsive hide">
						<img src="assets/images/dice/dice-6.png" id="dice-6" class="img-responsive dice-number hide">
						<img src="assets/images/dice/dice-5.png" id="dice-5" class="img-responsive dice-number hide">
						<img src="assets/images/dice/dice-4.png" id="dice-4" class="img-responsive dice-number hide">
						<img src="assets/images/dice/dice-3.png" id="dice-3" class="img-responsive dice-number hide">
						<img src="assets/images/dice/dice-2.png" id="dice-2" class="img-responsive dice-number hide">
						<img src="assets/images/dice/dice-1.png" id="dice-1" class="img-responsive dice-number hide">
						<span id="dice_first">Roll</span>
					</div>
					<button type="button" id="btn-roll-dice" class="btn btn-info form-control mt-50">ROLL</button>
				</div>
			</div>
		</div>
	</div>
</div>


<script type="text/javascript">
	var first_roll = 0;

	$(function(){
		loadTables();
	});

	$(document).on('click', '#btn-roll-dice', function(){
		var min	 = 1; 
    var max  = 7;  
    var rand = Math.floor(Math.random() * (+max - +min)) + +min; 

    $(this).addClass('hide');
    $('#dice_first').addClass('hide');
    $('#dice-roll').removeClass('hide');
    $('.dice-number').addClass('hide');

    setTimeout(function(){
    	$('#btn-roll-dice').removeClass('hide');
    	$('#dice-roll').addClass('hide');
    	$(`#dice-${rand}`).removeClass('hide');
    	goUp(rand);
    }, 1000);

	});

	let goUp = (number) => {
		var table = $('#main_table');

		if(first_roll != 0){

			var div_active = table.find('.roll_active');
			var last_value = div_active.data('value');

			div_active.removeClass('roll_active');

			if(number+last_value > 100){
				var last_number = number + last_value;
				var new_number  = 100 - (last_number - 100);
				div_active.parent().parent().find(`.${new_number}`).addClass('roll_active');
			}else{

				div_active.parent().parent().find(`.${number+last_value}`).addClass('roll_active');
				if(div_active.parent().parent().find(`.${number+last_value}`).data('value') == 100){
					alert('Congratulations');
					location.reload();
				}


			}

		}else{

			if(number == 1){
				useLadder(table, number)
			}else{
				table.find(`.${number}`).addClass('roll_active');
			}
			first_roll = 1;
		}
	}

	let useLadder = (table, number) => {
		switch(number){
			case 1 : 
				table.find('.38').addClass('roll_active');
			break;
		}
	}

	let loadTables = () => {
		var table  = $('#main_table');

		var col_10 = col_9 = col_8 = col_7 = col_6 = col_5 = col_4 = col_3 = col_2 = col_1 = ``;

		var c_10 = _10 = v_10 = 99;
		var c_9  = _9  = v_9  = 81;
		var c_8  = _8  = v_8  = 80;
		var c_7  = _7  = v_7  = 61;
		var c_6  = _6  = v_6  = 60;
		var c_5  = _5  = v_5  = 41;
		var c_4  = _4  = v_4  = 40;
		var c_3  = _3  = v_3  = 21;
		var c_2  = _2  = v_2  = 20;
		var c_1  = _1  = v_1  = 2;

		for(var a = 9; a > 0; a--){
			col_10 += `
				<td align="center" class="${_10--}" data-value="${v_10--}">${c_10--}</td>
			`;
		}

		for(var b = 0; b < 10; b++){
			col_9 += `
				<td align="center" class="${_9++}" data-value="${v_9++}">${c_9++}</td>
			`;

			col_7 += `
				<td align="center" class="${_7++}" data-value="${v_7++}">${c_7++}</td>
			`;

			col_5 += `
				<td align="center" class="${_5++}" data-value="${v_5++}">${c_5++}</td>
			`;

			col_3 += `
				<td align="center" class="${_3++}" data-value="${v_3++}">${c_3++}</td>
			`;
		}

		for(var c = 10; c > 0; c--){
			col_8 += `
				<td align="center" class="${_8--}" data-value="${v_8--}">${c_8--}</td>
			`;

			col_6 += `
				<td align="center" class="${_6--}" data-value="${v_6--}">${c_6--}</td>
			`;

			col_4 += `
				<td align="center" class="${_4--}" data-value="${v_4--}">${c_4--}</td>
			`;

			col_2 += `
				<td align="center" class="${_2--}" data-value="${v_2--}">${c_2--}</td>
			`;
		}

		for(var d = 0; d < 9; d++){
			col_1 += `
				<td align="center" class="${_1++}" data-value="${v_1++}">${c_1++}</td>
			`;
		}

		table.find('.col_10').append(col_10);
		table.find('.col_9').append(col_9);
		table.find('.col_8').append(col_8);
		table.find('.col_7').append(col_7);
		table.find('.col_6').append(col_6);
		table.find('.col_5').append(col_5);
		table.find('.col_4').append(col_4);
		table.find('.col_3').append(col_3);
		table.find('.col_2').append(col_2);
		table.find('.col_1').append(col_1);

	}
</script>


<script type="text/javascript" src="assets/bootstrap/js/bootstrap.min.js"></script>

</body>
</html>