let o = "Diamond 5 5"
console.log(o.split(' ')[2])

dealerHand = {
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
    'hand1' : 0,
    'hand2' : 0,
    'hand3' : 0,
    'hand4' : 0,
    'hand5' : 0,
    'hand6' : 0
}
for(let str in dealerHand){
    console.log(str)
}