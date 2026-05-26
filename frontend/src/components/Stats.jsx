function Stats({ stats }) {
  return (
    <div className="stats">

      <div>
        Open:
        {" "}
        {stats.open || 0}
      </div>

      <div>
        In Progress:
        {" "}
        {stats.in_progress || 0}
      </div>

      <div>
        Resolved:
        {" "}
        {stats.resolved || 0}
      </div>

      <div>
        Closed:
        {" "}
        {stats.closed || 0}
      </div>

      <div>
        Breached:
        {" "}
        {stats.breached || 0}
      </div>

    </div>
  );
}

export default Stats;