const DataValidator = require("../libs/datavalidator");

const validateRequest = (req, res, next) => {
    try {
        const dv = new DataValidator();
        const payload = {
            ...req.body,
            ...req.query,
            ...req.params
        };

        const invalidFields = [];

        Object.entries(payload).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                return;
            }

            if (typeof value === "object" && !Array.isArray(value)) {
                return;
            }

            const normalizedKey = String(key).toLowerCase();
            let isValid = true;

            if (/email/.test(normalizedKey)) {
                isValid = dv.mailValidator(String(value));
            } else if (/phone|telefono/.test(normalizedKey)) {
                isValid = dv.phoneValidator(String(value));
            } else if (/monto|amount/.test(normalizedKey)) {
                isValid = dv.amountValidator(String(value));
            } else if (/id|rol|usuario|proyecto|freelancer|skill|aplicacion/.test(normalizedKey)) {
                isValid = dv.numValidator(String(value));
            } else if (/descripcion|mensaje|titulo|nombre|name|apellido|apellidos|detalle|contenido|comment|texto/.test(normalizedKey)) {
                isValid = dv.textValidator(String(value));
            }

            if (!isValid) {
                invalidFields.push(key);
            }
        });

        if (invalidFields.length > 0) {
            return res.status(400).json({
                status: "error",
                desc: "invalid Data",
                invalidFields
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ status: "error", desc: error.message });
    }
};

module.exports = validateRequest;
