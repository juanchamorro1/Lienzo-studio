import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectCard from '@/components/ProjectCard';
import Comments from '@/components/Comments';
import { API_URL } from '@/lib/api';

async function getData() {
  const [projectsRes, contentRes, commentsRes] = await Promise.all([
    fetch(`${API_URL}/api/projects`, { cache: 'no-store' }),
    fetch(`${API_URL}/api/content`, { cache: 'no-store' }),
    fetch(`${API_URL}/api/comments`, { cache: 'no-store' })
  ]);

  const projects = projectsRes.ok ? (await projectsRes.json()).projects : [];
  const content = contentRes.ok ? (await contentRes.json()).content : {};
  const comments = commentsRes.ok ? (await commentsRes.json()).comments : [];

  return { projects, content, comments };
}

function c(content, key, fallback) {
  return content[key] || fallback;
}

export default async function HomePage() {
  const { projects, content, comments } = await getData();
  const whatsapp = c(content, 'whatsapp_number', '');
  const email = c(content, 'contact_email', '');

  return (
    <>
      <Header brandName={c(content, 'brand_name', 'Estudio Lienzo')} />

      <section className="hero wrap" id="top">
        <div className="eyebrow">
          <i></i>
          <span className="kicker">{c(content, 'hero_kicker', 'Diseño y desarrollo web')}</span>
        </div>
        <h1>{c(content, 'hero_title', 'Páginas web que convierten visitas en clientes.')}</h1>
        <div className="hero-foot">
          <p>{c(content, 'hero_subtitle', '')}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#proyectos">
              Ver proyectos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            {whatsapp && (
              <a className="btn" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="rule"></div>
      </div>

      <section id="proyectos" className="wrap">
        <div className="sec-head">
          <span className="kicker">01</span>
          <h2>Proyectos</h2>
        </div>
        <p className="lede">Cada proyecto empezó con un problema concreto de negocio.</p>
        <div className="g-work">
          {projects.map((p) => (
            <ProjectCard project={p} key={p.id} />
          ))}
        </div>
      </section>

      <div className="band">
        <section id="estudio" className="wrap">
          <div className="sec-head">
            <span className="kicker">02</span>
            <h2>El estudio</h2>
          </div>
          <div className="about-grid">
            <div className="about-copy">
              <p>{c(content, 'about_p1', '')}</p>
              <p>{c(content, 'about_p2', '')}</p>
            </div>
            <div className="about-facts">
              <div className="fact">
                <b>Rubro</b>
                <span>Diseño y desarrollo web a medida</span>
              </div>
              <div className="fact">
                <b>Público</b>
                <span>Negocios locales, gastronomía y emprendedores digitales</span>
              </div>
              <div className="fact">
                <b>Alcance</b>
                <span>Remoto · toda Latinoamérica y España · precios en USD</span>
              </div>
              <div className="fact">
                <b>Contacto</b>
                <span>Juan · {c(content, 'brand_name', 'Estudio Lienzo')}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Comments initialComments={comments} />

      <div className="contact">
        <section id="contacto" className="wrap">
          <div className="contact-grid">
            <div className="contact-copy">
              <span className="kicker">05 — Contacto</span>
              <h2>{c(content, 'contact_title', 'Cuénteme qué necesita.')}</h2>
              <p>{c(content, 'contact_subtitle', '')}</p>
              <div className="hero-actions">
                {whatsapp && (
                  <a className="btn btn-primary" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5Z" />
                    </svg>
                    Escribir por WhatsApp
                  </a>
                )}
                {email && (
                  <a className="btn" href={`mailto:${email}`}>
                    {email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer brandName={c(content, 'brand_name', 'Estudio Lienzo')} />
    </>
  );
}
