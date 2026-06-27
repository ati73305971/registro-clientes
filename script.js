// =============================================
// CONFIGURACIÓN - DATOS DE LA EMPRESA
// =============================================

const CONFIG = {
    // Número de WhatsApp de la empresa (sin + ni espacios)
    whatsapp: "51907008110",
    
    // Datos del remitente (aparecen en el ticket)
    remitente: {
        nombre: "Alexander Vásquez",
        empresa: "MULTITOOLS",
        ruc: "2060XXXXXXXX",
        celular: "907008110"
    }
};

// =============================================
// REFERENCIAS DEL DOM
// =============================================

const formulario = document.getElementById('formulario');
const ticket = document.getElementById('ticket');
const btnImprimir = document.getElementById('btnImprimir');

// Elementos del ticket
const tNombre = document.getElementById('tNombre');
const tDni = document.getElementById('tDni');
const tCelular = document.getElementById('tCelular');
const tAgencia = document.getElementById('tAgencia');
const tObservaciones = document.getElementById('tObservaciones');

// Campos del formulario
const nombreInput = document.getElementById('nombre');
const dniInput = document.getElementById('dni');
const celularInput = document.getElementById('celular');
const agenciaInput = document.getElementById('agencia');
const observacionesInput = document.getElementById('observaciones');

// =============================================
// FUNCIÓN: ENVIAR FORMULARIO
// =============================================

formulario.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Obtener valores de los campos
    const nombre = nombreInput.value.trim();
    const dni = dniInput.value.trim();
    const celular = celularInput.value.trim();
    const agencia = agenciaInput.value.trim();
    const observaciones = observacionesInput.value.trim();

    // 2. Validar campos obligatorios
    if (!nombre) {
        alert('⚠️ Por favor, ingrese su Nombre Completo');
        nombreInput.focus();
        return;
    }

    if (!dni) {
        alert('⚠️ Por favor, ingrese su DNI / CE');
        dniInput.focus();
        return;
    }

    if (!celular) {
        alert('⚠️ Por favor, ingrese su número de Celular');
        celularInput.focus();
        return;
    }

    if (!agencia) {
        alert('⚠️ Por favor, ingrese la Dirección de la Agencia');
        agenciaInput.focus();
        return;
    }

    // Validar que el celular tenga al menos 9 dígitos
    if (celular.length < 9) {
        alert('⚠️ El número de celular debe tener al menos 9 dígitos');
        celularInput.focus();
        return;
    }

    // 3. Construir mensaje para WhatsApp
    const mensajeWhatsApp = construirMensajeWhatsApp({
        nombre,
        dni,
        celular,
        agencia,
        observaciones
    });

    // 4. Abrir WhatsApp
    abrirWhatsApp(mensajeWhatsApp);

    // 5. Mostrar ticket con los datos
    mostrarTicket({
        nombre,
        dni,
        celular,
        agencia,
        observaciones
    });

    // 6. Ocultar el formulario
    document.querySelector('.contenedor').style.display = 'none';
});

// =============================================
// FUNCIÓN: CONSTRUIR MENSAJE PARA WHATSAPP
// =============================================

function construirMensajeWhatsApp(datos) {
    let mensaje = '📦 *NUEVO REGISTRO DE ENVÍO*%0A%0A';
    
    mensaje += '👤 *Nombre Completo:*%0A';
    mensaje += `${datos.nombre}%0A%0A`;
    
    mensaje += '🆔 *DNI / CE:*%0A';
    mensaje += `${datos.dni}%0A%0A`;
    
    mensaje += '📱 *Celular:*%0A';
    mensaje += `${datos.celular}%0A%0A`;
    
    mensaje += '🚚 *Dirección Agencia Shalom:*%0A';
    mensaje += `${datos.agencia}%0A%0A`;
    
    if (datos.observaciones) {
        mensaje += '📝 *Observaciones:*%0A';
        mensaje += `${datos.observaciones}%0A%0A`;
    }
    
    mensaje += '─────────────────────%0A';
    mensaje += '📌 *Registro generado desde la web*%0A';
    mensaje += `🕐 *Fecha:* ${new Date().toLocaleDateString('es-PE')}%0A`;
    mensaje += `⏰ *Hora:* ${new Date().toLocaleTimeString('es-PE')}`;
    
    return mensaje;
}

// =============================================
// FUNCIÓN: ABRIR WHATSAPP
// =============================================

function abrirWhatsApp(mensaje) {
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${mensaje}`;
    window.open(url, '_blank');
}

// =============================================
// FUNCIÓN: MOSTRAR TICKET
// =============================================

function mostrarTicket(datos) {
    // Llenar los datos del ticket
    tNombre.textContent = `👤 ${datos.nombre}`;
    tDni.textContent = `🆔 ${datos.dni}`;
    tCelular.textContent = `📱 ${datos.celular}`;
    tAgencia.textContent = `🚚 ${datos.agencia}`;
    
    if (datos.observaciones) {
        tObservaciones.textContent = `📝 ${datos.observaciones}`;
        tObservaciones.style.display = 'block';
    } else {
        tObservaciones.style.display = 'none';
    }
    
    // Mostrar el ticket con animación
    ticket.classList.add('visible');
    
    // Scroll suave hacia el ticket
    setTimeout(() => {
        ticket.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// =============================================
// FUNCIÓN: IMPRIMIR TICKET
// =============================================

btnImprimir.addEventListener('click', function() {
    window.print();
});

// =============================================
// FUNCIÓN: FORMATEAR CELULAR MIENTRAS ESCRIBE
// =============================================

celularInput.addEventListener('input', function(e) {
    // Solo permitir números
    this.value = this.value.replace(/\D/g, '');
    
    // Limitar a 15 dígitos (código país + número)
    if (this.value.length > 15) {
        this.value = this.value.slice(0, 15);
    }
});

// =============================================
// FUNCIÓN: FORMATEAR DNI MIENTRAS ESCRIBE
// =============================================

dniInput.addEventListener('input', function(e) {
    // Solo permitir números y letras (para CE)
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    
    // Limitar a 15 caracteres
    if (this.value.length > 15) {
        this.value = this.value.slice(0, 15);
    }
});

// =============================================
// FUNCIÓN: NORMALIZAR MAYÚSCULAS/MINÚSCULAS
// =============================================

nombreInput.addEventListener('blur', function(e) {
    // Capitalizar primera letra de cada palabra
    this.value = this.value
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
});

// =============================================
// FUNCIÓN: MOSTRAR FECHA Y HORA EN EL TICKET
// =============================================

// Agregar fecha y hora al ticket automáticamente
document.addEventListener('DOMContentLoaded', function() {
    const fechaHora = document.createElement('p');
    fechaHora.style.textAlign = 'center';
    fechaHora.style.marginTop = '10px';
    fechaHora.style.fontSize = '14px';
    fechaHora.style.color = '#555';
    fechaHora.innerHTML = `📅 ${new Date().toLocaleDateString('es-PE')} - ⏰ ${new Date().toLocaleTimeString('es-PE')}`;
    
    // Insertar antes del botón de imprimir
    const btnImprimir = document.getElementById('btnImprimir');
    const ticket = document.getElementById('ticket');
    ticket.insertBefore(fechaHora, btnImprimir);
});

// =============================================
// FUNCIÓN: EFECTO DE CONFIRMACIÓN
// =============================================

// Mostrar alerta de confirmación después de enviar
formulario.addEventListener('submit', function(e) {
    // Este código ya se ejecuta arriba, pero añadimos un pequeño delay
    // para que el usuario vea que se envió correctamente
    setTimeout(() => {
        console.log('✅ Registro enviado correctamente');
    }, 100);
});
