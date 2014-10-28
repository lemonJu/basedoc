(function(basejs) {
    if (!basejs) return;
    var extend = function(src, dest) {
        for (var i in src) {
            dest[i] = src[i];
        }
    };

    var basejsM = {
        test: function() {
            alert()
        },
        map: {
            core: "../samples/dom",
            anim: "../samples/animate",
            judge: "../samples/judge",
            io: "../samples/ajax"
        }
    };

    extend(basejsM, basejs);
})(basejs);
