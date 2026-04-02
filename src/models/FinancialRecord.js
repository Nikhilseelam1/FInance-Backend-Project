const mongoose = require("mongoose");

const financialRecordSchema = new mongoose.Schema(
  {
    amount: 
    {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    type:
    {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Type is required"],
    },
    category: 
    {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    date: 
    {
      type: Date,
      required: [true, "Date is required"],
    },
    notes: 
    {
      type: String,
      trim: true,
      default: "",
    },
    isDeleted:
     {
      type: Boolean,
      default: false,
    },
    createdBy: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

financialRecordSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

module.exports = mongoose.model("FinancialRecord", financialRecordSchema);