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
            <BlackJackUser :hand='userHand' :computedHand='computedHand' idSn='userId' :drawnCardCount='drawnCardCount'></BlackJackUser>
        </div>
            <hr />
        <div>
            <BlackJackUser :hand='dealerHand' :computedHand='computedHand' idSn='dealer' :drawnCardCount='drawnCardCount'></BlackJackUser>
        </div>
    </div>
</template>
<script>
import cardDrawer from '../plugins/cardDrawer'
import BlackJackUser from './blackjack-user.vue'


let count = 1;
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
        
    }
    ,
    methods : {
        fnStartGame(){
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
        },
        fnHit() {
            let idx = 2 + count++
            this.$set(this.userHand, 'hand' + idx, cardDrawer(idx));

            this.drawnCardCount.userId += 1;

            this.fnComputeUserHand(this.userHand, 'userId');
            this.fnIsBoB('userId')
        },
        fnComputeUserHand(hand, id){
            let sum = 0;
            for(let elem in hand){
                let temp = parseInt((hand[elem].split(' ')[2]));
                if(temp < 11){
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
                this.userScore +=  this.bet * 2
                this.dealerScore -= this.bet
            }else if(winner == 'dealer'){
                this.userScore -= this.bet
                this.dealerScore += this.bet * 2
            }else{
                this.userScore -= this.bet
            }
            this.isGameEnd = true;
            
        },
        fnStay(){
            this.isStay = true;
            count = 1;
            if(!this.isBOB.userId.isBlackJack && !this.isBOB.userId.isBurst && (this.computedHand.dealer < 16 || this.computedHand.dealer < this.computedHand.userId)){
                this.fnDealerDraw().then((res) => {
                    this.fnComputeUserHand(this.dealerHand, 'dealer')
                    this.drawnCardCount.dealer += 1;
                    this.fnIsBoB('dealer')
                    console.log("dealer draw!")
                })
            }
             if(!this.isBOB.userId.isBlackJack && !this.isBOB.userId.isBurst && (this.computedHand.dealer < 16 || this.computedHand.dealer < this.computedHand.userId)){
                this.fnDealerDraw().then((res) => {
                    this.fnComputeUserHand(this.dealerHand, 'dealer')
                    this.drawnCardCount.dealer += 1;
                    this.fnIsBoB('dealer')
                    console.log("dealer draw!")
                })
                
            }
            setTimeout(this.fnIsWin, 8000);
        },
        fnDealerDraw(){
            let idx = 2 + count++
            this.$set(this.dealerHand, 'hand' + idx, cardDrawer(idx));
            this.fnComputeUserHand(this.dealerHand, 'dealer');
            this.fnIsBoB('dealer');
            return new Promise((resolve, reject) => {
                setTimeout( () => {
                    console.log("calculating dealer");
                    resolve();
                }, 3000)
            })
           
        },
         fnStartNewGame(){
            Object.assign(this.$data, initialState())
            count = 1;
        },

    },

    
}

function initialState(){
    return {
            gameStarted : false,
            isStay : false,
            isGameEnd : false,
            userHand : {
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
            },
            drawnCardCount : {
                'userId' : 0,
                'dealer' : 0
            }
            ,
           
            computedHand : {
                'userId' : 0,
                'dealer' : 0
            },
            dealerHand : {
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
            },
            
            
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
