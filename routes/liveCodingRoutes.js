import express from 'express';
const router = express.Router();
import {createLiveCodingEvent, getLiveCodingEvents,getLiveCodingEvent,getLiveCodingEventsByOwner, updateLiveCodingEvent,deleteLiveCodingEvent} from "../controllers/liveCodingController.js"

import protect from '../middleware/authMiddleware.js';

router.post('/create-live-coding-event',protect, createLiveCodingEvent);
router.get('/live-coding-events', getLiveCodingEvents);
router.get('/live-coding-event/:id', getLiveCodingEvent);
router.get('/live-coding-events-by-owner/:id', getLiveCodingEventsByOwner); 
router.put('/update-live-coding-event/:id',protect, updateLiveCodingEvent);
router.delete('/delete-live-coding-event/:id', protect,deleteLiveCodingEvent);
export default router;