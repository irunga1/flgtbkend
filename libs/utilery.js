class Utilery {
    constructor(firstProp = null) {
        this.firstProp = firstProp
    }

    sanitizeText = (strWords = "") => {
        try {
            strWords = String(strWords);
            const notAllow = ["'", '"',  "-", "_", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "+", "=", "{", "}", "[", "]", "|", "\\", "/", "<", ">", "?", "~", "`"];
            
            if (strWords !== "") {
                for (let it of notAllow) {
                    strWords = strWords.replaceAll(it, "");
                }
            }
            return strWords;
        } catch (error) {
            console.log("error", error);
            return false;
        }
    }

    sanitizeEmail = (email = "") => {
        try {
            if (email === "") return "";
            // Lowercase is generally safe for email local-part usage (we'll sanitize only)
            email = String(email).trim().toLowerCase();
            // Remove chars that are typically used for injection / breaking strings.
            const notAllow = ["'", '"', " ", "!", "#", "$", "%", "^", "&", "*", "(", ")", "+", "=", "{", "}", "[", "]", "|", "\\", "/", "<", ">", "?", "~", "`"];
            for (let it of notAllow) {
                email = email.replaceAll(it, "");
            }
            // Basic structure validation: user@domain.tld
            const match = email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/);
            if (!match) return false;

            return email;
        } catch (error) {
            console.log("error", error);
            return false;
        }
    }
    sanitizePassword = (password = "") => {
        try {
            if (password === "") return "";

            password = String(password);

            // Remove control characters and common injection-breaking characters.
            // We avoid removing too many chars to not destroy passwords.
            const notAllow = ["\n", "\r", "\t", "\0", "\\0", "\x08", "\x0b", "\x0c", "<", ">", "'", '"', "\\"]; 
            for (let it of notAllow) {
                password = password.split(it).join("");
            }

            // Optional: enforce reasonable max length (server-side)
            if (password.length > 256) return false;

            return password;
        } catch (error) {
            console.log("error", error);
            return false;
        }
    }
}
module.exports = Utilery;

