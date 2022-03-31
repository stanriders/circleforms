export default function Title({
  title,
  children,
  Decoration,
}) {
  return (
    <div className="flex justify-center relative py-6">
      { Decoration && <Decoration /> || <DefaultDecoration /> }
      <div className="z-10 text-center">
        <h1 className="text-6xl lg:text-8xl font-bold z-10 mt-4">
          {title}
        </h1>
        { children && (
          <p className="text-2xl mt-2">
            {children}
          </p>
        )}
      </div>
    </div>
  )
}

function DefaultDecoration() {
  return (
    <svg className="absolute -ml-32" width="499" height="76" viewBox="0 0 499 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="182.553" height="75.893" rx="37.9465" fill="#FF66AA"/>
      <rect x="283.061" width="129.223" height="75.893" rx="37.9465" fill="#FF66AA"/>
      <rect x="195" width="72" height="76" rx="35.8953" fill="#FF66AA"/>
      <rect x="424.59" width="73.8418" height="75.893" rx="36.9209" fill="#FF66AA"/>
    </svg>
  )
}