// export asc function to global or just define it before async fuctions, rename it as you like

exports.asc = asc = function (gen) {
    var fn = gen();
    function handle(result) {
        if (result.done)
            return result.value;
        if (result.value && typeof result.value.then == "function") {   // Promise
            return result.value.then(
                function (res) {
                    return handle(fn.next(res));
                },
                function (err) {
                    return handle(fn.throw(err));
                }
            );
        }else{
            return handle(fn.next());  // normal generator
        }
    }
    return handle(fn.next());
}
