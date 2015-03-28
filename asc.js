// export asc function to global or just define it before async functions, rename it as you like

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
            try {
                return handle(fn.next());  // generator
            } catch (err) {
                return fn.throw(err);
            }
        }
    }
    try {
        return handle(fn.next());
    } catch (err) {
        return fn.throw(err);
    }
}
