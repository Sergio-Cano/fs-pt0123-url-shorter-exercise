module.exports = () => {
    const chars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let randomStr = "";
    for (let i=0; i<8; i++) {
        randomStr += chars[Math.floor(Math.random() * chars.length)];
    }

    return randomStr;
}