const express = require("express")

const router = express.Router()

const ctrl = require("../../controllers/contacts");
const { validateBody, isValidId, auth } = require("../../middlewares");
const { addSchema, updFavSchema } = require("../../schemas/contacts");

router.get('/', auth, ctrl.listContacts) 

router.get('/:id', auth, ctrl.getContactById, isValidId)

router.post('/', auth, validateBody(addSchema), ctrl.addContact)

router.delete('/:id', auth, ctrl.removeContact, isValidId)

router.put('/:id', auth, ctrl.updateContactById, validateBody(addSchema), isValidId)

router.patch("/:id/favorite", auth, isValidId, validateBody(updFavSchema), ctrl.updateFavorite);

module.exports = router;
