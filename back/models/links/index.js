const { insertShortLink, getCreatorUser, addUses, getOriginalURL } = require("./queries");

const createShortLink = (db) => async (shortURL, originURL, email) => {
    try {
        await db.query(insertShortLink(shortURL, originURL, email));

        return {
            ok: true
        }
    } catch (error) {
        console.info('> generate short link error: ', error.message)
        return {
            ok: false,
            message: error.message,
        }
    }
}

const getCreator = (db) => async (url) => {
    try {
        const data = await db.query(getCreatorUser(url));

        return data.rows;
    } catch (error) {
        console.info('> get creator error: ', error.message)
        return {
            ok: false,
            message: error.message,
        }
    }
}

const getOriginURL = (db) => async (url, user) => {
    const [ {email: creator} ] = await getCreator(await db)(url);
    
    creator === user ? await db.query(addUses(url, true)) : await db.query(addUses(url, false));

    try {
        const data = await db.query(getOriginalURL(url));

        const [originalURL] = data.rows;

        return {
            ok: true,
            data: originalURL
        }
    } catch (error) {
        console.info('> get origin url error: ', error.message)
        return {
            ok: false,
            message: error.message,
        }
    }
}

module.exports = {
    createShortLink,
    getOriginURL,
    
}