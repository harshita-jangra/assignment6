// backend/models/Ticket.js
// Ticket model schema for Complaint & Helpdesk Ticket System

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please enter a ticket title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
    },
    description: {
      type: String,
      required: [true, 'Please enter a detailed description of the problem'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Technical', 'Billing', 'General', 'Account'],
        message: '{VALUE} is not a valid category',
      },
    },
    priority: {
      type: String,
      required: [true, 'Please select a priority'],
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'Low',
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['Open', 'In Progress', 'Resolved', 'Closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Open',
    },
    screenshotUrl: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // TODO (Student task): Link ticket to Department once Department model is created
    // assignedDepartment: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Department',
    // },

    // TODO (Student task): Track reopen count (Rule: A Resolved ticket can be reopened once)
    // reopenCount: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
