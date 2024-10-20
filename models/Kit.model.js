const { Schema, model } = require("mongoose");

const kitSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    description: {
        type: String,
        required: [true, "Description is required."],
    },    
    image: {
        type: String,
        required: [true, "Image is required."]
    },
    price: {
        type: Number,
        required: [true, "Price is required."]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required."]
    },
    products: [
        { type: Schema.Types.ObjectId, ref: "Product" }
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Kit = model("Kit", kitSchema);

module.exports = Kit;
