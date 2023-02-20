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


var inplay_credit = 0
var bank_credit = 100
var current_player = true
var player_counter = [0,0,0]

var player1_coin = document.createElement('div')
player1_coin.setAttribute('id','player_coin1')
player1_coin.innerText = 'Player'


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
function gamble(){
    gamble_button.addEventListener('click', gamble_function)
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
    update_bank((bank_credit + inplay_credit))
    update_inplay(0)
}
function gamble_function() {
    dice_rolled()
}

function start_function() {
    update_bank(bank_credit - 1)
    dice_rolled()
}

function dice_rolled(){
    lights_off()
    var dicenumber_rolled = random()
    //var dicenumber_rolled = 5
    dice_number.innerText = dicenumber_rolled
    append_element(player_picker(), dicenumber_rolled)
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

function lights_off(){
    var lineItem = document.querySelectorAll('.lightable')
    lineItem.forEach((item, index) => { // Add item to closure
    setTimeout(() => { // Removed i from closure
            var old_id = item.id;
            item.innerHTML = "";
            item.innerText = old_id;
    }, 5 * (index + 1)) // Increase the delay time by 20ms for each item
});
}


function box_generate(i){
    var light_active_box = document.createElement('div')
    light_active_box.setAttribute('id','light_active')
    return light_active_box;
}

function box_generate(i){
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
        }, 5 * (index + 2)) // Increase the delay time by 20ms for each item
    });
}

function append_element(player, dicenumber_rolled){
    if(reset_game === true) {
        var player_next_position = document.getElementById(id_creator(0))
        player_next_position.append(player1_coin)
        player_counter[player] = 0
        paytable_state = [0,0,0,0,0,0,0,0]
        for(i=0; i<win_single_symbols.length; i++){
            var light_paytable_id = '.lightable_paytable_' + win_single_symbols[i] 
            var lineItem = document.querySelectorAll(light_paytable_id)
            lineItem.forEach((item, index) => { // Add item to closure
                    item.innerHTML = ""
            });
        }
        reset_game = false
    }
    setTimeout(() => { // Removed i from closure
        counter(player)
        console.log(player_counter[player])
        update_log(player_counter[player], 'roll_regular')
        update_inplay(0)
        var player_next_position = document.getElementById(id_creator(player_counter[player]))
        player_next_position.append(player1_coin)
        reset_game = true
        snake_or_ladder(player_counter[player],player)
        payout_check(player_counter[player],player)
        lights_on(player_counter[player])
        options_after_game()
    }, 500) // Increase the delay time by 20ms for each item

}

function options_after_game() {
    if(reset_game === true) {
        options_after.innerText = "start (from 0)"
        options_after_reason.innerText = "(hit empty tile, lost any inplay credit)"
    }
    if(reset_game === false) {
        if(inplay_credit > 0) {
        options_after.innerText = "continue or collect "+inplay_credit
        options_after_reason.innerText = "(you risk losing all inplay credit)"

        } else {
            options_after.innerText = "continue"
            options_after_reason.innerText = "(you have hit a single fruit, ladder or snake)"
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

function update_paytable_single(symbol_id) {
    update_log(player_counter[1], paytable_payout[symbol_id])
    if(paytable_state[symbol_id] > 1) {
        update_inplay(paytable_payout[symbol_id] + inplay_credit)
        paytable_state[symbol_id] = 0
    } else {
        paytable_state[symbol_id] = (paytable_state[symbol_id] + 1)
        update_log(player_counter[1], "Paytable state updated to: "+paytable_state[symbol_id])
    }
    paytable_lights_update(symbol_id, paytable_state[symbol_id])
}

function paytable_lights_update(symbol_id,state){
    var class_paytable = '.lightable_paytable_' + symbol_id
    var lineItem = document.querySelectorAll(class_paytable)
    lineItem.forEach((item, index) => { // Add item to closure
    setTimeout(() => { // Removed i from closure
        var box_id = (item.id).replace('paytable_lightable_', '');
        if(box_id < (state+1)) {
            item.append(box_generate(box_id))
            item.innerText = "LIGHT"
        }
        }, 5 * (index + 2)) // Increase the delay time by 20ms for each item
    });
}

function payout_check(counter,player){
    for(d=0; d<win_3x_pos.length; d++){
        if(counter == win_3x_pos[d]){
            update_inplay(win_3x_payout[d] + inplay_credit)
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









