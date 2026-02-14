interface EjerciciosSectionProps {
  phase: string
  recommended: string[]
}

export function EjerciciosSection({ phase, recommended }: EjerciciosSectionProps) {
  return (
    <section className="fit-split-grid">
      <article className="glass-card">
        <div className="panel-head">
          <h2>Phase Recommendations</h2>
          <span>{phase}</span>
        </div>
        <ul className="recommend-list">
          {recommended.map((exercise, index) => (
            <li key={exercise}>
              <div className="recommend-index">{index + 1}</div>
              <div>
                <h4>{exercise}</h4>
                <p>Intensity: {index < 2 ? 'High' : index === 2 ? 'Medium' : 'Low'} • 45-75 min</p>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="glass-card panel-large">
        <div className="panel-head">
          <h2>Weekly Schedule</h2>
          <span>Oct 23 - Oct 29</span>
        </div>
        <div className="week-grid">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div key={day} className={index === 0 ? 'week-day active' : 'week-day'}>
              <header>{day}</header>
              <p>{recommended[index % recommended.length]}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}
