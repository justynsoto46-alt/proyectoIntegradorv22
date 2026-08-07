document.addEventListener("DOMContentLoaded", function () {
    const form         = document.getElementById("formulario-simulado");
    const inputTitular = document.getElementById("titular");
    const inputTarjeta = document.getElementById("numero-tarjeta");
    const inputFecha   = document.getElementById("fecha-vencimiento");
    const inputCvv     = document.getElementById("cvv");
    const btnPagar     = document.getElementById("btn-pagar");

    // Elementos de la tarjeta visual
    const visual   = document.getElementById("tarjetaVisual");
    const tvNumero = document.getElementById("tvNumero");
    const tvNombre = document.getElementById("tvNombre");
    const tvVence  = document.getElementById("tvVence");
    const tvCvv    = document.getElementById("tvCvv");
    const tvMarca  = document.getElementById("tvMarca");

    /* ===================== Utilidades de validación ===================== */

    // Detecta la marca por los primeros dígitos
    function detectarMarca(n) {
        if (/^4/.test(n)) return "visa";
        if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
        if (/^3[47]/.test(n)) return "amex";
        return "";
    }

    // Algoritmo de Luhn: valida que el número sea valido en la tarjeta 
    function luhnValido(n) {
        if (n.length < 13) return false;
        let suma = 0, alterna = false;
        for (let i = n.length - 1; i >= 0; i--) {
            let d = parseInt(n[i], 10);
            if (alterna) { d *= 2; if (d > 9) d -= 9; }
            suma += d;
            alterna = !alterna;
        }
        return suma % 10 === 0;
    }

    // Valida MM/AA: mes real (01-12) y fecha no vencida 
    function fechaValida(valor) {
        const m = valor.match(/^(\d{2})\/(\d{2})$/);
        if (!m) return false;
        const mes = parseInt(m[1], 10);
        const anio = 2000 + parseInt(m[2], 10);
        if (mes < 1 || mes > 12) return false;
        const finDeMes = new Date(anio, mes, 0, 23, 59, 59); // último día del mes
        return finDeMes >= new Date();
    }

    // Agrupa los dígitos (amex 4-6-5, resto 4-4-4-4)
    function agrupar(n, marca) {
        const grupos = marca === "amex" ? [4, 6, 5] : [4, 4, 4, 4];
        let res = [], i = 0;
        for (const g of grupos) {
            if (i >= n.length) break;
            res.push(n.substr(i, g));
            i += g;
        }
        if (i < n.length) res.push(n.substr(i));
        return res.join(" ");
    }

    /* ===================== Formateo de inputs ===================== */

    // Formatear el número de tarjeta + actualizar la tarjeta visual
    inputTarjeta.addEventListener("input", function (e) {
        let n = e.target.value.replace(/\D/g, "");
        const marca = detectarMarca(n);
        const maxDigitos = marca === "amex" ? 15 : 16;
        n = n.substring(0, maxDigitos);
        e.target.value = agrupar(n, marca);

        visual.dataset.marca = marca;
        tvNumero.textContent = e.target.value || "•••• •••• •••• ••••";

        const iconos = {
            visa: "fa-brands fa-cc-visa",
            mastercard: "fa-brands fa-cc-mastercard",
            amex: "fa-brands fa-cc-amex"
        };
        tvMarca.innerHTML = '<i class="' + (iconos[marca] || "fa-regular fa-credit-card") + '"></i>';

        // El CVV de Amex tiene 4 dígitos
        inputCvv.maxLength = marca === "amex" ? 4 : 3;

        validarCampo("numero");
    });

    // Formatear la fecha de vencimiento (MM/AA)
    inputFecha.addEventListener("input", function (e) {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 2) {
            v = v.substring(0, 2) + "/" + v.substring(2, 4);
        }
        e.target.value = v;
        tvVence.textContent = v || "MM/AA";
        validarCampo("fecha");
    });

    // Nombre del titular
    inputTitular.addEventListener("input", function (e) {
        tvNombre.textContent = (e.target.value || "NOMBRE APELLIDO").toUpperCase();
        validarCampo("titular");
    });

    // CVV (solo números, se muestra enmascarado en la tarjeta)
    inputCvv.addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/\D/g, "");
        tvCvv.textContent = e.target.value.replace(/./g, "•") || "•••";
        validarCampo("cvv");
    });

    // La tarjeta gira cuando el usuario enfoca el CVV
    inputCvv.addEventListener("focus", () => visual.classList.add("girada"));
    inputCvv.addEventListener("blur",  () => visual.classList.remove("girada"));

    /* ===================== Validación con feedback visual ===================== */

    const campos = {
        titular: {
            el: inputTitular, err: document.getElementById("err-titular"),
            test: v => v.trim().length >= 3,
            msg: "Ingresá el nombre completo del titular."
        },
        numero: {
            el: inputTarjeta, err: document.getElementById("err-numero"),
            test: v => luhnValido(v.replace(/\D/g, "")),
            msg: "El número de tarjeta no es válido."
        },
        fecha: {
            el: inputFecha, err: document.getElementById("err-fecha"),
            test: v => fechaValida(v),
            msg: "Fecha inválida o vencida."
        },
        cvv: {
            el: inputCvv, err: document.getElementById("err-cvv"),
            test: v => v.length === inputCvv.maxLength,
            msg: "CVV incompleto."
        }
    };

    function validarCampo(nombre) {
        const c = campos[nombre];
        const valor = c.el.value;

        if (valor === "") {
            // Vacío: estado neutro, sin marcar en rojo todavía
            c.el.classList.remove("valido", "invalido");
            c.err.textContent = "";
        } else if (c.test(valor)) {
            c.el.classList.add("valido");
            c.el.classList.remove("invalido");
            c.el.setAttribute("aria-invalid", "false");
            c.err.textContent = "";
        } else {
            c.el.classList.add("invalido");
            c.el.classList.remove("valido");
            c.el.setAttribute("aria-invalid", "true");
            c.err.textContent = c.msg;
        }
        actualizarBoton();
    }

    function formularioValido() {
        return Object.values(campos).every(c => c.test(c.el.value));
    }

    // Habilita el botón solo cuando todos los campos son válidos
    function actualizarBoton() {
        btnPagar.disabled = !formularioValido();
    }

    /* ===================== Envío simulado ===================== */

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Evita que la página se recargue
        if (!formularioValido()) return;

        document.getElementById("avisoRechazo").classList.remove("visible");

        // Cambiamos el texto y deshabilitamos el botón
        btnPagar.innerHTML = 'Procesando... <i class="fa-solid fa-circle-notch fa-spin"></i>';
        btnPagar.style.backgroundColor = "var(--color-grisOscuro)";
        btnPagar.disabled = true;

        // Simulamos un retraso de 2.5 segundos (como si consultara al banco)
        setTimeout(() => {
            // Simula un rechazo con una tarjeta de prueba que termina en 0002
            const numero = inputTarjeta.value.replace(/\D/g, "");
            const rechazada = numero.endsWith("0002");

            if (rechazada) {
                const aviso = document.getElementById("avisoRechazo");
                const tarjeta = document.querySelector(".tarjeta-pago");
                aviso.classList.add("visible");
                tarjeta.classList.add("sacudir");
                setTimeout(() => tarjeta.classList.remove("sacudir"), 400);

                btnPagar.innerHTML = 'Procesar Pago <i class="fa-solid fa-shield-halved"></i>';
                btnPagar.style.backgroundColor = "";
                btnPagar.disabled = false;
                return;
            }

            // Éxito: ocultar formulario y mostrar el comprobante
            form.style.display = "none";
            document.getElementById("titulo-pago").style.display = "none";
            document.querySelector(".resumen-compra").style.display = "none";
            document.querySelector(".tarjeta-visual").style.display = "none";
            document.getElementById("mensaje-exito").classList.add("visible");
        }, 2500);
    });
});