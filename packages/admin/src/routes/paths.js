const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    // Contenido (textos del portfolio)
    content: {
      root: `${ROOTS.DASHBOARD}/content`,
      personal: `${ROOTS.DASHBOARD}/content/personal`,
      about: `${ROOTS.DASHBOARD}/content/about`,
      summary: `${ROOTS.DASHBOARD}/content/summary`,
      contactSection: `${ROOTS.DASHBOARD}/content/contact-section`,
    },
    // Experiencia laboral
    experience: {
      root: `${ROOTS.DASHBOARD}/experience`,
      new: `${ROOTS.DASHBOARD}/experience/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/experience/${id}`,
    },
    // Skills
    skills: {
      root: `${ROOTS.DASHBOARD}/skills`,
      edit: (id) => `${ROOTS.DASHBOARD}/skills/${id}`,
    },
    // Proyectos
    projects: {
      root: `${ROOTS.DASHBOARD}/projects`,
      new: `${ROOTS.DASHBOARD}/projects/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/projects/${id}`,
    },
    // Contactos recibidos
    contacts: `${ROOTS.DASHBOARD}/contacts`,
    // Perfil
    profile: `${ROOTS.DASHBOARD}/profile`,
  },
};
