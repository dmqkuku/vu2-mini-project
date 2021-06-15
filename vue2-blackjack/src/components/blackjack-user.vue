
<template>
    <div>
        <hr/>
        <b-card-group>
            <div v-for="(elem, idx) in unWrappedHandNumPtn" :key='idx'>
                <transition name="slide-fade" appear appear-class="slide-fade-enter" appear-active-class="slide-fade-etner-active">
                    
                    <BlackJackCard :numPtn='elem' :pattern='unWrappedHandPtn[idx]' :num='unWrappedHand[idx]'></BlackJackCard>
                </transition>            
            </div>
        </b-card-group>
    </div>
 
</template>
<script>
import BlackJackCard from './blackjack-single-card.vue'

export default {
    components : {
        BlackJackCard
    },
    name : 'BlackJackUser',
    props : {
        hand : {
            type : Object,
        },
        computedHand : {
            type : Object
        },
        idSn : {
            type : String
        },
        drawnCardCount : {
            type : Object
        }
    },
    data : {
        unWrappedHandNumPtn : [],
        unWrappedHandPtn : [],
        unWrappedHand : []
    },
    computed : {
        unWrappedHandNumPtn : function(){
            let length = this.drawnCardCount[this.idSn];
            let arr = [];
            for(let i = 1; i <= length ; i++ ){
                arr.push( (this.hand['hand' + i]).split(' ')[1] )
            }
            return arr;
        },
        unWrappedHandPtn : function(){
            let length = this.drawnCardCount[this.idSn];
            let arr = []
            for(let i = 1 ; i <= length ; i++){
                switch ( this.hand['hand' + i].split(' ')[0]) {
                    case 'Heart':{
                        arr.push('Heart')
                        break;
                    }
                    case 'Diamond':{
                        arr.push('Diamond');
                         break;
                    }
                    case 'Clover' : {
                        arr.push('Clover');
                         break;
                    }
                    case 'Spade' : {
                        arr.push('Spade');
                         break;
                    }
                }
            }
            return arr;
        },
        unWrappedHand : function(){
            let length = this.drawnCardCount[this.idSn];
            let arr = []
            for( let i = 1; i <= length ; i++ ){
                arr.push( parseInt( this.hand['hand' + i].split(' ')[2]) )
            }
            return arr;
        }

    }


}


</script>
<style scoped>
.slide-fade-etner-active{
    transition : all 3s ease;
}
.slide-fade-leave-active{
    transition : all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0)
}
.slide-fade-enter, .slide-fade-leave-to{
    transform  : translateX(10px);
    transform  : translateY(5px);
    opacity : 0;
}
</style>
