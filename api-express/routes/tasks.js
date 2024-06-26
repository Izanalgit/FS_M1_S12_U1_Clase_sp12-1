const express = require('express')
const { v4: uuidv4 } = require('uuid')

const {
	body,
	params,
	query,
	validationResult,
} = require('express-validator')

const router = express.Router()

const taskList = {}

router.get('/', (req, res) => {
	res.json(Object.values(taskList))
})

router.get('/:taskId', (req, res) => {
	const { taskId } = req.params

	if (!taskList[taskId])
		return res.status(404).json({ message: 'Item not found' })

	res.json(taskList[taskId])
})

function validate(req, res, next) {
	const result = validationResult(req)

	if (!result.isEmpty())
		return res.status(422).json({ errors: result.array() })

	next()
}

const taskSchemaValidation = [
	body('title').notEmpty(),
	body('complete')
		.isBoolean()
		.withMessage('JEJEJEJ QUE ES BOOLEANO!!!'),
]

router.post('/', taskSchemaValidation, validate, (req, res) => {
	const id = uuidv4()
	const newTask = { id, ...req.body }

	taskList[id] = newTask

	res.status(201).send(newTask)
})

router.put('/:taskId', (req, res) => {
	const { taskId } = req.params

	if (!taskList[taskId])
		return res.status(404).json({ message: 'Item not found' })

	taskList[taskId] = { ...taskList[taskId], ...req.body }

	res.json(taskList[taskId])
})

router.delete('/:taskId', (req, res) => {
	const { taskId } = req.params

	if (!taskList[taskId])
		return res.status(404).json({ message: 'Item not found' })

	const deletedTask = taskList[taskId]

	delete taskList[taskId]

	res.json(deletedTask)
})

module.exports = router
