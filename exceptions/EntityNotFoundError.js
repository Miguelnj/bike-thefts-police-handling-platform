class EntityNotFoundError extends Error{
    constructor(message) {
        super(message);
        this.name = "EntityNotFoundError";
    }
}

module.exports = EntityNotFoundError;