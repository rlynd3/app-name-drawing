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

    // States
    this.State = {
        Home:    new HomeState( 'home', _self ),
        Create:  new CreateState( 'create', _self ),
        Results: new ResultsState( 'results', _self )
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
    this.startState( this.State.Home );


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
        var drawing = null;
        var persons = [];

        // buttons
        var drawBtn = $('#btn_draw');

        $('#btn_create_drawing').click(function(evt){
            evt.preventDefault();
            drawing = new rld.Drawing( $('#drawing_id').val() );
            /*debug*/window.drawing = drawing;
            $drawingOpt.hide('100', function() {
                $personOpt.show('100');
            });
        });        

        $('#btn_create_person').click(function(evt){
            evt.preventDefault();
            _addPerson( $('#p_first').val(), $('#p_last').val() );
        });

        drawBtn.click(function(evt) {
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
                $('<legend>').text(p.first + ' ' + p.last)
            );

            set.append(
                $('<label>').text("Who can't this person draw?").attr('for', 'select_' + id)
            );
            
            var select = $('<select id="select_' + id + '" multiple="multiple" class="fancy">')
            var name = '';

            for (var i = 0; i < persons.length; i++) {
                name = persons[i].person.first + ' ' + persons[i].person.last;
                select.append(
                    $('<option value="' + i + 1 + '">' + name + '</option>')
                );
            }

            _updatePersons( p );

            set.append( select );

            persons.push( { person: p, container: set } );

            $( '#persons' + ((persons.length-1) % 3) ).append( set );

            drawBtn.show('100');
        }

        function _updatePersons( newPeep ) {
            var name = newPeep.first + ' ' + newPeep.last;
            var select;
            for (var i = 0; i < persons.length; i++) {
                select = persons[i].container.find('select');
                select.append(
                    $('<option value="' + select.children().length + 1 + '">' + name + '</option>')
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

        // // buttons
        // var startBtn = this.$base.find('button');
        // startBtn.click(function(){
        //     owner.startState( owner.State.Create );
        // });

        function _onEnter( data ) {
            results = data;
            _self.$base.show('100');

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
                    $('<p>').text( they.first + ' ' + they.last )
                );
                var link = 'https://github/xxx/xxx/#!/' + btoa(have.first + ',' + have.last);
                container.append( 
                    $('<a href="' + link + '">').text( link )
                );

            };

        }

        function _onExit( data ) {
            _self.$base.hide('100');
        }
    }   

};