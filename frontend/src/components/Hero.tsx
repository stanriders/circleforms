interface IHero {
  title?: string;
  children: React.ReactNode;
}

export default function Hero({ title, children }: IHero) {
  return (
    <section className="hero px-4">
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}
