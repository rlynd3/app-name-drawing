/** @namespace */
var rld = rld || {};

/**
 * [Person description]
 * @param {[type]} first [description]
 * @param {[type]} last  [description]
 */
rld.Person = function( first, last ) {

    // private properties
    var _self = this;
    var _cantDrawList = [_self];

    // public properties
    this.first = first || 'joe';
    this.last  = last  || 'schmo';

    // public methods
    
    /**
     * 
     */
    this.addCantDraw = function( /* ...person */ ) {
        var i = arguments.length;
        while( i-- ) {
            if( arguments[ i ] instanceof rld.Person ) {
                _cantDrawList.push( arguments[ i ] );
            }
        }
    };

    this.getCantDrawList = function(){ return _cantDrawList; };

};