var dice_button = document.getElementById('dice_button')
var collect_button = document.getElementById('collect_button')
var gamble_button = document.getElementById('gamble_button')
var reset_game = false

var options_after = document.getElementById('options_after')
var options_after_reason = document.getElementById('options_after_reason')

var dice_number = document.getElementById('dice_number')
var inplay_number = document.getElementById('inplay_number')
var credit_number = document.getElementById('credit_number')
var snake_array = [20,33,41,44,47]
var snake_final_pos = [9,12,4,31,0]
var ladder_array = [1,3,18,24,40]
var ladder_final_pos = [11,17,28,45,42]

var win_3x_pos = [2,8,13,19,27,34,38,46]
var win_3x_payout = [2,4,6,8,10,14,20,30]

var win_single_pos = [5,10,16,21,25,32,36,45]
var win_single_symbols = [0,1,2,3,4,5,6,7]

// symbols followed by payout once have collected 3x
// cherry(2x) -> lemon(4x) -> orange(6x) -> mango(8x) -> grapes (10x) -> bell (14x) -> melon (20x) -> bar (30x)
var paytable_state = [0,0,0,0,0,0,0,0]
var paytable_payout = [2,4,6,8,10,14,20,30]
var paytable_light_state = [0,0,0,0,0,0,0,0]


var inplay_credit = 0
var bank_credit = 500
var current_player = true
var player_counter = [0,0,0]

var player1_coin = document.createElement('div')
player1_coin.setAttribute('id','player_coin1')
player1_coin.innerText = 'P'


window.addEventListener('load',start)
window.addEventListener('load',collect)

function start(){
    if(reset_game === true) {
        player_counter = [0,0,0]
    }
    dice_button.addEventListener('click', start_function)
}

function collect(){
    collect_button.addEventListener('click', collect_function)
}

function update_bank(number) {
    bank_credit = number
    credit_number.innerText = number
}
function update_inplay(number) {
    inplay_credit = number
    inplay_number.innerText = number
}

function collect_function() {
    collect_button.disabled = true
    if(inplay_credit > 0) {
        if(reset_game === false) {
            update_bank((bank_credit + inplay_credit))
            update_inplay(0)
            reset_game = true
            collect_button.disabled = true
        }
    }
}
function gamble_function() {
    dice_rolled()
}

function start_function() {
    dice_button.disabled = true;
    collect_button.disabled = true
    options_after.innerHTML = "<span style='color: black; font-weight: 700;'>...</span>"
    options_after_reason.innerText = "(spinning game)"
    update_bank(bank_credit - 1)
    dice_rolled()
}

function dice_rolled(){
    lights_off()
    setTimeout(() => { // Removed i from closure
        var dicenumber_rolled = random()
        //var dicenumber_rolled = 5
        dice_number.innerText = dicenumber_rolled
        append_element(player_picker(), dicenumber_rolled)
    }, 250)
}

function random(){
    var random_number = Math.floor(Math.random() * 12) + 1;
    return random_number
}

function player_picker(){
        current_player = true
        return 1
}

function id_creator(num){
    var string = "box_"
    string = string + num
    return string
}

function coin_id_creator(num){
    var string = "player_coin"
    string = string + num
    return string
}

function counter(player){
    if((player_counter[player]+Number(dice_number.innerText)) > 47){
        player_counter[player] = player_counter[player]+Number(dice_number.innerText)-46
    }
    else{
        player_counter[player] = player_counter[player] + Number(dice_number.innerText)
    }
}

function update_log(new_number, roll_type) {
    previous_position.innerText = current_position.innerText 
    current_position.innerText = new_number
    event_position.innerText = roll_type
}
function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* Do nothing */ }
}

function box_generate(i){
    var light_active_box = document.createElement('div')
    light_active_box.setAttribute('id','light_active')
    return light_active_box;
}

function box_generate_paytable(i){
    var light_active_box = document.createElement('div')
    light_active_box.setAttribute('id','light_active_paytable')
    return light_active_box;
}

function lights_off(){
    var lineItem = document.querySelectorAll('.lightable')
    lineItem.forEach((item, index) => { // Add item to closure
            item.innerHTML = ""
    });
}

function lights_on(number){
        var lineItem = document.querySelectorAll('.lightable')
        lineItem.forEach((item, index) => { // Add item to closure
        setTimeout(() => { // Removed i from closure
            var box_id = (item.id).replace('lightable_', '');
            if(box_id < (number)) {
                item.append(box_generate(box_id))
            }
        }, 1 * (index + 2)) // Increase the delay time by 20ms for each item
    });
}

function append_element(player, dicenumber_rolled){
    if(reset_game === true) {
        update_inplay(0)
        var player_next_position = document.getElementById(id_creator(0))
        player_next_position.append(player1_coin)
        player_counter[player] = 0
        reset_paytable_lights()
        reset_game = false
    }
    setTimeout(() => { // Removed i from closure
        counter(player)
        console.log(player_counter[player])
        update_log(player_counter[player], 'roll_regular')
        var player_next_position = document.getElementById(id_creator(player_counter[player]))
        player_next_position.append(player1_coin)
        reset_game = true
        snake_or_ladder(player_counter[player],player)
        payout_check(player_counter[player],player)
        lights_on(player_counter[player])
        options_after_game()
    }, 350) 
}

function options_after_game() {
    if(reset_game === true) {
        update_inplay(0)
        reset_paytable_lights()
        dice_button.disabled = false;
        options_after.innerHTML = "<span style='color: red; font-weight: 700;'>start again (lost)</span>"
        options_after_reason.innerText = "(empty tile, lost all inplay cr)"
    }
    if(reset_game === false) {
        if(inplay_credit > 0) {
        dice_button.disabled = false;
        collect_button.disabled = false;
        options_after.innerHTML = "<span style='color: green; font-weight: 700;'>continue or collect "+inplay_credit+"</span>"
        options_after_reason.innerText = "(you risk losing all inplay cr)"

       } else {
            collect_button.disabled = false;
            dice_button.disabled = false;
            options_after.innerHTML = "<span style='color: orange; font-weight: 700;'>continue</span>"
            options_after_reason.innerText = "(hit single fruit, ladder or snake)"
        }
    }
}

function snake_or_ladder(counter , player){
    for(i=0; i<snake_array.length; i++){
        if(counter == snake_array[i]){
            player_counter[player] = snake_final_pos[i]
            after_snake_or_ladder(player)
            update_log(snake_final_pos[i].toString(), 'roll_snake-'+snake_array[i]+'to'+player_counter[player])
        }
    }
    for(j=0; j<ladder_array.length; j++){
        if(counter == ladder_array[j]){
            player_counter[player] = ladder_final_pos[j]
            after_snake_or_ladder(player)
            update_log(ladder_final_pos[j].toString(), 'roll_ladder-'+ladder_array[j]+'to'+player_counter[player])
        }
    }
}

function reset_paytable_lights() {
    paytable_light_state = [0,0,0,0,0,0,0,0]
    paytable_state = [0,0,0,0,0,0,0,0]
    for(i=0; i<win_single_symbols.length; i++){
        var light_paytable_id = '.lightable_paytable_' + win_single_symbols[i] 
        var lineItem = document.querySelectorAll(light_paytable_id)
        lineItem.forEach((item, index) => { // loop through all symbols and set lightable div empty
                item.innerHTML = ""
        });
    }
}

function update_paytable_single(symbol_id) {
    paytable_state[symbol_id] = (paytable_state[symbol_id] + 1)
    if(paytable_state[symbol_id] > 2) {
        if(paytable_state[symbol_id] < 4) {
        update_inplay(paytable_payout[symbol_id] + inplay_credit)
        //paytable_state[symbol_id] = 0
        }
        paytable_light_state[symbol_id] = 3;
    } else {
        paytable_light_state[symbol_id] = (paytable_state[symbol_id])
        update_log(player_counter[1], "Paytable state updated to: "+paytable_state[symbol_id])
    }
    paytable_lights_update(symbol_id, paytable_light_state[symbol_id])
}

function paytable_lights_update(symbol_id,state){
    var class_paytable = '.lightable_paytable_' + symbol_id
    var lineItem = document.querySelectorAll(class_paytable)
    lineItem.forEach((item, index) => { // Add item to closure
    setTimeout(() => { // Removed i from closure
        var box_id = (item.id).replace('paytable_lightable_', '');
        if(box_id < (state+1)) {
            item.append(box_generate_paytable(box_id))
        }
        }, 2 * (index + 2)) // Increase the delay time by 20ms for each item
    });
}

function payout_check(counter,player){
    for(d=0; d<win_3x_pos.length; d++){
        if(counter == win_3x_pos[d]){
            var win3x_payout_symbol = win_single_symbols[d];
            update_inplay(win_3x_payout[d] + inplay_credit)
            paytable_lights_update(win3x_payout_symbol, (paytable_light_state[win3x_payout_symbol] + 3))
            reset_game = false
        }
    }
    for(e=0; e<win_single_pos.length; e++){
        if(counter == win_single_pos[e]){
            update_paytable_single(win_single_symbols[e])
            reset_game = false
        }
    }
}

function after_snake_or_ladder(player){
    var player_next_position = document.getElementById(id_creator(player_counter[player]))
        player_next_position.append(player1_coin)
        reset_game = false
}









