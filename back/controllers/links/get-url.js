const errors = require("../../misc/errors");
const { getOriginURL } = require("../../models/links");

module.exports = (db) => async (req, res, next) => {
    if(req.params.id.length < 8) return next(errors['short_url']);
    
    const url = "/short/" + req.params.id;
    
    const {email: user} = res.locals;

    const response = await getOriginURL(await db)(url, user);

    if(!response.ok) return next(errors[500]);

    const originalURL = response.data;

    //if(originalURL !== url) return next(errors['url_not_found']);

    res.status(200).json({
        success: true,
        data: originalURL
    })

    //location.href(originalURL) --- REDIRECT
}