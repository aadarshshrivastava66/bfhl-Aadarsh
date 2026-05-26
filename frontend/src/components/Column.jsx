import TicketCard from "./TicketCard";

function Column({
  title,
  tickets,
  updateStatus,
}) {
  return (
    <div className="column">

      <h2>
        {title.replace("_", " ")}
      </h2>

      {tickets.map((ticket) => (
        <TicketCard
          key={ticket._id}
          ticket={ticket}
          updateStatus={updateStatus}
        />
      ))}

    </div>
  );
}

export default Column;