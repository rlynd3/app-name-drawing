/** @namespace */
var rld = rld || {};

/**
 * [Drawing description]
 * @param {[type]} id [description]
 */
rld.Drawing = function( id ) {

    // private properties
    var _self = this;
    
    // name lists
    var _persons   = [];
    var _drawn     = [];
    var _available = [];

    // public properties
    this.id = id || null;

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

    this.getPersonByFullName = function( fullName ) {

        var i = _persons.length;

        while( i-- ) {
            if( _persons[ i ].fullName === fullName ) {
                return _persons[ i ];
            }
        }

        return null;
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
        var itr = 100; // try 100 times (max) for a solution or give up...
        return (function draw() {
            _self.resetDrawing();
            var results = [];
            var i = _persons.length;
            var p;
            var tryAgain = false;
            while( i-- ) {
                p = _self.drawName( _persons[i] );
                results.push( { they: _persons[i], have: p } );
                if(_persons[i] == p)
                {
                    tryAgain = true;
                    break;
                }
                console.log( _persons[i].fullName + ' has ' + p.fullName );
            }

            if( p === _persons[i+1] || tryAgain ) {
                // try again
                if( itr-- ) {
                    return draw();
                } else {
                    return null;
                }
            }

            return results;
        })();
    }

};