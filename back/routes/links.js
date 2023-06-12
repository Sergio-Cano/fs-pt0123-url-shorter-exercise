const router = require("express").Router();
const { authorizer } = require("../middlewares");
const linkControllers = require("../controllers/links")

module.exports = (db) => {
    router.post("/generator", authorizer, linkControllers.generateURL(db));
    router.get("/:id", authorizer, linkControllers.getURL(db));

    return router;
}