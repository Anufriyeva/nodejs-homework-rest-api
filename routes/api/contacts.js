const express = require("express")

const router = express.Router()

const ctrl = require("../../controllers/contacts");
const { validateBody, isValidId } = require("../../middlewares");
const { addSchema, updFavSchema } = require("../../schemas/contacts");

router.get('/', ctrl.listContacts) 

router.get('/:id', ctrl.getContactById, isValidId)

router.post('/', validateBody(addSchema), ctrl.addContact)

router.delete('/:id', ctrl.removeContact, isValidId)

router.put('/:id', ctrl.updateContactById, validateBody(addSchema), isValidId)

router.patch("/:id/favorite", isValidId, validateBody(updFavSchema), ctrl.updateFavorite);

module.exports = router;
