const Ticket = require("../models/Ticket");

const validator = require("validator");

const {
  getTicketWithFields,
} = require("../utils/slaHelper");

const flow = [
  "open",
  "in_progress",
  "resolved",
  "closed",
];

const validTransition = (
  current,
  next
) => {
  const c = flow.indexOf(current);

  const n = flow.indexOf(next);

  return (
    n === c + 1 ||
    n === c - 1
  );
};




// CREATE
const createTicket = async (
  req,
  res
) => {
  try {
    const {
      subject,
      description,
      customerEmail,
      priority,
    } = req.body;

    if (
      !subject ||
      !description ||
      !customerEmail ||
      !priority
    ) {
      return res.status(400).json({
        message:
          "All fields required",
      });
    }

    if (
      !validator.isEmail(
        customerEmail
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid email",
      });
    }

    const ticket =
      await Ticket.create({
        subject,
        description,
        customerEmail,
        priority,
      });

    res.status(201).json(
      getTicketWithFields(ticket)
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




// GET
const getTickets = async (
  req,
  res
) => {
  try {
    const {
      status,
      priority,
      breached,
    } = req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    let tickets =
      await Ticket.find(filter).sort({
        createdAt: -1,
      });

    tickets = tickets.map((t) =>
      getTicketWithFields(t)
    );

    if (breached === "true") {
      tickets = tickets.filter(
        (t) => t.slaBreached
      );
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




// UPDATE
const updateTicket = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const ticket =
      await Ticket.findById(
        req.params.id
      );

    if (!ticket) {
      return res.status(404).json({
        message:
          "Ticket not found",
      });
    }

    if (
      !validTransition(
        ticket.status,
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid transition",
      });
    }

    const previous =
      ticket.status;

    ticket.status = status;

    if (status === "resolved") {
      ticket.resolvedAt =
        new Date();
    }

    if (
      previous === "resolved" &&
      status === "in_progress"
    ) {
      ticket.resolvedAt = null;
    }

    await ticket.save();

    res.json(
      getTicketWithFields(ticket)
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




// DELETE
const deleteTicket = async (
  req,
  res
) => {
  try {
    await Ticket.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




// STATS
const getStats = async (
  req,
  res
) => {
  try {
    const tickets =
      await Ticket.find();

    const stats = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      breached: 0,
    };

    tickets.forEach((ticket) => {
      stats[ticket.status]++;

      const t =
        getTicketWithFields(
          ticket
        );

      if (
        t.slaBreached &&
        ticket.status !==
          "resolved" &&
        ticket.status !== "closed"
      ) {
        stats.breached++;
      }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
  getStats,
};