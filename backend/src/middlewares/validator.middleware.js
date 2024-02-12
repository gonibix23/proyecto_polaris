export const validateSchema = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.errors });
    }
}