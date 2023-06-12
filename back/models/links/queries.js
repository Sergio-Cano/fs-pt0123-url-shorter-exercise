const { sql } = require("slonik");

const insertShortLink = (shortURL, originURL, user) => sql.unsafe`
    INSERT INTO links (
        short_url, origin_url, created_by
    ) VALUES (
        ${shortURL}, ${originURL}, (SELECT id FROM users WHERE email = ${user}) 
    )
`

const addUses = (url, isCreator) => {

    if(isCreator) {
        return sql.unsafe`
            UPDATE links
            SET uses = uses + 1, uses_by_creator = uses_by_creator + 1
            WHERE short_url = ${url}
        `
    } else {
        return sql.unsafe`
            UPDATE links
            SET uses = uses + 1
            WHERE short_url = ${url}
        `
    }
}

const getCreatorUser = (url) => sql.unsafe`
    SELECT email FROM users
    INNER JOIN links ON users.id = links.created_by
    WHERE short_url = ${url}
`

const getOriginalURL = (url) => sql.unsafe`
    SELECT origin_url FROM links
    WHERE short_url = ${url}
`

module.exports = {
    insertShortLink,
    addUses,
    getCreatorUser,
    getOriginalURL,

}