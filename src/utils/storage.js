// Utilidades para localStorage - Persistencia de datos

const STORAGE_KEYS = {
    CLIENTES: 'asistente_legal_clientes',
    CASOS: 'asistente_legal_casos',
    DOCUMENTOS: 'asistente_legal_documentos',
    ALERTAS: 'asistente_legal_alertas'
};

// Helpers genéricos
const getItem = (key) => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const setItem = (key, data) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
};

// ============ CLIENTES ============

export const getClientes = () => getItem(STORAGE_KEYS.CLIENTES);

export const getClienteById = (id) => {
    const clientes = getClientes();
    return clientes.find(c => c.id === id);
};

export const createCliente = (cliente) => {
    const clientes = getClientes();
    const newCliente = {
        ...cliente,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        casosCount: 0
    };
    clientes.push(newCliente);
    setItem(STORAGE_KEYS.CLIENTES, clientes);
    return newCliente;
};

export const updateCliente = (id, updates) => {
    const clientes = getClientes();
    const index = clientes.findIndex(c => c.id === id);
    if (index !== -1) {
        clientes[index] = { ...clientes[index], ...updates };
        setItem(STORAGE_KEYS.CLIENTES, clientes);
        return clientes[index];
    }
    return null;
};

export const deleteCliente = (id) => {
    const clientes = getClientes().filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CLIENTES, clientes);
};

// ============ CASOS ============

export const getCasos = () => getItem(STORAGE_KEYS.CASOS);

export const getCasoById = (id) => {
    const casos = getCasos();
    return casos.find(c => c.id === id);
};

export const getCasosByCliente = (clienteId) => {
    return getCasos().filter(c => c.clienteId === clienteId);
};

export const createCaso = (caso) => {
    const casos = getCasos();
    const newCaso = {
        ...caso,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        estado: caso.estado || 'activo',
        documentosCount: 0,
        timeline: [{
            fecha: new Date().toISOString(),
            accion: 'Caso creado',
            descripcion: 'Se inició el registro del caso'
        }]
    };
    casos.push(newCaso);
    setItem(STORAGE_KEYS.CASOS, casos);

    // Actualizar contador del cliente
    const cliente = getClienteById(caso.clienteId);
    if (cliente) {
        updateCliente(caso.clienteId, { casosCount: (cliente.casosCount || 0) + 1 });
    }

    return newCaso;
};

export const updateCaso = (id, updates) => {
    const casos = getCasos();
    const index = casos.findIndex(c => c.id === id);
    if (index !== -1) {
        // Agregar al timeline si hay cambio de estado
        if (updates.estado && updates.estado !== casos[index].estado) {
            const timeline = casos[index].timeline || [];
            timeline.push({
                fecha: new Date().toISOString(),
                accion: 'Cambio de estado',
                descripcion: `Estado cambiado a: ${updates.estado}`
            });
            updates.timeline = timeline;
        }

        casos[index] = { ...casos[index], ...updates };
        setItem(STORAGE_KEYS.CASOS, casos);
        return casos[index];
    }
    return null;
};

export const deleteCaso = (id) => {
    const caso = getCasoById(id);
    const casos = getCasos().filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CASOS, casos);

    // Actualizar contador del cliente
    if (caso?.clienteId) {
        const cliente = getClienteById(caso.clienteId);
        if (cliente && cliente.casosCount > 0) {
            updateCliente(caso.clienteId, { casosCount: cliente.casosCount - 1 });
        }
    }
};

export const addTimelineEvent = (casoId, evento) => {
    const caso = getCasoById(casoId);
    if (caso) {
        const timeline = caso.timeline || [];
        timeline.push({
            fecha: new Date().toISOString(),
            ...evento
        });
        updateCaso(casoId, { timeline });
    }
};

// ============ DOCUMENTOS ============

export const getDocumentos = () => getItem(STORAGE_KEYS.DOCUMENTOS);

export const getDocumentosByCaso = (casoId) => {
    return getDocumentos().filter(d => d.casoId === casoId);
};

export const createDocumento = (doc) => {
    const documentos = getDocumentos();
    const newDoc = {
        ...doc,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    documentos.push(newDoc);
    setItem(STORAGE_KEYS.DOCUMENTOS, documentos);

    // Actualizar contador del caso
    const caso = getCasoById(doc.casoId);
    if (caso) {
        updateCaso(doc.casoId, { documentosCount: (caso.documentosCount || 0) + 1 });
    }

    return newDoc;
};

export const deleteDocumento = (id) => {
    const doc = getDocumentos().find(d => d.id === id);
    const documentos = getDocumentos().filter(d => d.id !== id);
    setItem(STORAGE_KEYS.DOCUMENTOS, documentos);

    if (doc?.casoId) {
        const caso = getCasoById(doc.casoId);
        if (caso && caso.documentosCount > 0) {
            updateCaso(doc.casoId, { documentosCount: caso.documentosCount - 1 });
        }
    }
};

// ============ ALERTAS ============

export const getAlertas = () => getItem(STORAGE_KEYS.ALERTAS);

export const createAlerta = (alerta) => {
    const alertas = getAlertas();
    const newAlerta = {
        ...alerta,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        leida: false
    };
    alertas.push(newAlerta);
    setItem(STORAGE_KEYS.ALERTAS, alertas);
    return newAlerta;
};

export const markAlertaAsRead = (id) => {
    const alertas = getAlertas();
    const index = alertas.findIndex(a => a.id === id);
    if (index !== -1) {
        alertas[index].leida = true;
        setItem(STORAGE_KEYS.ALERTAS, alertas);
    }
};

export const deleteAlerta = (id) => {
    const alertas = getAlertas().filter(a => a.id !== id);
    setItem(STORAGE_KEYS.ALERTAS, alertas);
};

// ============ ESTADÍSTICAS ============

export const getEstadisticas = () => {
    const casos = getCasos();
    const clientes = getClientes();
    const documentos = getDocumentos();

    // Conteos por estado
    const casosActivos = casos.filter(c => c.estado === 'activo').length;
    const casosGanados = casos.filter(c => c.estado === 'ganado').length;
    const casosPendientes = casos.filter(c => c.estado === 'pendiente').length;
    const casosCerrados = casos.filter(c => c.estado === 'cerrado').length;

    // Conteos por tipo
    const tiposCasos = {};
    casos.forEach(c => {
        tiposCasos[c.tipo] = (tiposCasos[c.tipo] || 0) + 1;
    });

    // Casos por mes (últimos 6 meses)
    const casosPorMes = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleDateString('es', { month: 'short' });
        casosPorMes[key] = { nuevos: 0, cerrados: 0 };
    }

    casos.forEach(c => {
        const date = new Date(c.createdAt);
        const key = date.toLocaleDateString('es', { month: 'short' });
        if (casosPorMes[key]) {
            casosPorMes[key].nuevos++;
            if (c.estado === 'cerrado' || c.estado === 'ganado') {
                casosPorMes[key].cerrados++;
            }
        }
    });

    return {
        totalClientes: clientes.length,
        totalCasos: casos.length,
        totalDocumentos: documentos.length,
        casosActivos,
        casosGanados,
        casosPendientes,
        casosCerrados,
        tiposCasos: Object.entries(tiposCasos).map(([label, value]) => ({ label, value })),
        casosPorMes: {
            labels: Object.keys(casosPorMes),
            nuevos: Object.values(casosPorMes).map(v => v.nuevos),
            cerrados: Object.values(casosPorMes).map(v => v.cerrados)
        },
        tasaExito: casos.length > 0
            ? Math.round((casosGanados / casos.length) * 100)
            : 0
    };
};

// ============ INICIALIZACIÓN CON DATOS DE EJEMPLO ============

export const initializeDemoData = () => {
    // Solo inicializar si no hay datos
    if (getClientes().length > 0) return;

    // Clientes de ejemplo
    const clientes = [
        { nombre: 'María García López', telefono: '555-1234', email: 'maria@email.com', direccion: 'Calle Principal 123' },
        { nombre: 'Juan Pérez Rodríguez', telefono: '555-5678', email: 'juan@email.com', direccion: 'Av. Central 456' },
        { nombre: 'Ana Martínez Sánchez', telefono: '555-9012', email: 'ana@email.com', direccion: 'Boulevard Sur 789' },
        { nombre: 'Carlos Hernández', telefono: '555-3456', email: 'carlos@email.com', direccion: 'Calle Norte 321' },
        { nombre: 'Laura Jiménez', telefono: '555-7890', email: 'laura@email.com', direccion: 'Av. Poniente 654' },
    ];

    clientes.forEach(c => createCliente(c));

    // Casos de ejemplo
    const tiposCasos = ['Penal', 'Civil', 'Familiar', 'Laboral', 'Mercantil'];
    const estados = ['activo', 'activo', 'activo', 'pendiente', 'ganado', 'cerrado'];
    const clientesCreados = getClientes();

    clientesCreados.forEach((cliente, i) => {
        const numCasos = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numCasos; j++) {
            createCaso({
                clienteId: cliente.id,
                titulo: `Caso ${tiposCasos[Math.floor(Math.random() * tiposCasos.length)]} #${i + 1}-${j + 1}`,
                tipo: tiposCasos[Math.floor(Math.random() * tiposCasos.length)],
                descripcion: 'Descripción del caso legal en proceso.',
                estado: estados[Math.floor(Math.random() * estados.length)],
                fechaAudiencia: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                prioridad: ['alta', 'media', 'baja'][Math.floor(Math.random() * 3)]
            });
        }
    });

    // Alertas de ejemplo
    const alertasEjemplo = [
        { type: 'urgent', title: 'Audiencia mañana', description: 'Caso García vs Estado - 10:00 AM', casoId: getCasos()[0]?.id },
        { type: 'upcoming', title: 'Entrega de documentos', date: 'Lun 23', description: 'Expediente completo requerido' },
        { type: 'upcoming', title: 'Reunión con cliente', date: 'Mié 25', description: 'Revisión de estrategia' },
        { type: 'upcoming', title: 'Vencimiento de plazo', date: 'Vie 27', description: 'Presentar apelación' },
    ];

    alertasEjemplo.forEach(a => createAlerta(a));
};
