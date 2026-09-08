export default function ProjectCard({ project }) {
  return (
    <article className="work">
      <div className="shot">
        {project.shot ? <img src={project.shot} alt={project.title} /> : <span>Captura pendiente</span>}
      </div>
      <div className="work-body">
        <span className="work-tag">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.result ? <p className="result">{project.result}</p> : null}
        {project.link ? (
          <a className="live" href={project.link} target="_blank" rel="noopener noreferrer">
            Ver sitio en vivo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        ) : (
          <span className="live disabled">Aún sin publicar</span>
        )}
      </div>
    </article>
  );
}
