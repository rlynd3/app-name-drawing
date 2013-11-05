// test

var set = new rld.NameSet( 'lynds' );


// global peeps
var mumu = new rld.Person( 'mumu', 'lynd' );
var pops = new rld.Person( 'pops', 'lynd' );
var ryan = new rld.Person( 'ryan', 'lynd' );
var linds = new rld.Person( 'linds', 'lynd' );
var mike = new rld.Person( 'mike', 'lynd' );
var kerry = new rld.Person( 'kerry', 'lynd' );
var steph = new rld.Person( 'steph', 'lynd' );


// can't draw
mumu.addCantDraw( pops, kerry );
pops.addCantDraw( mumu, ryan );
ryan.addCantDraw( linds, mike );
linds.addCantDraw( ryan, steph );
mike.addCantDraw( kerry, mumu );
kerry.addCantDraw( mike, pops );
steph.addCantDraw( linds );
// 

// register for drawing
set.addPerson( mumu );
set.addPerson( pops );
set.addPerson( ryan );
set.addPerson( linds );
set.addPerson( mike );
set.addPerson( kerry );
set.addPerson( steph );