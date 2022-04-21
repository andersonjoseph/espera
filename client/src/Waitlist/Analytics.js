function AnalyticsContent(props) {
  return <p className="text-slate-900 font-bold text-4xl">{props.children}</p>;
}

function AnalyticsTitle(props) {
  return <h2 className="text-slate-700 mb-3">{props.children}</h2>;
}

function AnalyticsCard(props) {
  return (
    <div className="drop-shadow-md bg-white rounded-md p-5">
      {props.children}
    </div>
  );
}

export function Analytics() {
  return (
    <section className="grid grid-cols-3 gap-4">
      <AnalyticsCard>
        <AnalyticsTitle>Registros Totales</AnalyticsTitle>
        <AnalyticsContent>0</AnalyticsContent>
      </AnalyticsCard>

      <AnalyticsCard>
        <AnalyticsTitle>Referidos Totales</AnalyticsTitle>
        <AnalyticsContent>0</AnalyticsContent>
      </AnalyticsCard>

      <AnalyticsCard>
        <AnalyticsTitle>Registros Orgánicos</AnalyticsTitle>
        <AnalyticsContent>0</AnalyticsContent>
      </AnalyticsCard>
    </section>
  );
}
