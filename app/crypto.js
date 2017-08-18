var crypto = require("crypto"),
    algorithm = "aes-256-ctr",
    password = "Dangkhoa*7896";

module.exports = {
    encrypt: (data) => {
        var cipher = crypto.createCipher(algorithm, password);
        var crypted = cipher.update(data, "utf8", "hex");
        crypted += cipher.final("hex");
        return crypted;
    },
    decrypt: (data) => {
        var decipher = crypto.createDecipher(algorithm, password)
        var dec = decipher.update(data, "hex","utf8")
        dec += decipher.final("utf8");
        return dec;
    }
}