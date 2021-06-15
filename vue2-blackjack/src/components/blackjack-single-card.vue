<template>
    <b-card :class='classObject' class='mx-2 my-2' style='min-width:18rem; max-width:18rem; max-height:25rem; min-height: 25rem'>
        <div>
            <span>{{numPtn}}</span>
            <div style="height:20rem">
                <div v-for='(n,idx) in num' :key = 'idx' style = "display:inline-block" class="px-3 py-2">
                    <b-icon :icon='classSymbol' font-scale='3'></b-icon>
                </div>
            </div>
            <span>{{pattern}}</span>
        </div>
    </b-card>
</template>
<script>

export default {
    name : 'BlackJackCard',
    props : {
        numPtn : {
            type : String
        },
        pattern : {
            type : String
        },
        num : {
            type : Number
        }
    },
    data(){
        return {
            
        }
    },
    computed : {
        classObject : function(){
            return{
                'club' : this.pattern == 'Clover' ,
                'heart' : this.pattern == 'Heart' ,
                'diamond' : this.pattern == 'Diamond' ,
                'spade' : this.pattern == 'Spade' 
                }
        },
        classSymbol : function(){
            let {club = false, heart = false, diamond = false, spade = false} = this.classObject;
            if(club){
                return 'suit-club'
            }
            if(heart){
                return 'suit-heart'
            }
            if(diamond){
                return 'suit-diamond'
            }
            if(spade){
                return 'suit-spade'
            }
        }
    },
    

}
</script>
<style scoped>
    .diamond{
        border : black solid 2px;
    }
    .heart{
        border : red 2px solid;
        color : red;
    }
    .spade{
        border : grey 2px solid;
        color : grey;
    }
    .club{
        border : green 2px solid;
        color : green;
    }
</style>