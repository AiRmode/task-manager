//task-manager-app SendGrid key
//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
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const fileUpload = require('../middleware/fileUpload');
const {sendWelcomeEmail, sendGoodbyeEmail} = require('../emails/account');

const router = new express.Router();
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const savedUser = await user.save();
        sendWelcomeEmail(savedUser.email, user.name);
        const token = await savedUser.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body['email'], req.body['password']);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll/', auth, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = [];
        await user.save();
        res.send({user, token: user.tokens});
    } catch (e) {
        res.status(500).send({error: 'Not authenticated'});
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(item => allowedUpdates.includes(item));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        const user = req.user;

        updates.forEach((item) => {
            user[item] = req.body[item];
        });
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendGoodbyeEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/users/me/avatar', auth, fileUpload.upload.single('avatar'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send('Avatar uploaded');
    } catch (e) {
        res.status(500).send({error: e})
    }
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send({message: 'Avatar deleted'})
    } catch (e) {
        res.status(500).send({error: 'delete avatar error'})
    }
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error('No user or avatar');
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send({error: 'image not found'});
    }
});

module.exports = router;