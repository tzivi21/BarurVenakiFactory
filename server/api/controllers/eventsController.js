const EventsServices = require("../../services/eventServices");
const express = require("express");
const validation = require('../../modules/validation');

const eventsController = {
    getAllEvents: async (req, res) => {
        if (req.securityLevel != "manager")
            return res.status(401).json({ error: "unauthorized" });
        else {
            try {
                let events = await EventsServices.getAllEvents();
                res.status(200).json(events);
            } catch (error) {
                res.status(500).json({ error: "server internal error" });
            }
        }
    },
    getEventByID: async (req, res) => {
        if (req.securityLevel != "manager")
            return res.status(401).json({ error: "unauthorized" });
        try {
            const { id } = req.params;
            let event = await EventsServices.getEventById(id);
            if (!event) {
                res.status(404).json({ error: "event not found" });
            } else {
                res.status(200).json(event);
            }
        } catch (error) {
            res.status(500).json({ error: "server internal error" });
        }
    },
    createEvent: async (req, res) => {
        if (req.securityLevel !== "manager" && req.securityLevel !== "user") {
            return res.status(401).json({ error: "Unauthorized" });
        }
    
        try {
            const event = req.body;
            
            if (!validation.validateEventsInput(event)) {
                return res.status(400).json({ error: 'Invalid input' });
            }
            
            const newEvent = await EventsServices.createEvent(event);
            res.status(200).json(newEvent);
        } catch (error) {
            console.error("Error creating event:", error);
            res.status(500).json({ error: "Server internal error" });
        }
    }
    ,
updateEvent: async (req, res) => {
    if (req.securityLevel != "manager")
        return res.status(401).json({ error: "unauthorized" });
    else {
        try {
            const { id } = req.params;
            let updatedEventsData = req.body;
            if (!validation.validateEventsInput(updatedEventsData, true)) {
                res.status(400).json({ error: 'invalid input' });
            } else if (await EventsServices.getEventById(id) === null) {
                res.status(404).json({ error: "event not found" });
            } else {
                updatedEventsData = await EventsServices.updateEvent(updatedEventsData);
                res.status(200).json(updatedEventsData);
            }
        } catch (error) {
            res.status(500).json({ error: "server internal error" });
        }
    }
},
    deleteEvent: async (req, res) => {
        if (req.securityLevel != "manager")
            res.status(401).json({ error: "unauthorized" });
        else {
            try {
                const { id } = req.params;
                if (await EventsServices.getEventById(id) === null) {
                    res.status(404).json({ error: "event not found" });
                } else {
                    await EventsServices.deleteEvent(id);
                    res.status(200).json({});
                }
            } catch (error) {
                res.status(500).json({ error: "server internal error" });
            }
        }
    }


}
module.exports = eventsController