// server/routes/surveys.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Survey = require('../models/survey');

// --- Create a new survey --- (Private)
// @route   POST /api/surveys
// @desc    Create a new survey
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, options, timer } = req.body;
    if (!title || !options || options.length < 2 || !timer) {
        return res.status(400).json({ msg: 'Please provide a title, at least two options, and a timer.' });
    }
    try {
        const newSurvey = new Survey({
            title,
            options: options.map(optionText => ({ text: optionText, votes: 0 })),
            creator: req.user.id,
            timer: timer * 60,
            expiresAt: new Date(Date.now() + timer * 60 * 1000),
        });
        const survey = await newSurvey.save();
        res.status(201).json(survey);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Get all surveys for the logged-in admin --- (Private)
// @route   GET /api/surveys
// @desc    Get all surveys created by the admin
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const surveys = await Survey.find({ creator: req.user.id }).sort({ createdAt: -1 });
        res.json(surveys);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Get all ACTIVE surveys for the public --- (Public)
// @route   GET /api/surveys/public
// @desc    Get all active surveys
// @access  Public
router.get('/public', async (req, res) => {
    try {
        const surveys = await Survey.find({ expiresAt: { $gt: new Date() } })
                                    .sort({ createdAt: -1 });
        res.json(surveys);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Submit a vote --- (Public)
// @route   PUT /api/surveys/vote/:surveyId/:optionId
// @desc    Submit a vote for a survey option
// @access  Public
router.put('/vote/:surveyId/:optionId', async (req, res) => {
    try {
        const survey = await Survey.findOne({
            _id: req.params.surveyId,
            'options._id': req.params.optionId
        });

        if (!survey) {
            return res.status(404).json({ msg: 'Survey or option not found' });
        }
        
        if (new Date() > survey.expiresAt) {
            return res.status(400).json({ msg: 'This survey has expired.' });
        }

        // Find the option and increment the vote
        const option = survey.options.id(req.params.optionId);
        option.votes += 1;
        
        await survey.save();
        
        // Get the io object from the app instance
        const io = req.app.get('socketio');
        // Emit an event with the updated survey data to all clients
        io.emit('voteUpdate', survey);

        res.json(survey);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
