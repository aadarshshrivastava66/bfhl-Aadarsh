const Ticket = require("../models/Ticket");
const validator = require("validator");

const {
  getTicketWithDerivedFields,
} = require("../utils/slaHelper");

const statusFlow = [
  "open",
  "in_progress",
  "resolved",
  "closed",
];

const isValidTransition = (current, next) => {
  const currentIndex = statusFlow.indexOf(current);
  const nextIndex = statusFlow.indexOf(next);

  // forward only one step
  if (nextIndex === currentIndex + 1) {
    return true;
  }

  // backward only one step
  if (nextIndex === currentIndex - 1) {
    return true;
  }

  return false;
};





// CREATE TICKET
const createTicket = async (req, res) => {
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
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(customerEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const validPriorities = [
      "low",
      "medium",
      "high",
      "urgent",
    ];

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority value",
      });
    }

    const ticket = await Ticket.create({
      subject,
      description,
      customerEmail,
      priority,
    });

    const finalTicket =
      getTicketWithDerivedFields(ticket);

    res.status(201).json(finalTicket);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};






// GET ALL TICKETS
const getTickets = async (req, res) => {
  try {
    const { status, priority, breached } =
      req.query;

    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    let tickets = await Ticket.find(filter).sort({
      createdAt: -1,
    });

    tickets = tickets.map((ticket) =>
      getTicketWithDerivedFields(ticket)
    );

    if (breached === "true") {
      tickets = tickets.filter(
        (ticket) => ticket.slaBreached === true
      );
    }

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};






// UPDATE TICKET STATUS
const updateTicket = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const ticket = await Ticket.findById(
      req.params.id
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (
      ![
        "open",
        "in_progress",
        "resolved",
        "closed",
      ].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    if (!isValidTransition(ticket.status, status)) {
      return res.status(400).json({
        message:
          "Invalid status transition",
      });
    }

    ticket.status = status;

    // SET resolvedAt
    if (status === "resolved") {
      ticket.resolvedAt = new Date();
    }

    // CLEAR resolvedAt if moved back
    if (
      ticket.status === "in_progress" &&
      status === "in_progress"
    ) {
      ticket.resolvedAt = null;
    }

    await ticket.save();

    const updatedTicket =
      getTicketWithDerivedFields(ticket);

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};






// DELETE TICKET
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(
      req.params.id
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    await ticket.deleteOne();

    res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};







// GET STATS
const getStats = async (req, res) => {
  try {
    const tickets = await Ticket.find();

    const stats = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,

      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,

      breachedOpenTickets: 0,
    };

    tickets.forEach((ticket) => {
      stats[ticket.status]++;
      stats[ticket.priority]++;

      const ticketWithFields =
        getTicketWithDerivedFields(ticket);

      if (
        ticketWithFields.slaBreached &&
        ticket.status !== "resolved" &&
        ticket.status !== "closed"
      ) {
        stats.breachedOpenTickets++;
      }
    });

    res.status(200).json(stats);
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