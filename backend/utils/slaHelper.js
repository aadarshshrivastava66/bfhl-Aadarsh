const slaTargets = {
  urgent: 60,
  high: 240,
  medium: 1440,
  low: 4320,
};

const getTicketWithDerivedFields = (ticket) => {
  const ticketObj = ticket.toObject();

  const endTime =
    ticket.status === "resolved" || ticket.status === "closed"
      ? ticket.resolvedAt || new Date()
      : new Date();

  const ageMinutes = Math.floor(
    (endTime - ticket.createdAt) / (1000 * 60)
  );

  const slaLimit = slaTargets[ticket.priority];

  const slaBreached = ageMinutes > slaLimit;

  return {
    ...ticketObj,
    ageMinutes,
    slaBreached,
  };
};

module.exports = {
  getTicketWithDerivedFields,
  slaTargets,
};