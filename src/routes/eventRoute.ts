import express from "express";
import type { Event } from "../models/event";
import * as service from "../services/eventService";
const router = express.Router();

router.get("/", async (req, res) => {
  if (req.query.pageSize && req.query.pageNo) {
    const pageSize = parseInt(req.query.pageSize as string) || 3;
    const pageNo = parseInt(req.query.pageNo as string) || 1;
    const keyword = req.query.keyword as string;
    try {
      const result = await service.getAllEventsWithPagination(
        keyword,
        pageSize,
        pageNo
      );
      if (result.events.length === 0) {
        res.status(404).send("No event found");
        return;
      }
      res.setHeader("x-total-count", result.count.toString());
      res.setHeader("Access-Control-Expose-Headers", "x-total-count");
      res.json(result.events);
    } catch (error) {
      if (pageNo < 1 || pageSize < 1) {
        res.status(400).send("Invalid pageNo or pageSize");
      } else {
        res.status(500).send("Internal Server Error");
      }
      return;
    } finally {
        console.log(`Request is completed. with pageNo=${pageNo} and pageSize=${pageSize}`);
    }
        
        
  } else if (req.query.category) {
    const category = req.query.category;
    const filteredEvents = await service.getEventByCategory(category as string);
    res.json(filteredEvents);
  } else {
    res.json(await service.getAllEvents());
  }
});

// Lab 6 Task 10-1
// router.get("/events", (req, res) => {
//   const category = req.query.category;
//   const filteredEvents = events.filter((event) => event.category === category);
//   res.json(filteredEvents);
// });

// router.get("/events", async (req, res) => {
//   try {
//     const category = req.query.category as string;
//     const events = await service.getAllEvents(); // ดึงข้อมูล events จาก service
//     const filteredEvents = events.filter((event) => event.category === category);
//     res.json(filteredEvents);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// router.get("/events", async (req, res) => {
//   try {
//     // ดึงข้อมูล events จาก service หรือแหล่งข้อมูล
//     const events = await service.getAllEvents();
//     if (req.query.category) {
//       const category = req.query.category as string;
//       const filteredEvents = events.filter((event) => event.category === category);
//       res.json(filteredEvents);
//     } else {
//       res.json(events);
//     }
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// เพิ่ม path สำหรับการดึงข้อมูลผู้เข้าร่วมงาน
router.get("/participants", async (req, res) => {
  if ((req.query.pageSize && req.query.pageNo) || req.query.eventTitle) {
    const eventTitle = req.query.eventTitle as string;
    const pageSize = parseInt(req.query.pageSize as string);
    const pageNo = parseInt(req.query.pageNo as string);
    const result = res.json(await service.getParticipantsByEventTitlePagination(eventTitle,pageSize, pageNo));
    console.log("Query Result:", result); // เพิ่มบรรทัดนี้
  } else {
    const result =await service.getAllParticipants();
    console.log("Query Result:", result); // เพิ่มบรรทัดนี้
    res.json(result);
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const event = await service.getEventById(id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).send("Event not found");
  }
});

router.post("/", async (req, res) => {
  const newEvent: Event = req.body;
  const result = await service.addEvent(newEvent);
  res.json(result);
});

export default router;
