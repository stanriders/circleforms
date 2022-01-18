export default function Hero({ title, children }) {
  return (
    <section className="hero">
      { title && <h2>{ title }</h2> }
      { children }
    </section>
  )
}