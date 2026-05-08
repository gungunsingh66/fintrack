const router = require("express").Router();
const Transaction = require("../models/Transaction");
const verifyToken = require("../middleware/auth");

//create
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, amount, type, date, category } = req.body;

    const newTransaction = new Transaction({
      title,
      amount,
      type,
      date,
      category,
      userId: req.user.id,   
    });

    const saved = await newTransaction.save();

    res.json(saved);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

// READ
router.get("/", verifyToken, async (req, res) => {
  try {
    const data = await Transaction.find({
      userId: req.user.id,   
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error fetching data");
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    res.json("Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json("Not found");

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;