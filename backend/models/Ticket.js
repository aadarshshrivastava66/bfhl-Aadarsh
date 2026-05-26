const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    customerEmail: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "in_progress",
        "resolved",
        "closed",
      ],
      default: "open",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Ticket",
  ticketSchema
);