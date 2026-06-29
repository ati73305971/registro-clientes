// =============================================
// CONTROL DE VERSIÓN - EVITA CACHÉ
// =============================================

const VERSION = '3.0';
const versionGuardada = localStorage.getItem('multitools_version');

if (versionGuardada !== VERSION) {
    console.log('🔄 Nueva versión detectada (v' + VERSION + ') - Limpiando caché...');
    localStorage.setItem('multitools_version', VERSION);
    
    // Si la URL no tiene un parámetro de versión, forzar recarga
    if (!window.location.search.includes('v=')) {
        const separator = window.location.search ? '&' : '?';
        window.location.href = window.location.href + separator + 'v=' + VERSION;
        // Nota: el código se detiene aquí y recarga la página
    }
}

// =============================================
// CONFIGURACIÓN
// =============================================

const CONFIG = {
    whatsapp: "907008110",
    remitente: {
        nombre: "Alexander Vásquez",
        empresa: "MULTITOOLS",
        ruc: "20611590696",
        celular: "907008110"
    }
};

console.log('✅ Sistema v' + VERSION + ' cargado correctamente');

// =============================================
// FUNCIONES DE CODIFICACIÓN/DECODIFICACIÓN
// =============================================

function codificarDatos(datos) {
    try {
        const json = JSON.stringify(datos);
        return btoa(encodeURIComponent(json));
    } catch (e) {
        console.error('Error al codificar:', e);
        return null;
    }
}

function decodificarDatos(dataEncoded) {
    try {
        const json = decodeURIComponent(atob(dataEncoded));
        return JSON.parse(json);
    } catch (e) {
        console.error('Error al decodificar:', e);
        return null;
    }
}

// =============================================
// GUARDAR EN LOCALSTORAGE
// =============================================

function guardarLocal(datos) {
    const registros = JSON.parse(localStorage.getItem('multitools_registros') || '{}');
    registros[datos.id] = datos;
    localStorage.setItem('multitools_registros', JSON.stringify(registros));
}

function actualizarLocal(id, nuevoPedido) {
    const registros = JSON.parse(localStorage.getItem('multitools_registros') || '{}');
    if (registros[id]) {
        registros[id].pedido = nuevoPedido;
        registros[id].fecha_edicion = new Date().toISOString();
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

const nombreInput = document.getElementById('nombre');
const dniInput = document.getElementById('dni');
const celularInput = document.getElementById('celular');
const agenciaInput = document.getElementById('agencia');
const pedidoInput = document.getElementById('pedido');

// =============================================
// MOSTRAR TICKET
// =============================================

function mostrarTicket(datos) {
    console.log('📋 Mostrando ticket con datos:', datos);
    
    tNombre.textContent = datos.nombre || 'No especificado';
    tDni.textContent = datos.dni || 'No especificado';
    tCelular.textContent = datos.celular || 'No especificado';
    tAgencia.textContent = datos.agencia || 'No especificado';
    tPedido.textContent = datos.pedido || 'Sin pedido';
    
    const fecha = datos.fecha ? new Date(datos.fecha) : new Date();
    tFechaHora.textContent = `${fecha.toLocaleDateString('es-PE')} ${fecha.toLocaleTimeString('es-PE')}`;

    document.getElementById('formularioContainer').style.display = 'none';
    ticket.classList.remove('oculto');
    ticket.classList.add('visible');
    btnImprimirTicket.style.display = 'block';
    btnGuardarPedido.style.display = 'block';
    
    setTimeout(() => {
        ticket.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// =============================================
// ENVIAR FORMULARIO
// =============================================

formulario.addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const dni = dniInput.value.trim();
    const celular = celularInput.value.trim();
    const agencia = agenciaInput.value.trim();
    const pedido = pedidoInput.value.trim();

    if (!nombre) { alert('⚠️ Ingrese su Nombre Completo'); nombreInput.focus(); return; }
    if (!dni) { alert('⚠️ Ingrese su DNI / CE'); dniInput.focus(); return; }
    if (!celular) { alert('⚠️ Ingrese su número de Celular'); celularInput.focus(); return; }
    if (!agencia) { alert('⚠️ Ingrese la Dirección de la Agencia'); agenciaInput.focus(); return; }
    if (!pedido) { alert('⚠️ Ingrese el detalle del PEDIDO'); pedidoInput.focus(); return; }
    if (celular.length < 9) { alert('⚠️ El celular debe tener 9 dígitos'); celularInput.focus(); return; }

    const id = Math.random().toString(36).substring(2, 8).toUpperCase();

    const datos = {
        id: id,
        nombre: nombre,
        dni: dni,
        celular: celular,
        agencia: agencia,
        pedido: pedido,
        fecha: new Date().toISOString()
    };

    guardarLocal(datos);

    const datosEncoded = codificarDatos(datos);
    const urlTicket = `${window.location.origin}${window.location.pathname}?data=${datosEncoded}`;

    const mensajeWhatsApp = construirMensajeWhatsApp(datos, urlTicket, id);
    abrirWhatsApp(mensajeWhatsApp);

    mostrarTicket(datos);
});

// =============================================
// CONSTRUIR MENSAJE WHATSAPP
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
    mensaje += '🔗 *Link para editar:*%0A';
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
// GUARDAR CAMBIOS DEL PEDIDO
// =============================================

btnGuardarPedido.addEventListener('click', function() {
    const params = new URLSearchParams(window.location.search);
    const dataEncoded = params.get('data');
    
    if (!dataEncoded) {
        alert('❌ No se encontraron datos para actualizar');
        return;
    }
    
    const datos = decodificarDatos(dataEncoded);
    if (!datos) {
        alert('❌ Error al decodificar los datos');
        return;
    }
    
    const nuevoPedido = tPedido.textContent.trim();
    if (!nuevoPedido) {
        alert('⚠️ El pedido no puede estar vacío');
        return;
    }
    
    datos.pedido = nuevoPedido;
    datos.fecha_edicion = new Date().toISOString();
    
    guardarLocal(datos);
    
    const nuevosDatosEncoded = codificarDatos(datos);
    const nuevaUrl = `${window.location.origin}${window.location.pathname}?data=${nuevosDatosEncoded}`;
    
    window.history.replaceState({}, '', nuevaUrl);
    
    alert('✅ Pedido actualizado correctamente');
});

// =============================================
// IMPRIMIR TICKET
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
// CARGAR DATOS DESDE LA URL
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página cargada - Verificando URL...');
    
    const params = new URLSearchParams(window.location.search);
    const dataEncoded = params.get('data');
    
    console.log('📦 Data encoded encontrado:', dataEncoded ? 'SÍ' : 'NO');
    
    if (dataEncoded) {
        console.log('🔓 Decodificando datos...');
        const datos = decodificarDatos(dataEncoded);
        
        if (datos) {
            console.log('✅ Datos decodificados correctamente:', datos);
            mostrarTicket(datos);
        } else {
            console.error('❌ Error al decodificar los datos');
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
    
    console.log('✅ Sistema listo');
});
