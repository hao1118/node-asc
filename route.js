//asc function sample to check input and update the model

var DataModel = require('./datamodel')    //DataModel is a Mongoose document model

var check = function(model, url, errors){
    return function*(){     //a generator function
        var m = yield DataModel.findOne({url: model.url}).exec();    //Mongoose query.exec returns Promise
        if (m && m.id != model.id){
            errors.url='url already exists.'    //url must be unique
            return false;  //or throw new Error('url already exists.');
        }
        model.url = url;
        return true;
    }
}

router.post('/savedata/:someid', function (req, res, next) {
    asc(function*() {
        var model = yield DataModel.findOne({id: someid}).exec();   //Mongoose query.exec returns Promise
        var url = req.body.url;    //try to update the model.url to this url.
        var errors = {};
        var ok = yield asc(check(model, url, errors));    //child asc function inside main asc function, returns generator
        /* or:
        try{
            var ok = yield asc(check(model, url, errors));
        }catch(err){
            res.send('ERROR: ' + err.message);
        }
        */
        if (ok) {
            yield model.save();
            res.render('sucess_page');
        } else {
            res.render('error_page', {errors: errors});
        }
    });
});
