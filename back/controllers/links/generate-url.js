const errors = require("../../misc/errors");
const randomizer = require("../../misc/randomizer");
const { createShortLink } = require("../../models/links");

module.exports = (db) => async (req, res, next) => {
    const { url } = req.body;
    const shortUrl = "/short/" + randomizer();
    const {email} = res.locals;

    const response = await createShortLink(await db)(shortUrl, url, email);

    if(!response.ok) return next(errors[500]);

    res.status(200).json({
        success: true,
        data: {
            url: shortUrl
        }
    })
}