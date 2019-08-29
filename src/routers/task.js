const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        const taskSaved = await task.save();
        res.status(201).send(taskSaved);
    } catch (e) {
        res.status(400).send(e);
    }
});

//?limit=10&skip=3
//sortBy=createdAt[modified]:asc[desc]
router.get('/tasks', auth, async (req, res) => {
    const isCompleted = req.query.completed;
    const limit = req.query.limit;
    const skip = req.query.skip;

    const match = {};
    const sort = {};

    if (isCompleted) {
        match.completed = isCompleted === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }

    try {

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if (!task) {
            return res.status(404).send({error: 'A task not found'});
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

});

router.patch('/tasks/:id', auth, async (req, res) => {
    const requestedParams = Object.keys(req.body);
    const allowedParams = ['description', 'completed'];
    const isUpdateAllowed = requestedParams.every((item) => {
        return allowedParams.includes(item);
    });

    if (!isUpdateAllowed) {
        return res.status(400).send({error: 'updated is not allowed'});
    }
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if (!task) {
            return res.status(404).send({error: 'Record not found. No changes were applied'})
        }
        requestedParams.forEach((item) => {
            task[item] = req.body[item];
        });
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).send('The record not found');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/*', (req, res) => {
    res.send({message: 'Page not found'});
});

module.exports = router;