// =============================================
// CONFIGURACIÓN - DATOS DE LA EMPRESA
// =============================================

const CONFIG = {
    // Número de WhatsApp de la empresa (solo 9 dígitos, sin código de país)
    whatsapp: "907008110", // <-- AHORA SON 9 DÍGITOS
    
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
    e.preventDefault();

    // 1. Obtener valores
    const nombre = nombreInput.value.trim();
    const dni = dniInput.value.trim();
    const celular = celularInput.value.trim();
    const agencia = agenciaInput.value.trim();
    const observaciones = observacionesInput.value.trim();

    // 2. Validar
    if (!nombre) {
        alert('⚠️ Ingrese su Nombre Completo');
        nombreInput.focus();
        return;
    }
    if (!dni) {
        alert('⚠️ Ingrese su DNI / CE');
        dniInput.focus();
        return;
    }
    if (!celular) {
        alert('⚠️ Ingrese su número de Celular');
        celularInput.focus();
        return;
    }
    if (!agencia) {
        alert('⚠️ Ingrese la Dirección de la Agencia');
        agenciaInput.focus();
        return;
    }
    if (celular.length < 9) {
        alert('⚠️ El celular debe tener 9 dígitos');
        celularInput.focus();
        return;
    }

    // 3. Construir mensaje WhatsApp
    const mensajeWhatsApp = construirMensajeWhatsApp({
        nombre,
        dni,
        celular,
        agencia,
        observaciones
    });

    // 4. Abrir WhatsApp CON EL NÚMERO CORRECTO
    abrirWhatsApp(mensajeWhatsApp);

    // 5. Mostrar ticket
    mostrarTicket({
        nombre,
        dni,
        celular,
        agencia,
        observaciones
    });

    // 6. Ocultar formulario
    document.querySelector('.contenedor').style.display = 'none';
});

// =============================================
// FUNCIÓN: CONSTRUIR MENSAJE WHATSAPP
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
// FUNCIÓN: ABRIR WHATSAPP - CORREGIDA
// =============================================

function abrirWhatsApp(mensaje) {
    // 🔥 NÚMERO CORRECTO: 51 (código Perú) + 907008110 (9 dígitos)
    const numeroCompleto = `51${CONFIG.whatsapp}`; // 51907008110
    const url = `https://wa.me/${numeroCompleto}?text=${mensaje}`;
    
    console.log('📱 Abriendo WhatsApp al número:', numeroCompleto);
    console.log('🔗 URL:', url);
    
    window.open(url, '_blank');
}

// =============================================
// FUNCIÓN: MOSTRAR TICKET
// =============================================

function mostrarTicket(datos) {
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
    
    ticket.classList.add('visible');
    
    setTimeout(() => {
        ticket.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// =============================================
// FUNCIÓN: IMPRIMIR
// =============================================

btnImprimir.addEventListener('click', function() {
    window.print();
});

// =============================================
// FUNCIÓN: FORMATEAR CELULAR
// =============================================

celularInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 9) {
        this.value = this.value.slice(0, 9);
    }
});

dniInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    if (this.value.length > 15) {
        this.value = this.value.slice(0, 15);
    }
});

nombreInput.addEventListener('blur', function() {
    this.value = this.value
        .toLowerCase()
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
});

// =============================================
// FUNCIÓN: AGREGAR FECHA AL TICKET
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    const fechaHora = document.createElement('p');
    fechaHora.style.textAlign = 'center';
    fechaHora.style.marginTop = '10px';
    fechaHora.style.fontSize = '14px';
    fechaHora.style.color = '#555';
    fechaHora.innerHTML = `📅 ${new Date().toLocaleDateString('es-PE')} - ⏰ ${new Date().toLocaleTimeString('es-PE')}`;
    
    const btnImprimir = document.getElementById('btnImprimir');
    const ticket = document.getElementById('ticket');
    ticket.insertBefore(fechaHora, btnImprimir);
    
    console.log('✅ Sistema listo');
    console.log('📱 Número WhatsApp configurado:', CONFIG.whatsapp);
});

// Manejador de error de logo
document.addEventListener('DOMContentLoaded', function() {
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
        logoImg.onerror = function() {
            this.style.display = 'none';
            const fallback = document.createElement('h2');
            fallback.textContent = 'MULTITOOLS';
            fallback.style.color = '#f9c80e';
            fallback.style.fontSize = '32px';
            fallback.style.fontWeight = '900';
            fallback.style.textAlign = 'center';
            this.parentNode.appendChild(fallback);
        };
    }
});
