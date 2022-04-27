export default function Hero({ title, children }) {
  return (
    <section className="hero px-4">
      {title && <h2>{title}</h2>}
      {children}
    </section>
  )
}
