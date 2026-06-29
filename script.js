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
    }
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
// CODIFICAR/DECODIFICAR DATOS EN URL
// =============================================

function codificarDatos(datos) {
    // Convertir a JSON y luego a Base64
    const json = JSON.stringify(datos);
    return btoa(encodeURIComponent(json));
}

function decodificarDatos(dataEncoded) {
    try {
        const json = decodeURIComponent(atob(dataEncoded));
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
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

    // Datos a guardar
    const datos = {
        id: id,
        nombre: nombre,
        dni: dni,
        celular: celular,
        agencia: agencia,
        pedido: pedido,
        fecha: new Date().toISOString()
    };

    // Codificar datos en el link
    const datosEncoded = codificarDatos(datos);
    const urlTicket = `${window.location.origin}${window.location.pathname}?data=${datosEncoded}`;

    // Construir mensaje WhatsApp
    const mensajeWhatsApp = construirMensajeWhatsApp(datos, urlTicket);

    // Abrir WhatsApp
    abrirWhatsApp(mensajeWhatsApp);

    // Mostrar ticket
    mostrarTicket(datos, urlTicket);

    // Ocultar formulario
    document.getElementById('formularioContainer').style.display = 'none';
    btnImprimirTicket.style.display = 'block';
});

// =============================================
// CONSTRUIR MENSAJE WHATSAPP CON LINK
// =============================================

function construirMensajeWhatsApp(datos, urlTicket) {
    let mensaje = '📦 *NUEVO REGISTRO DE ENVÍO*%0A%0A';
    mensaje += `🆔 *ID:* ${datos.id}%0A%0A`;
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

function mostrarTicket(datos, urlTicket) {
    // Llenar datos
    ticketId.textContent = datos.id || '000000';
    tNombre.textContent = `👤 ${datos.nombre}`;
    tDni.textContent = `🆔 ${datos.dni}`;
    tCelular.textContent = `📱 ${datos.celular}`;
    tAgencia.textContent = `🚚 ${datos.agencia}`;
    tPedido.textContent = datos.pedido || 'Sin pedido';
    
    // Fecha y hora
    const fecha = datos.fecha ? new Date(datos.fecha) : new Date();
    tFechaHora.textContent = `📅 ${fecha.toLocaleDateString('es-PE')} - ⏰ ${fecha.toLocaleTimeString('es-PE')}`;
    
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
    const pedidoActual = tPedido.textContent.trim();
    
    if (!pedidoActual) {
        alert('⚠️ El pedido no puede estar vacío');
        return;
    }
    
    // Obtener datos actuales del link
    const params = new URLSearchParams(window.location.search);
    const dataEncoded = params.get('data');
    
    if (dataEncoded) {
        const datos = decodificarDatos(dataEncoded);
        if (datos) {
            // Actualizar el pedido
            datos.pedido = pedidoActual;
            datos.fecha = new Date().toISOString();
            
            // Crear nuevo link con datos actualizados
            const nuevosDatosEncoded = codificarDatos(datos);
            const nuevaUrl = `${window.location.origin}${window.location.pathname}?data=${nuevosDatosEncoded}`;
            
            // Actualizar el link en la URL (sin recargar)
            window.history.replaceState({}, '', nuevaUrl);
            
            // Actualizar el link mostrado en el ticket
            ticketLink.textContent = `🔗 ${nuevaUrl}`;
            ticketLink.onclick = function() {
                navigator.clipboard.writeText(nuevaUrl).then(() => {
                    alert('✅ Link copiado al portapapeles');
                });
            };
            
            alert('✅ Pedido actualizado correctamente');
        }
    }
});

// =============================================
// IMPRIMIR TICKET (tamaño ticket)
// =============================================

btnImprimirTicket.addEventListener('click', function() {
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
// CARGAR DATOS POR URL (si existe data en la URL)
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos de la URL
    const params = new URLSearchParams(window.location.search);
    const dataEncoded = params.get('data');
    
    if (dataEncoded) {
        const datos = decodificarDatos(dataEncoded);
        if (datos) {
            console.log('📋 Cargando registro desde link:', datos.id);
            // Ocultar formulario
            document.getElementById('formularioContainer').style.display = 'none';
            btnImprimirTicket.style.display = 'block';
            
            // Mostrar ticket con datos
            mostrarTicket(datos, window.location.href);
            
            // Poner el pedido en editable
            tPedido.textContent = datos.pedido || 'Sin pedido';
        } else {
            console.warn('⚠️ Error al decodificar datos');
            alert('❌ Error al cargar los datos del link');
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
    
    console.log('✅ Sistema listo - Versión con datos en URL');
    console.log('📱 Número WhatsApp:', CONFIG.whatsapp);
});
