const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        const taskSaved = await task.save();
        res.status(201).send(taskSaved);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findById(_id);
        console.log(task);
        if (task === null) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

});

router.patch('/tasks/:id', async (req, res) => {
    const requestedParams = Object.keys(req.body);
    const allowedParams = ['description', 'completed'];
    const isUpdateAllowed = requestedParams.every((item) => {
        return allowedParams.includes(item);
    });

    if (!isUpdateAllowed) {
        return res.status(400).send({error: 'updated is not allowed'});
    }
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        const task = await Task.findById(req.params.id);

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

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send('A record not found');
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