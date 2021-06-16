<template>
    <div>
        <span>당신의 점수 : {{userScore}}</span>
        <span>딜러의 점수 : {{dealerScore}}</span>
        <div v-if='isGameEnd'>
            <button @click="fnStartNewGame">New Game!</button>
        </div>
        <div v-show='!isGameEnd'>
            <div v-if="!gameStarted">
                <input type="text" v-model='bet' placeholder="배팅할 점수를 입력하세요"/>
                Bet : {{computedBet}}
                <button variant="success" @click='fnStartGame'> start Game</button>
            </div>
            <div v-else>  
                <div v-show='!isStay && !isBOB.userId.isBurst'>
                    <button variant="success" @click="fnHit">HIT</button>
                </div>
                <button @click="fnStay">STAY</button>
 
                <!-- <b-button variant="outline-primary" @click="fnSplit">Split</b-button> -->
            </div>
        </div>
        <div>
            <BlackJackUser :hand='userHand'  idSn='userId' :drawnCardCount='drawnCardCount'></BlackJackUser>
        </div>
            <hr />
        <div>
            <BlackJackUser :hand='dealerHand'  idSn='dealer' :drawnCardCount='drawnCardCount'></BlackJackUser>
        </div>
    </div>
</template>
<script>
import cardDrawer from '../plugins/cardDrawer'
import BlackJackUser from './blackjack-user.vue'
import Vue from 'vue'

let count = 1;
let tempSave = []
let proto_hand = {
                [Symbol.iterator] : function(){
                    return {
                        index : 0,
                        length : this.length,
                        next : function(){
                            if(this.index++ >= length){
                                if(this['hand' + index] == 0){
                                    return {done : true}
                                } 
                                return {value : this['hand' + index++], done : false}
                            }else{
                                return {done : true}
                            }
                        }
                    }   
                },
                'hand1' : "0",
                'hand2' : "0",
                'hand3' : "0",
                'hand4' : "0",
                'hand5' : "0",
                'hand6' : "0"
            }
let debouncing_var_start;
let debouncing_var_hit;
let debouncing_var_stay;
let debouncing_var_new;
export default {
    name : 'BlackJackMain',
    components : {
        BlackJackUser, 
    },
    data() {
        let obj = initialState()
        obj.dealerScore = 1000;
        obj.userScore = 1000;
        obj.bet = 0;
        return obj
       
    },
    computed : {
        computedBet : function(){
            if(this.bet < 0 || isNaN(this.bet)){
                return 0;
            }
            if(this.bet > this.userScore){
                return this.userScore
            }else if(this.bet > this.dealerScore){
                return this.dealerScore
            }else if(this.bet <= this.userScore || this.bet <= this.dealerScore){
                return this.bet
            }
        }
    }
    ,
    methods : {
        fnStartGame(){
            if(debouncing_var_start){
                clearTimeout(debouncing_var_start)
            }
            debouncing_var_start = setTimeout(() => {
                this.$set(this.userHand, 'hand1', cardDrawer(1));
    
                this.drawnCardCount.userId += 1;
                this.$set(this.userHand, 'hand2', cardDrawer(2));
                this.drawnCardCount.dealer += 1
    
                this.drawnCardCount.userId += 1;
                this.$set(this.dealerHand, 'hand1', cardDrawer(1));
                this.drawnCardCount.dealer += 1;
                this.$set(this.dealerHand, 'hand2', cardDrawer(2));
    
                this.fnComputeUserHand(this.userHand, 'userId')
                this.fnComputeUserHand(this.dealerHand, 'dealer')
                this.fnIsBoB('userId')
                this.fnIsBoB('dealer')
    
                this.gameStarted = true
            }, 200)
        },
        fnHit() {
            if(debouncing_var_hit){
                clearTimeout(debouncing_var_hit)
            }
            debouncing_var_hit = setTimeout(() => {
                let idx = 2 + count++
                this.$set(this.userHand, 'hand' + idx, cardDrawer(idx));
    
                this.drawnCardCount.userId += 1;
    
                this.fnComputeUserHand(this.userHand, 'userId');
                this.fnIsBoB('userId')
            }, 200)
        },
        fnComputeUserHand(hand, id){
            let sum = 0;
            for(let elem in hand){
                let temp = parseInt((hand[elem].split(' ')[2]));
                if(temp == 1){
                    if(this.computedHand[id] <= 11){
                        sum += 11
                    }else{
                        sum += 1
                    }
                }else if(temp < 11 ){
                    sum += temp
                }else if(temp >= 11){
                    sum += 10
                }else{
                    sum += 0;
                }
            }
            this.computedHand[id] = sum;
        },
        fnIsBoB(idSn){
            let sum = this.computedHand[idSn]
            if(sum > 21){
                this.isBOB[idSn].isBurst = true;
            }
            if(sum == 21){
                this.isBOB[idSn].isBlackJack = true;
            }
        },
        fnIsWin(){
            let winner = ""
            if(this.isBOB.userId.isBurst){
                alert("you lose");
                winner = 'dealer'
            }else if(this.isBOB.dealer.isBurst){
                alert("dealer Burst! you Win!")
                winner = 'userId'
            }else if(this.isBOB.dealer.isBlackJack && this.isBOB.userId.isBlackJack){
                alert("Draw!")
                winner = 'no one'
            }else if(this.isBOB.dealer.isBlackJack && !this.isBOB.userId.isBlackJack){
                alert("dealer BlackJack you lose!")
                winner = 'dealer'
            }else if(!this.isBOB.dealer.isBlackJack && this.isBOB.userId.isBlackJack){
                alert("BlackJack! you win")
                winner = "userId"
            }else{
                winner = this.computedHand.userId - this.computedHand.dealer > 0 ? 'userId' : 'dealer'
                if(this.computedHand.userId == this.computedHand.dealer){
                    winner = 'no one'
                }
                alert("winner is " + winner)
            }

            if(winner == 'userId'){
                tempSave.push(this.userScore +  (this.computedBet * 2))
                tempSave.push(this.dealerScore - this.computedBet)
                this.userScore = tempSave[0];
                this.dealerScore = tempSave[1];
            }else if(winner == 'dealer'){
                tempSave.push(this.userScore - this.computedBet)
                tempSave.push(this.dealerScore + (this.computedBet * 2))
                this.userScore = tempSave[0];
                this.dealerScore = tempSave[1];
            }else{
                this.userScore -= this.computedBet
            }
            this.isGameEnd = true;
            
        },
        beforeUpdate: function() {

        },
        updated : function(){
            
        }
        ,
        fnDealerTurn(){
            this.isStay = true;
            count = 1;
            if(!this.isBOB.userId.isBlackJack && !this.isBOB.userId.isBurst && (this.computedHand.dealer < 17 || this.computedHand.dealer < this.computedHand.userId)){
                    this.dealerCardDraw += 1
                    this.fnDealerDraw();
                    this.fnComputeUserHand(this.dealerHand, 'dealer')
                    this.drawnCardCount.dealer += 1;
                    this.fnIsBoB('dealer')
                   
            }
             if(!this.isBOB.userId.isBlackJack && !this.isBOB.userId.isBurst && (this.computedHand.dealer < 17 || this.computedHand.dealer < this.computedHand.userId)){
                    this.dealerCardDraw += 1
                    this.fnDealerDraw();
                    this.fnComputeUserHand(this.dealerHand, 'dealer')
                    this.drawnCardCount.dealer += 1;
                    this.fnIsBoB('dealer')
                    
                }else{
                 
                }
            
        },
        fnDealerDraw(){
            let idx = 2 + count++
            this.$set(this.dealerHand, 'hand' + idx, cardDrawer(idx));
            this.fnComputeUserHand(this.dealerHand, 'dealer');
            this.fnIsBoB('dealer');
            
           
        },
        fnStay(){
            if(debouncing_var_stay){
                clearTimeout(debouncing_var_stay)
            }
            debouncing_var_stay = setTimeout(() => {
                this.fnDealerTurn()
                setTimeout(
                    this.fnIsWin
                , this.dealerCardDraw * 3000)
            }, 200)
 
        },
         fnStartNewGame(){
            if(debouncing_var_start){
                 clearTimeout(debouncing_var_new)
            }
            debouncing_var_start = setTimeout(() => {
                Object.assign(this.$data, initialState())
                count = 1;
                tempSave = []
            }, 200)
        },

    },

    
}

function initialState(){
    return {
            gameStarted : false,
            isStay : false,
            isGameEnd : false,
            dealerCardDraw : 0,
            userHand : Object.create(proto_hand),
            drawnCardCount : {
                'userId' : 0,
                'dealer' : 0
            }
            ,
           
            computedHand : {
                'userId' : 0,
                'dealer' : 0
            },
            dealerHand : Object.create(proto_hand),
            
            
            isBOB : {
                'userId' : {
                    isBurst : false,
                    isBlackJack : false
                },
                'dealer' : {
                    isBurst : false,
                    isBlackJack : false
                }
            }
        }
}


</script>
<style scoped>

</style>
