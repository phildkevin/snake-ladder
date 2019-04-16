var first_roll = 0;

	$(function(){
		loadTables();
	});

	$(document).on('click', '#btn-roll-dice', function(){
		var min	 = 1; 
    var max  = 7;  
    var rand = Math.floor(Math.random() * (+max - +min)) + +min; 

    $(this).addClass('hide');
    $(this).prop('disable', true);
    $('#dice_first').addClass('hide');
    $('#dice-roll').removeClass('hide');
    $('.dice-number').addClass('hide');

    setTimeout(function(){
    	$('#btn-roll-dice').removeClass('hide');
    	$('#dice-roll').addClass('hide');
    	$(`#dice-${rand}`).removeClass('hide');
      goUp(rand);
      nextTurn();
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