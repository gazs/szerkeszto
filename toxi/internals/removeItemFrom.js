define(function( ){
    return function(item,array){
        var index = array.indexOf(item);
        if(index > -1){
            return array.splice(index,1);
        }
        return undefined;
    };
});
