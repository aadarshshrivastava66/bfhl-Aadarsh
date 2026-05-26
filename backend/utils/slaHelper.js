const slaTargets = {
  urgent: 60,
  high: 240,
  medium: 1440,
  low: 4320,
};

const getTicketWithFields = (ticket) => {
  const obj = ticket.toObject();

  const endTime =
    ticket.status === "resolved" ||
    ticket.status === "closed"
      ? ticket.resolvedAt || new Date()
      : new Date();

  const ageMinutes = Math.floor(
    (endTime - ticket.createdAt) /
      (1000 * 60)
  );

  const slaBreached =
    ageMinutes >
    slaTargets[ticket.priority];

  return {
    ...obj,
    ageMinutes,
    slaBreached,
  };
};

module.exports = {
  getTicketWithFields,
};