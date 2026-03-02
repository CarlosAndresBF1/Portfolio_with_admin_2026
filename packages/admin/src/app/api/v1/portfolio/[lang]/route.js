import { getDB } from 'src/lib/db';

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
    const db = await getDB();
    const langRepo = db.getRepository('Language');

    const language = await langRepo.findOne({
      where: { code: lang },
      relations: {
        personalInfos: true,
        metaSeos: true,
        navLabels: true,
        aboutSections: { circleItems: true },
        summaryCards: true,
        marqueeItems: true,
        contactSectionTranslations: true,
        footerTranslations: true,
      },
    });

    if (!language) {
      return Response.json({ error: 'Language not found' }, { status: 404 });
    }

    // Sort relations in JS
    if (language.aboutSections) {
      language.aboutSections.forEach((a) =>
        a.circleItems.sort((x, y) => x.order - y.order)
      );
    }
    if (language.summaryCards) language.summaryCards.sort((a, b) => a.order - b.order);
    if (language.marqueeItems) language.marqueeItems.sort((a, b) => a.order - b.order);

    // Fetch jobs, skills, projects with filtered translations via QueryBuilder
    const jobRepo = db.getRepository('ExperienceJob');
    const catRepo = db.getRepository('SkillCategory');
    const projRepo = db.getRepository('Project');

    const [jobs, skillCategories, projects, socialLinks] = await Promise.all([
      jobRepo
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.translations', 'jt', 'jt.languageId = :langId', {
          langId: language.id,
        })
        .leftJoinAndSelect('job.stack', 'js')
        .orderBy('job.order', 'ASC')
        .addOrderBy('js.order', 'ASC')
        .getMany(),
      catRepo
        .createQueryBuilder('cat')
        .leftJoinAndSelect('cat.translations', 'ct', 'ct.languageId = :langId', {
          langId: language.id,
        })
        .leftJoinAndSelect('cat.skills', 'skill')
        .leftJoinAndSelect('skill.translations', 'st', 'st.languageId = :langId', {
          langId: language.id,
        })
        .leftJoinAndSelect('skill.workplaces', 'sw')
        .leftJoinAndSelect('sw.job', 'swJob')
        .orderBy('cat.order', 'ASC')
        .addOrderBy('skill.order', 'ASC')
        .addOrderBy('sw.order', 'ASC')
        .getMany(),
      projRepo
        .createQueryBuilder('proj')
        .leftJoinAndSelect('proj.translations', 'pt', 'pt.languageId = :langId', {
          langId: language.id,
        })
        .leftJoinAndSelect('proj.stack', 'ps')
        .orderBy('proj.order', 'ASC')
        .addOrderBy('ps.order', 'ASC')
        .getMany(),
      db.getRepository('SocialLink').find({
        where: { visible: true },
        order: { order: 'ASC' },
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
            period: job.periodEnd ? `${job.periodStart} – ${job.periodEnd}` : job.periodStart,
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
                workplaces: skill.workplaces.map((w) => w.job?.company || ''),
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
      socialLinks: socialLinks.map((link) => ({
        platform: link.platform,
        label: link.label,
        url: lang === 'en' && link.urlEn ? link.urlEn : link.url,
        icon: link.icon,
      })),
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
