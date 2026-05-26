import Column from "./Column";

function Board({
  tickets,
  updateStatus,
}) {
  const columns = [
    "open",
    "in_progress",
    "resolved",
    "closed",
  ];

  return (
    <div className="board">

      {columns.map((column) => (
        <Column
          key={column}
          title={column}
          tickets={tickets.filter(
            (ticket) =>
              ticket.status === column
          )}
          updateStatus={updateStatus}
        />
      ))}

    </div>
  );
}

export default Board;