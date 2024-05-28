const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDb")

// GET route to get all items
router.get('/', (req, res) => {
    return res.status(200).json(items)
})

// POST route to add new item
router.post('/', (req, res, next) => {
    try{
        if (!req.body.name || !req.body.price){
            throw new ExpressError("Name and price required", 400);
        }
        const newItem = {name: req.body.name, price:req.body.price}
        items.push(newItem)
        return res.status(201).json({added: newItem})
    }catch(e){
        return next(e)
    }
})

// GET route to get certain item
router.get('/:name', (req, res) => {
    const foundItem = items.find(item => item.name === req.params.name)
    if (!foundItem){
        throw new ExpressError('Item not found', 404)
    }
    return res.status(200).json(foundItem)
})

// PATCH route to modify certain item
router.patch('/:name', (req, res) => {
    const foundItem = items.find(item => item.name === req.params.name)
    if (!foundItem){
        throw new ExpressError('Item not found', 404)
    }
    foundItem.name = req.body.name
    foundItem.price = req.body.price
    res.status(200).json({updated: foundItem})
})

// DELETE route to delete item
router.delete('/:name', (req, res) => {
    const foundItemIdx = items.findIndex(item => item.name === req.params.name)
    if (foundItemIdx === -1){
        throw new ExpressError('Item not found', 404)
    }
    items.splice(foundItemIdx, 1)
    res.status(200).json({message: 'Deleted'})
})

module.exports = router;