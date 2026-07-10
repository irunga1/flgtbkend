class DataValidator {
    constructor(firstProp = null) {
        this.firstProp = firstProp;
    }
                mailValidator = (mail) => {
                const regex = /^[A-Za-z0-9.-_@]+$/
                let isTrue = regex.test(mail);
                return isTrue;
            }
            
            nameValidator = (name) => {
                const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
                return regex.test(name);
            }
            // ✅ Validar números de teléfono (solo dígitos, opcional + al inicio)
            phoneValidator = (phone) => {
                const regex = /^\+?[0-9]{7,15}$/;
                return regex.test(phone);
            }

            // ✅ Validar montos (números enteros o decimales con punto)
            amountValidator = (amount) => {
                const regex = /^\d+(\.\d{1,2})?$/;
                return regex.test(amount);
            }

            // ✅ Validar textos (permitir letras, números, espacios y signos: , . : ? ! tildes)
            textValidator = (text) => {
                const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s,.:?!]+$/;
                return regex.test(text);
            }
            numValidator = (num) => {
                const regex = /^[0-9]+$/
                let isTrue = regex.test(num)

                return isTrue;
            }
            
}

// 🔎 Ejemplos de uso
// let obj = new DataValidator();

// console.log(obj.nameValidator("José Pérez"));          // true
// console.log(obj.mailValidator("usuario@mail.com"));    // true
// console.log(obj.phoneValidator("+50212345678"));       // true
// console.log(obj.amountValidator("1234.50"));           // true
// console.log(obj.textValidator("¡Hola, cómo estás?"));  // true

module.exports = DataValidator;