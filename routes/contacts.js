const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");
// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get("/", auth, async (req, res) => {
	try {
		const contacts = await Contact.find({ user: req.user.id }).sort({
			date: -1,
		});
		res.json(contacts);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error!");
	}
});
// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post(
	"/",
	[auth, [check("name", "Please enter a name!").not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, email, phone, type } = req.body;
		try {
			const newContact = new Contact({
				name,
				email,
				phone,
				type,
				user: req.user.id,
			});
			const contact = await newContact.save();
			return res.json(contact);
		} catch (err) {
			console.error(err);
			res.status(500).send("Server error!");
		}
	}
);
// @route   PUT api/contacts/:id
// @desc    Update a users contact
// @access  Private
router.put("/:id", auth, async (req, res) => {
	const { name, email, phone, type } = req.body;
	const contactFields = {};
	if (name) contactFields.name = name;
	if (email) contactFields.email = email;
	if (phone) contactFields.phone = phone;
	if (type) contactFields.type = type;
	try {
		let contact = await Contact.findById(req.params.id);
		if (!contact) {
			res.status(404).json({ msg: "Contact not found!" });
		}
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "No access allowed!" });
		}
		contact = await Contact.findByIdAndUpdate(
			req.params.id,
			{
				$set: contactFields,
			},
			{ new: true }
		);
		res.json(contact);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error!");
	}
});
// @route   DELETE api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete("/:id", auth, async (req, res) => {
	try {
		let contact = await Contact.findById(req.params.id);
		if (!contact) {
			res.status(404).json({ msg: "Contact not found!" });
		}
		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "No access allowed!" });
		}
		await Contact.findByIdAndRemove(req.params.id);
		res.json(`Contact removed!`);
	} catch (err) {
		console.error(err);
		res.status(500).send("Server error!");
	}
});
module.exports = router;
