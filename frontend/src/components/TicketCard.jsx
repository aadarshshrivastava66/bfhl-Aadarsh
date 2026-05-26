function TicketCard({
  ticket,
  updateStatus,
}) {
  const next = {
    open: "in_progress",

    in_progress: "resolved",

    resolved: "closed",
  };

  const prev = {
    in_progress: "open",

    resolved: "in_progress",

    closed: "resolved",
  };





  return (
    <div className="card">

      <h3>{ticket.subject}</h3>

      <p>
        {ticket.customerEmail}
      </p>

      <p>
        Priority:
        {" "}
        {ticket.priority}
      </p>

      <p>
        Age:
        {" "}
        {ticket.ageMinutes}m
      </p>

      {ticket.slaBreached && (
        <p className="breach">
          SLA Breached
        </p>
      )}





      <div className="buttons">

        {prev[ticket.status] && (
          <button
            onClick={() =>
              updateStatus(
                ticket._id,
                prev[ticket.status]
              )
            }
          >
            Back
          </button>
        )}





        {next[ticket.status] && (
          <button
            onClick={() =>
              updateStatus(
                ticket._id,
                next[ticket.status]
              )
            }
          >
            Next
          </button>
        )}

      </div>

    </div>
  );
}

export default TicketCard;