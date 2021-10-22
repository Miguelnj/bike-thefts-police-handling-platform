class CannotAssignBikeCase extends Error{
    constructor(message) {
        super(message);
        this.name = "CannotAssignBikeCase";
    }
}

module.exports = CannotAssignBikeCase;