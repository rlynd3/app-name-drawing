/** @namespace */
var rld = rld || {};

/**
 * [Person description]
 * @param {[type]} first [description]
 * @param {[type]} last  [description]
 */
rld.UI = function( window, document, $ ) {
    console.log('[UI] Started!');

    // private properties
    var _self = this;
    var _currentState;

    var drawing; // global drawing instance

    // States
    this.State = {
        Home:    new HomeState( 'home', _self ),
        Create:  new CreateState( 'create', _self ),
        Results: new ResultsState( 'results', _self ),
        Reveal:  new RevealState( 'reveal', _self )
    }


    this.startState = function( state, data ) {
        if( _currentState ) {
            _currentState.exit( data );
        }

        state.enter( data );

        _currentState = state;
    }
    // public properties
    

    // public methods

    // initial state
    var hash = window.location.hash.split('!/')[1];
    if( hash ) {
        this.startState( this.State.Reveal, hash );
    } else {
        this.startState( this.State.Home );
    }


    //--------------------
    // UI States
    //--------------------    

    function error( msg ) {
        $( '#error' ).text( msg ).show('100');
    }

    //--------------------
    // UI States
    //--------------------

    function HomeState( id, owner ) {
        var _self = this;

        // IState
        this.id = id;
        this.$base = $( '#' + id );
        this.enter = _onEnter;
        this.exit = _onExit;

        // buttons
        var startBtn = this.$base.find('button');
        startBtn.click(function(evt){
            evt.preventDefault();
            owner.startState( owner.State.Create );
        });

        function _onEnter( data ) {
            _self.$base.show('100');
        }

        function _onExit( data ) {
            _self.$base.hide('100');
        }
    }

    function CreateState( id, owner ) {
        var _self = this;

        // IState
        this.id = id;
        this.$base = $( '#' + id );
        this.enter = _onEnter;
        this.exit = _onExit;

        // dom
        var $drawingOpt = $( '#drawing_options' );
        var $personOpt  = $( '#person_options' );

        // drawing app
        var persons = [];

        // buttons
        var drawBtn = $('#btn_draw');

        $('#btn_create_drawing').click(function(evt){
            evt.preventDefault();
            drawing = new rld.Drawing( $('#drawing_id').val() );
            /*debug*/window.drawing = drawing;
            $('#create h1:first').html('<i class="icon-star-empty"></i> ' + ( drawing.id || 'Secret Santa' ) );
            $drawingOpt.hide('100', function() {
                $personOpt.show('100');
            });
        });

        $('#btn_create_person').click(function(evt){
            evt.preventDefault();
            _addPerson( $('#p_first').val(), $('#p_last').val() );
        });

        drawBtn.click(function(evt) {
            // add can't select choices
            var entry, choices, p;
            for (var i = 0; i < persons.length; i++) {
                entry = persons[ i ];
                choices = entry.container.find("option:selected").map(function(){ return this.innerText }).get()
                
                for (var j = 0; j < choices.length; j++) {
                    p = drawing.getPersonByFullName( choices[ j ] );
                    if( p ) {
                        entry.person.addCantDraw( p );
                    }
                }
            }

            var results = drawing.drawAllNames();
            owner.startState( owner.State.Results, results );
        });

        function _onEnter( data ) {
            _self.$base.show('100');
        }

        function _onExit( data ) {
            _self.$base.hide('100');
        }

        function _addPerson( first, last ) {
            var p = drawing.addPerson( first, last );
            var set = $( '<fieldset>' );
            var id = p.first + '_' + p.last;
            set.attr('id', id);

            set.append(
                $('<legend>').text( p.fullName )
            );

            set.append(
                $('<label>').text("Who can't this person draw?").attr('for', 'select_' + id)
            );
            
            var select = $('<select id="select_' + id + '" multiple="multiple" class="fancy">')
            var name = '';

            for (var i = 0; i < persons.length; i++) {
                name = persons[i].person.fullName;
                select.append(
                    $('<option value="' + i + '">' + name + '</option>')
                );
            }

            _updatePersons( p );

            set.append( select );

            persons.push( { person: p, container: set } );

            $( '#persons' + ((persons.length-1) % 3) ).append( set );

            if( persons.length > 2 ) drawBtn.show('100');
        }

        function _updatePersons( newPeep ) {
            var name = newPeep.first + ' ' + newPeep.last;
            var select;
            for (var i = 0; i < persons.length; i++) {
                select = persons[i].container.find('select');
                select.append(
                    $('<option value="' + ( select.children().length ) + '">' + name + '</option>')
                );
            }
        }
    }

    function ResultsState( id, owner ) {
        var _self = this;

        // IState
        this.id = id;
        this.$base = $( '#' + id );
        this.enter = _onEnter;
        this.exit = _onExit;

        var results; // set on enter

        function _onEnter( data ) {
            results = data;
            _self.$base.show('100');

            if( !results || !results.length ) {
                error( "Oh No! Looks like we couldn't match up everyone."  );
            }

            // title
            $('#results h1:first').html('<i class="icon-star-empty"></i> ' + ( drawing.id || 'Secret Santa' ) );

            // display results and links
            var container = $( '#results_list' );
            var they, have;
            for (var i = 0; i < results.length; i++) {
                they = results[i].they;
                have = results[i].have;

                container.append( 
                    $('<hr>')
                );

                container.append( 
                    $('<p>').html( '<strong>' + they.first + ' ' + they.last + '</strong> click below to find out who you have.' )
                );

                var link = window.location + '#!/' + btoa( ( drawing.id || '' ) + ',' + they.first + ',' + they.last + ',' + have.first + ',' + have.last );
                container.append( 
                    $('<a target="_blank" href="' + link + '">').text( link )
                );

            };

        }

        function _onExit( data ) {
            _self.$base.hide('100');
        }
    }   

    function RevealState( id, owner ) {
        var _self = this;

        // IState
        this.id = id;
        this.$base = $( '#' + id );
        this.enter = _onEnter;
        this.exit = _onExit;

        function _onEnter( data ) {
            _self.$base.show('100');

            var vals      = atob( data ).split(',');
            var drawing   = vals[0] !== '' ? vals[0] : 'Secret Santa';
            var theyFirst = vals[1] || '';
            var theyLast  = vals[2] || '';
            var haveFirst = vals[3] || '';
            var haveLast  = vals[4] || '';

            if( vals.length !== 5 ) error( "Oh No! Looks like there was a little mix up with the elves and we couldn't find your drawing..." );

            $( '#reveal_draw_name' ).text( drawing );

            // display winner
            $( '#they' ).text( theyFirst );

            $( '#have' ).text( haveFirst + ' ' + haveLast );

        }

        function _onExit( data ) {
            _self.$base.hide('100');
        }
    }   

};