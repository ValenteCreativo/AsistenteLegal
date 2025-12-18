import './globals.css';

export const metadata = {
    title: 'Asistente Legal | Tu ayuda legal inteligente',
    description: 'Sistema de gestión legal intuitivo para abogados. Maneja clientes, casos, documentos y obtén estadísticas claras de tu desempeño.',
    keywords: 'asistente legal, gestión de casos, abogados, documentos legales, estadísticas',
    authors: [{ name: 'Asistente Legal' }],
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta name="theme-color" content="#1a365d" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
