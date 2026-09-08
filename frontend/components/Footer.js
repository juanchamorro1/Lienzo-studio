export default function Footer({ brandName }) {
  const [first, ...rest] = (brandName || 'Estudio Lienzo').split(' ');
  return (
    <footer>
      <div className="wrap foot">
        <div className="foot-brand">
          <b>
            {first} <em>{rest.join(' ')}</em>
          </b>
          <small>Diseño y desarrollo web</small>
        </div>
        <div className="foot-links">
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
          <a href="#">GitHub</a>
          <small>© {new Date().getFullYear()}</small>
        </div>
      </div>
    </footer>
  );
}
