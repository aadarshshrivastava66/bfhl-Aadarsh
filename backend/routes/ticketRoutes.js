const express = require("express");

const {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
  getStats,
} = require("../controllers/ticketController");

const router =
  express.Router();

router.post(
  "/tickets",
  createTicket
);

router.get(
  "/tickets/stats",
  getStats
);

router.get(
  "/tickets",
  getTickets
);

router.patch(
  "/tickets/:id",
  updateTicket
);

router.delete(
  "/tickets/:id",
  deleteTicket
);

module.exports = router;