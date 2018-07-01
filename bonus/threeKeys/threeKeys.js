/******************
 *  threeKeys.js  *
 * by paulcdejean *
 ******************
 * Here's the first non trivial level I was able to think of.
 * You can beat this without overwriting functions or any other
 * funny business so try and stay honest!
 */

function startLevel(map) {
    map.placePlayer(7, 5);

    // The basic level layout.
    for (y = 0; y <= map.getHeight(); y++) {
        map.placeObject(16, y, 'block');
        map.placeObject(32, y, 'block');
    }

    for (x = 17; x <= 31; x++) {
    	map.placeObject(x, 7, 'block');
	map.placeObject(x, 17, 'block');
    }

    map.placeObject(24, 3, 'redKey');
    map.placeObject(24, 12, 'greenKey');
    map.placeObject(24, 21, 'blueKey');

    map.placeObject(map.getWidth()-7, map.getHeight()-5, 'exit');

    // You might find this useful.
    map.placeObject(8, 6, 'phone');
    map.placeObject(5, 5, 'teleporter');
    map.defineObject('bullet',{
    	'type':'dynamic',
    	'symbol':'.',
        'color' : 'red',
    	'interval':100,
    	'projectile': true,
    	'behavior': function(me) {
        	me.move('down')
        }
    });
    var i = 0;
    var telX = [22, 22, 22, 40];
    var telY = [5, 10, 20, 15];
    var t1, t2;
    map.getPlayer().setPhoneCallback(function(){
    	if ((i % 2) == 0) {
    		map.placeObject(telX[i/2], telY[i/2], 'teleporter');
            map.getDynamicObjects().forEach(function(el) {
            	if (el.getX() == 5 && el.getY() == 5) {
                	t1 = el;
                } else if (el.getType() == 'teleporter') {
                	t2 = el;
                }
            });
            t1.setTarget(t2);
        	t2.setTarget(t1);
    	} else {
    		map.placeObject(t2.getX(),(t2.getY() - 1), 'bullet');
  		}
     	i = (i + 1) % 8;
    });
}

function validateLevel(map) {
    // No creating exits!
    map.validateExactlyXManyObjects(1, 'exit');

    // No cheating please!
    map.validateExactlyXManyObjects(0, 'theAlgorithm');

    // You need to pick up the keys, not create them.
    map.validateAtMostXObjects(1, 'redKey');
    map.validateAtMostXObjects(1, 'greenKey');
    map.validateAtMostXObjects(1, 'blueKey');

    // This is the puzzle :)
    map.validateAtMostXDynamicObjects(3);
}


function onExit(map) {
    if (!map.getPlayer().hasItem('redKey')
        || !map.getPlayer().hasItem('greenKey')
        || !map.getPlayer().hasItem('blueKey')) {
        map.writeStatus("Collect all 3 keys before exiting!");
        return false;
    } else {
        return true;
    }
}
