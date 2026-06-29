// =============================================
// CONFIGURACIÓN
// =============================================

const CONFIG = {
    whatsapp: "907008110",
    remitente: {
        nombre: "Alexander Vásquez",
        empresa: "MULTITOOLS",
        ruc: "2060XXXXXXXX",
        celular: "907008110"
    },
    // URL base para los links (cambia por tu dominio)
    baseUrl: window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/')
};

// =============================================
// GENERAR ID ÚNICO
// =============================================

function generarId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return timestamp + random;
}

// =============================================
// GUARDAR/OBTENER DATOS EN localStorage
// =============================================

function guardarDatos(id, datos) {
    const registros = JSON.parse(localStorage.getItem('multitools_registros') || '{}');
    registros[id] = {
        ...datos,
        fecha: new Date().toISOString(),
        pedido: datos.pedido || ''
    };
    localStorage.setItem('multitools_registros', JSON.stringify(registros));
    return registros[id];
}

function obtenerDatos(id) {
    const registros = JSON.parse(localStorage.getItem('multitools_registros') || '{}');
    return registros[id] || null;
}

function actualizarPedido(id, nuevoPedido) {
    const registros = JSON.parse(localStorage.getItem('multitools_registros') || '{}');
    if (registros[id]) {
        registros[id].pedido = nuevoPedido;
        localStorage.setItem('multitools_registros', JSON.stringify(registros));
        return true;
    }
    return false;
}

// =============================================
// REFERENCIAS DOM
// =============================================

const formulario = document.getElementById('formulario');
const ticket = document.getElementById('ticket');
const btnImprimirTicket = document.getElementById('btnImprimirTicket');
const btnGuardarPedido = document.getElementById('btnGuardarPedido');

const tNombre = document.getElementById('tNombre');
const tDni = document.getElementById('tDni');
const tCelular = document.getElementById('tCelular');
const tAgencia = document.getElementById('tAgencia');
const tPedido = document.getElementById('tPedido');
const tFechaHora = document.getElementById('tFechaHora');
const ticketId = document.getElementById('ticketId');
const ticketLink = document.getElementById('ticketLink');

const nombreInput = document.getElementById('nombre');
const dniInput = document.getElementById('dni');
const celularInput = document.getElementById('celular');
const agenciaInput = document.getElementById('agencia');
const pedidoInput = document.getElementById('pedido');

// =============================================
// FUNCIÓN: ENVIAR FORMULARIO
// =============================================

formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores
    const nombre = nombreInput.value.trim();
    const dni = dniInput.value.trim();
    const celular = celularInput.value.trim();
    const agencia = agenciaInput.value.trim();
    const pedido = pedidoInput.value.trim();

    // Validar
    if (!nombre) { alert('⚠️ Ingrese su Nombre Completo'); nombreInput.focus(); return; }
    if (!dni) { alert('⚠️ Ingrese su DNI / CE'); dniInput.focus(); return; }
    if (!celular) { alert('⚠️ Ingrese su número de Celular'); celularInput.focus(); return; }
    if (!agencia) { alert('⚠️ Ingrese la Dirección de la Agencia'); agenciaInput.focus(); return; }
    if (!pedido) { alert('⚠️ Ingrese el detalle del PEDIDO'); pedidoInput.focus(); return; }
    if (celular.length < 9) { alert('⚠️ El celular debe tener 9 dígitos'); celularInput.focus(); return; }

    // Generar ID único
    const id = generarId();

    // Guardar datos
    const datos = {
        nombre,
        dni,
        celular,
        agencia,
        pedido
    };
    guardarDatos(id, datos);

    // Construir URL del ticket
    const urlTicket = `${window.location.origin}${window.location.pathname}?id=${id}`;

    // Construir mensaje WhatsApp con link
    const mensajeWhatsApp = construirMensajeWhatsApp(datos, urlTicket, id);

    // Abrir WhatsApp
    abrirWhatsApp(mensajeWhatsApp);

    // Mostrar ticket
    mostrarTicket(datos, id, urlTicket);

    // Ocultar formulario
    document.getElementById('formularioContainer').style.display = 'none';
    btnImprimirTicket.style.display = 'block';
});

// =============================================
// CONSTRUIR MENSAJE WHATSAPP CON LINK
// =============================================

function construirMensajeWhatsApp(datos, urlTicket, id) {
    let mensaje = '📦 *NUEVO REGISTRO DE ENVÍO*%0A%0A';
    mensaje += `🆔 *ID:* ${id}%0A%0A`;
    mensaje += '👤 *Nombre:*%0A';
    mensaje += `${datos.nombre}%0A%0A`;
    mensaje += '🆔 *DNI / CE:*%0A';
    mensaje += `${datos.dni}%0A%0A`;
    mensaje += '📱 *Celular:*%0A';
    mensaje += `${datos.celular}%0A%0A`;
    mensaje += '🚚 *Dirección Agencia:*%0A';
    mensaje += `${datos.agencia}%0A%0A`;
    mensaje += '📝 *PEDIDO:*%0A';
    mensaje += `${datos.pedido}%0A%0A`;
    mensaje += '─────────────────────%0A';
    mensaje += '🔗 *Link para editar/ver:*%0A';
    mensaje += `${urlTicket}%0A%0A`;
    mensaje += '📌 *Registro generado desde la web*';
    return mensaje;
}

// =============================================
// ABRIR WHATSAPP
// =============================================

function abrirWhatsApp(mensaje) {
    const numeroCompleto = `51${CONFIG.whatsapp}`;
    const url = `https://wa.me/${numeroCompleto}?text=${mensaje}`;
    window.open(url, '_blank');
}

// =============================================
// MOSTRAR TICKET
// =============================================

function mostrarTicket(datos, id, urlTicket) {
    // Llenar datos
    ticketId.textContent = id;
    tNombre.textContent = `👤 ${datos.nombre}`;
    tDni.textContent = `🆔 ${datos.dni}`;
    tCelular.textContent = `📱 ${datos.celular}`;
    tAgencia.textContent = `🚚 ${datos.agencia}`;
    tPedido.textContent = datos.pedido || 'Sin pedido';
    
    // Fecha y hora
    const ahora = new Date();
    tFechaHora.textContent = `📅 ${ahora.toLocaleDateString('es-PE')} - ⏰ ${ahora.toLocaleTimeString('es-PE')}`;
    
    // Link del ticket (para copiar)
    ticketLink.textContent = `🔗 ${urlTicket}`;
    ticketLink.style.fontSize = '11px';
    ticketLink.style.wordBreak = 'break-all';
    ticketLink.style.color = '#0066cc';
    ticketLink.style.cursor = 'pointer';
    ticketLink.onclick = function() {
        navigator.clipboard.writeText(urlTicket).then(() => {
            alert('✅ Link copiado al portapapeles');
        });
    };

    // Mostrar ticket
    ticket.classList.remove('oculto');
    ticket.classList.add('visible');
    
    // Mostrar botón guardar
    btnGuardarPedido.style.display = 'block';
    
    // Scroll al ticket
    setTimeout(() => {
        ticket.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// =============================================
// GUARDAR CAMBIOS DEL PEDIDO
// =============================================

btnGuardarPedido.addEventListener('click', function() {
    const id = ticketId.textContent;
    const nuevoPedido = tPedido.textContent.trim();
    
    if (!nuevoPedido) {
        alert('⚠️ El pedido no puede estar vacío');
        return;
    }
    
    if (actualizarPedido(id, nuevoPedido)) {
        alert('✅ Pedido actualizado correctamente');
        // Actualizar el contenido del ticket
        tPedido.textContent = nuevoPedido;
    } else {
        alert('❌ Error al guardar el pedido');
    }
});

// =============================================
// IMPRIMIR TICKET (tamaño ticket)
// =============================================

btnImprimirTicket.addEventListener('click', function() {
    window.print();
});

// También imprimir con el botón viejo (por compatibilidad)
document.getElementById('btnImprimir')?.addEventListener('click', function() {
    window.print();
});

// =============================================
// FORMATOS DE CAMPOS
// =============================================

celularInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 9) this.value = this.value.slice(0, 9);
});

dniInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
    if (this.value.length > 15) this.value = this.value.slice(0, 15);
});

nombreInput.addEventListener('blur', function() {
    this.value = this.value.toLowerCase().split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
});

// =============================================
// CARGAR DATOS POR ID (si existe en URL)
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Obtener ID de la URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (id) {
        const datos = obtenerDatos(id);
        if (datos) {
            console.log('📋 Cargando registro:', id);
            // Ocultar formulario
            document.getElementById('formularioContainer').style.display = 'none';
            btnImprimirTicket.style.display = 'block';
            
            // Mostrar ticket con datos guardados
            mostrarTicket(datos, id, window.location.href);
            
            // Poner el pedido en editable
            tPedido.textContent = datos.pedido || 'Sin pedido';
        } else {
            console.warn('⚠️ Registro no encontrado:', id);
            alert('❌ Registro no encontrado');
        }
    }
    
    // Logo fallback
    const logoImg = document.getElementById('logoImg');
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
    
    console.log('✅ Sistema listo');
    console.log('📱 Número WhatsApp:', CONFIG.whatsapp);
});
