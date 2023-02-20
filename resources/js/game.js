var dice_button = document.getElementById('dice_button')
var collect_button = document.getElementById('collect_button')
var gamble_button = document.getElementById('gamble_button')
var reset_game = false

var dice_number = document.getElementById('dice_number')
var inplay_number = document.getElementById('inplay_number')
var credit_number = document.getElementById('credit_number')
var snake_array = [20,33,41,44,47]
var snake_final_pos = [9,12,4,31,0]
var ladder_array = [1,3,18,24,40]
var ladder_final_pos = [11,17,28,45,42]

var win_3x_pos = [2,8,13,19,27,34,38,45]
var win_3x_payout = [2,4,6,8,10,14,20,30]

var player1_coin = document.createElement('div')
player1_coin.setAttribute('id','player_coin1')
player1_coin.innerText = 'PLAYER'


var inplay_credit = 0
var bank_credit = 100
var current_player = true
var player_counter = [0,0,0]

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
        player_counter[player] = 0
        reset_game = false
    }
    counter(player)
    console.log(player_counter[player])
    update_log(player_counter[player], 'roll_regular')
    update_inplay(0)
    var player_next_position = document.getElementById(id_creator(player_counter[player]))
    player_next_position.append(player1_coin)
    snake_or_ladder(player_counter[player],player)
    payout_check(player_counter[player],player)
    lights_on(player_counter[player])

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

function payout_check(counter , player){
    for(d=0; d<win_3x_pos.length; d++){
        if(counter == win_3x_pos[d]){
            update_inplay(win_3x_payout[d] + inplay_credit)
        } else {
            reset_game = true
        }
    }
}

function after_snake_or_ladder(player){
    var player_next_position = document.getElementById(id_creator(player_counter[player]))
        player_next_position.append(player1_coin)
}









