class CannotResolveBikeCase extends Error{
    constructor(message) {
        super(message);
        this.name = "CannotResolveBikeCase";
    }
}

module.exports = CannotResolveBikeCase;