// Utilidades para manejo de fechas y alertas

export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short'
    });
};

export const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return `${formatDate(dateString)} a las ${formatTime(dateString)}`;
};

export const getRelativeTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        if (absDays === 1) return 'Ayer';
        if (absDays < 7) return `Hace ${absDays} días`;
        if (absDays < 30) return `Hace ${Math.floor(absDays / 7)} semanas`;
        return `Hace ${Math.floor(absDays / 30)} meses`;
    }

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 7) return `En ${diffDays} días`;
    if (diffDays < 30) return `En ${Math.floor(diffDays / 7)} semanas`;
    return `En ${Math.floor(diffDays / 30)} meses`;
};

export const isUrgent = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
};

export const isUpcoming = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays > 3 && diffDays <= 7;
};

export const isPast = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
};

export const getDaysUntil = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const getWeekDates = () => {
    const dates = [];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push({
            date: date.toISOString(),
            dayName: date.toLocaleDateString('es', { weekday: 'short' }),
            dayNumber: date.getDate(),
            isToday: date.toDateString() === now.toDateString()
        });
    }

    return dates;
};

export const getMonthName = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es', { month: 'long', year: 'numeric' });
};

// Generar fechas para calendario
export const getCalendarDays = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    // Días del mes anterior (padding)
    const prevMonth = new Date(year, month, 0);
    for (let i = startPadding - 1; i >= 0; i--) {
        days.push({
            date: new Date(year, month - 1, prevMonth.getDate() - i),
            isCurrentMonth: false
        });
    }

    // Días del mes actual
    for (let i = 1; i <= totalDays; i++) {
        days.push({
            date: new Date(year, month, i),
            isCurrentMonth: true
        });
    }

    // Días del mes siguiente (padding para completar 6 semanas)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({
            date: new Date(year, month + 1, i),
            isCurrentMonth: false
        });
    }

    return days;
};
