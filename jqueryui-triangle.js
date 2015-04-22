(function() {

    $.fn.triangle = function(opts){

        var _triangle = function(elem, position, callback) {
            var pinContainer = $('.ui-triangle-pin-container')

            var containerWidth = pinContainer.width();
            var containerHeight = pinContainer.height();
            var elementWidth = $(elem).width()
            var elementHeight = $(elem).height()

            var x = position.left + elementWidth / 2;
            var y = position.top + elementHeight / 2;
            var elteres = Math.abs(x - containerWidth / 2);
            var min_y = containerHeight * (elteres / (containerWidth / 2));
            
            if (y < min_y) { y = min_y; }
            if (x < 0) { x = 0; }
            if (y < 0) { y = 0; }
            if (x > containerWidth) { x = containerWidth; }
            if (y > containerHeight) { y = containerHeight; }

            position.top = y - elementHeight / 2;
            position.left = x - elementWidth / 2;

            var _perc = function(max, current, reverse) {
                var perc;
                perc = Math.floor((100 / max) * current);
                if (reverse) {
                    perc = 100 - perc;
                }
                return perc;
            };

            var cornerTop = _perc(containerHeight, y, true, false);
            var cornerLeft = _perc(containerWidth, x, true, cornerTop);
            var cornerRight = _perc(containerWidth, x, false, cornerTop);

            if (cornerTop > 50) {
                cornerLeft -= cornerTop - 50;
                cornerRight -= cornerTop - 50;
            }

            if (cornerTop > 66) {
                cornerLeft -= (cornerTop + cornerRight) - 100;
                cornerRight -= (cornerTop + cornerLeft) - 100;
            }

            if (cornerLeft > 50) {
                cornerRight -= (cornerTop - 50) + (cornerLeft - 50);
            } else if (cornerRight > 50) {
                cornerLeft -= (cornerTop - 50) + (cornerRight - 50);
            }

            if (cornerTop < 0) { cornerTop = 0; }
            if (cornerLeft < 0) { cornerLeft = 0; }
            if (cornerRight < 0) { cornerRight = 0; }

            if(callback){
                callback({ position: position, corners: [cornerTop, cornerLeft, cornerRight]})
            }
            return position;
        };

        if(!opts){ opts = {} }
        opts = $.extend({ colors: false, callback: false }, opts)

        elem = $(this);

        elem.html('<div class="ui-triangle-container"><div class="ui-triangle"></div><div class="ui-triangle-pin-container"><div class="ui-triangle-pin"></div></div></div>');
        if(opts.colors){
            elem.find('.ui-triangle').html('<div class="ui-triangle-corner ui-triangle-corner-top"></div><div class="ui-triangle-corner ui-triangle-corner-left"></div><div class="ui-triangle-corner ui-triangle-corner-right"></div>');
        }

        var pinElem = elem.find('.ui-triangle-pin');
        elem.find('.ui-triangle-container').click(function(e) {
            var parentContainer = $(this).offset();
            var newPosition = {
                top: (e.pageY - parentContainer.top) - 10,
                left: (e.pageX - parentContainer.left) - 20
            };
            pinElem.css(_triangle(pinElem, newPosition, opts.callback));
        });

        pinElem.draggable({
            drag: function(e, ui) {
                _triangle(this, ui.position, opts.callback);
            }
        });
    }

})();
