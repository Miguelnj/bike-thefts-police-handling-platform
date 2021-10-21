class MissingParametersError extends Error{
    constructor(message) {
        super(message);
        this.name = "MissingParametersError";
    }
}

module.exports = MissingParametersError;