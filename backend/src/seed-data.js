const bcrypt = require('bcryptjs');

const DEFAULT_CONTENT = {
  brand_name: 'Estudio Lienzo',
  hero_kicker: 'Diseño y desarrollo web · Desde 2019',
  hero_title: 'Páginas web que convierten visitas en clientes.',
  hero_subtitle:
    'Escucho el negocio de cada cliente y lo convierto en una página que trabaja para él. Servicio remoto, en toda Latinoamérica y España, con precios en dólares.',
  about_p1:
    'Un lienzo es una superficie en blanco que sólo tiene valor cuando alguien decide qué poner en ella. Es exactamente lo que hago: escucho el negocio del cliente y lo convierto en una página que trabaja para él.',
  about_p2:
    'Trabajo con pocos proyectos a la vez para entender cada negocio antes de proponer una solución. Cada propuesta se envía por escrito, con alcance y precio en dólares, dentro de las 24 horas de la llamada.',
  contact_title: 'Cuénteme qué necesita y le respondo hoy mismo.',
  contact_subtitle:
    'Sin formularios eternos ni compromiso: primero entiendo el problema y después hablamos de precio.',
  whatsapp_number: '5491122334455',
  contact_email: 'hola@estudiolienzo.com'
};

const DEFAULT_PROJECTS = [
  {
    category: 'Landing · Gastronomía',
    title: 'Café Rincón',
    description: 'Las reservas llegaban por mensajes y se perdían cuando el local estaba lleno.',
    result: '+3x reservas en dos meses, con una sola página y un formulario claro.',
    link: '',
    shot: '',
    order: 1
  },
  {
    category: 'Tienda online · Retail',
    title: 'Botica Verde',
    description: 'El catálogo vivía en Instagram, sin cobro en línea. Hoy vende todos los días de la semana.',
    result: '',
    link: '',
    shot: '',
    order: 2
  },
  {
    category: 'Landing · Turismo',
    title: 'Nómada Tours',
    description: 'Las cotizaciones por correo tardaban días. Un formulario las redujo a minutos.',
    result: '',
    link: '',
    shot: '',
    order: 3
  },
  {
    category: 'Dashboard · Salud',
    title: 'Panel Turnos',
    description: 'Cuatro consultorios comparten hoy una sola agenda, sin choques de horario.',
    result: '',
    link: '',
    shot: '',
    order: 4
  },
  {
    category: 'App con IA · Servicios',
    title: 'Asistente Legal',
    description: 'Resume expedientes largos y libera horas de trabajo manual cada semana.',
    result: '',
    link: '',
    shot: '',
    order: 5
  },
  {
    category: 'Landing · Oficios',
    title: 'Taller Norte',
    description: 'No aparecían en las búsquedas del barrio. Hoy reciben pedidos nuevos cada mes.',
    result: '',
    link: '',
    shot: '',
    order: 6
  }
];

// Shared by the CLI script (prisma/seed.js) and the one-time HTTP seed
// route, so both stay in sync. Idempotent: safe to call more than once.
async function seedDatabase(prisma, { adminEmail, adminPassword }) {
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const log = [];

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: 'admin' },
    create: { name: 'Admin', email: adminEmail, passwordHash, role: 'admin' }
  });
  log.push(`Admin user ready: ${adminEmail}`);

  for (const [key, value] of Object.entries(DEFAULT_CONTENT)) {
    await prisma.siteContent.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  log.push('Site content seeded (existing keys left untouched).');

  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.createMany({ data: DEFAULT_PROJECTS });
    log.push(`Seeded ${DEFAULT_PROJECTS.length} initial projects.`);
  } else {
    log.push('Projects already exist, skipping project seed.');
  }

  return log;
}

module.exports = { seedDatabase, DEFAULT_CONTENT, DEFAULT_PROJECTS };
