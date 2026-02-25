import { prisma } from 'src/lib/prisma';

const SUPPORTED_LANGS = ['en', 'es'];

function validateApiKey(request) {
  const key = request.headers.get('x-api-key');
  return key === process.env.INTERNAL_API_KEY;
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}

export async function GET(request, { params }) {
  if (!validateApiKey(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lang } = await params;
  if (!SUPPORTED_LANGS.includes(lang)) {
    return Response.json({ error: 'Invalid language' }, { status: 400 });
  }

  try {
    const language = await prisma.language.findUnique({
      where: { code: lang },
      include: {
        personalInfos: true,
        metaSeos: true,
        navLabels: true,
        aboutSections: {
          include: { circleItems: { orderBy: { order: 'asc' } } },
        },
        summaryCards: { orderBy: { order: 'asc' } },
        marqueeItems: { orderBy: { order: 'asc' } },
        contactSectionTranslations: true,
        footerTranslations: true,
      },
    });

    if (!language) {
      return Response.json({ error: 'Language not found' }, { status: 404 });
    }

    const [jobs, skillCategories, projects] = await Promise.all([
      prisma.experienceJob.findMany({
        orderBy: { order: 'asc' },
        include: {
          translations: {
            where: { language: { code: lang } },
          },
          stack: { orderBy: { order: 'asc' } },
        },
      }),
      prisma.skillCategory.findMany({
        orderBy: { order: 'asc' },
        include: {
          translations: { where: { language: { code: lang } } },
          skills: {
            orderBy: { order: 'asc' },
            include: {
              translations: { where: { language: { code: lang } } },
              workplaces: { orderBy: { order: 'asc' } },
            },
          },
        },
      }),
      prisma.project.findMany({
        orderBy: { order: 'asc' },
        include: {
          translations: { where: { language: { code: lang } } },
          stack: { orderBy: { order: 'asc' } },
        },
      }),
    ]);

    const personalInfo = language.personalInfos[0] || {};
    const meta = language.metaSeos[0] || {};
    const nav = language.navLabels[0] || {};
    const about = language.aboutSections[0] || {};
    const contactSection = language.contactSectionTranslations[0] || {};
    const footer = language.footerTranslations[0] || {};

    // Construir objeto idéntico al formato de en.json / es.json
    const data = {
      lang,
      meta: {
        title: meta.title || '',
        description: meta.description || '',
      },
      nav: {
        home: nav.home || '',
        about: nav.about || '',
        experience: nav.experience || '',
        skills: nav.skills || '',
        projects: nav.projects || '',
        contact: nav.contact || '',
      },
      hero: {
        name: personalInfo.name || '',
        lastName: personalInfo.lastName || '',
        role: personalInfo.role || '',
        tagline: personalInfo.tagline || '',
        marquee: language.marqueeItems.map((m) => m.text),
      },
      about: {
        title: about.title || '',
        subtitle: about.subtitle || '',
        description: about.description || '',
        location: about.location || '',
        email: about.email || '',
        phone: about.phone || '',
        circleItems: (about.circleItems || []).map((ci) => ci.label),
      },
      summary: language.summaryCards.map((card) => ({
        title: card.title,
        heading: card.heading,
        text: card.text,
      })),
      experience: {
        title: lang === 'es' ? 'Experiencia' : 'Experience',
        jobs: jobs.map((job) => {
          const t = job.translations[0] || {};
          return {
            number: job.number,
            company: job.company,
            role: t.role || '',
            period: `${job.periodStart} – ${job.periodEnd}`,
            summary: t.summary || '',
            details: t.details || '',
            stack: job.stack.map((s) => s.tech),
          };
        }),
      },
      skills: {
        title: lang === 'es' ? 'Habilidades' : 'Skills',
        categories: skillCategories.map((cat) => {
          const catT = cat.translations[0] || {};
          return {
            name: catT.name || '',
            items: cat.skills.map((skill) => {
              const skillT = skill.translations[0] || {};
              return {
                name: skillT.name || '',
                description: skillT.description || '',
                workplaces: skill.workplaces.map((w) => w.workplace),
                years: skill.years,
              };
            }),
          };
        }),
      },
      projects: projects.map((project) => {
        const t = project.translations[0] || {};
        return {
          title: t.title || '',
          description: t.description || '',
          stack: project.stack.map((s) => s.tech),
        };
      }),
      contact: {
        title: contactSection.title || '',
        titleHighlight: contactSection.titleHighlight || '',
        subtitle: contactSection.subtitle || '',
        form: {
          name: contactSection.formName || 'Nombre',
          email: contactSection.formEmail || 'Email',
          subject: contactSection.formSubject || 'Asunto',
          message: contactSection.formMessage || 'Mensaje',
          send: contactSection.formSend || 'Enviar',
          sending: contactSection.formSending || 'Enviando...',
          success: contactSection.formSuccess || 'Mensaje enviado',
          error: contactSection.formError || 'Error al enviar',
        },
      },
      footer: {
        name: footer.name || '',
        email: footer.email || '',
      },
      switchLang: personalInfo.switchLang || (lang === 'es' ? 'EN' : 'ES'),
    };

    return Response.json(data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
