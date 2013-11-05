

/*

# NameSet
# Name

 */

/** @namespace */
var rld = rld || {};

rld.NameSet = function( id ) {

    // private properties
    var _self = this;
    
    // name lists
    var _persons   = [];
    var _drawn     = [];
    var _available = [];

    // public properties
    this.id = id || 'unknown';

    // public methods
    
    this.reset = function() {
        _persons   = [];
        _drawn     = [];
        _available = [];
    }; 

    this.resetDrawing = function() {
        _drawn     = [];
        _available = _persons.slice(0); // clone
    };

    this.addPerson = function( p_or_first, last ) {
        if( p_or_first instanceof rld.Person ) {
            _persons.push( p_or_first );
            _available.push( p_or_first );
            return p_or_first;
        }
        var p = new rld.Person( p_or_first, last );
        _persons.push( p );
        _available.push( p );
        return p;
    };

    this.drawName = function( person ) {

        var candraw = [];
        var j, i = _available.length;
        var p, flag = false, noDraw;

        while( i-- ) {
            p = _available[ i ];
            noDraw = person.getCantDrawList();
            j = noDraw.length;
            flag = false;
            while( j-- ) {
                if( p === noDraw[ j ] ) {
                    flag = true;
                } 
            }
            if( !flag ) candraw.push( p );
        }

        var luckyone = candraw[ ~~( Math.random() * candraw.length ) ];

        i = _available.length;
        while( i-- ) {
            if( _available[ i ] === luckyone ) {
                _drawn.push( _available.splice( i, 1 )[0] );
                break;
            }
        }

        return luckyone || person;
    };

    this.drawAllNames = function() {

        _self.resetDrawing();

        var i = _persons.length;
        var p;
        while( i-- ) {
            p = _self.drawName( _persons[i] );
            console.log( _persons[i].first + ' has ' + p.first );
        }

        if( p === _persons[i+1] ) {
            // try again
            _self.drawAllNames();
        }
    }

}


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

}