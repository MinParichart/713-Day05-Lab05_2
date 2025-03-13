import { PrismaClient } from "@prisma/client";
import type { Event, PageEvent } from "../models/event";
import type { PageParticipant } from "../models/participant";

const prisma = new PrismaClient();

export function getEventByCategory(category: string) {
  return prisma.event.findMany({
    where: { category },
  });
}

export function getAllEvents() {
  return prisma.event.findMany();
}

export function getEventById(id: number) {
  return prisma.event.findUnique({
    where: { id },
    omit: {
      organizerId: true,
    },
  });
}

export function getAllEventsWithOrganizer() {
  return prisma.event.findMany({
    omit: {
      organizerId: true
    }, 
    include: {
      organizer: {
        select: {
          name: true,
        },
      },
      participants: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export function getEventByIdWithOrganizer(id: number) {
  return prisma.event.findUnique({
    where: { id },
  });
}
export function addEvent(newEvent: Event) {
  return prisma.event.create({
    data: {
      category: newEvent.category || "",
      title: newEvent.title || "",
      description: newEvent.description || "",
      location: newEvent.location || "",
      date: newEvent.date || "",
      time: newEvent.time || "",
      petsAllowed: newEvent.petsAllowed || false,
    },
    omit: {
      organizerId: true,
    },
  });
}

export async function getAllEventsWithOrganizerPagination(
  keyword : string,
  pageSize: number,
  pageNo: number
) {
  const where = { 
    OR: [
      { title: { contains: keyword } },
      { description: { contains: keyword } },
      { category: { contains: keyword } }, 
      { organizer : { name : {contains : keyword }}}
    ]
  }
  const events = await prisma.event.findMany({
    where, 
    skip: pageSize * (pageNo - 1),
    take: pageSize,
    select: {
      id: true,
      title : true, 
      category: true,
      // description: true, // ถ้าอยากให้มันแสดง description เพิ่มมา ใน .json ก็ใส่ description เข้าไป
      organizerId: false,
      organizer: {
        select: {
          name: true,
        },
      },
    },
  });
  const count = await prisma.event.count({ where }); 
  return { count, events } as PageEvent; 
}

export function getAllParticipants() {
  return prisma.participant.findMany();
}

export async function getAllParticipantsWithEventPagination(
  keyword : string,
  pageSize: number,
  pageNo: number
) {
  const where = { 
    OR: [
      { name: { contains: keyword } },
      { email: { contains: keyword } },
      // { event : { title : {contains : keyword }}}
    ]
  }
  const participants = await prisma.participant.findMany({
    where, 
    skip: pageSize * (pageNo - 1),
    take: pageSize,
    select: {
      id: true,
      name : true, 
      email: true,
      events: {
        select: {
          title: true,
        },
      },
    },
  });
  const count = await prisma.participant.count({ where }); 
  return { count, participants } as PageParticipant; 
}


export function getParticipantById(id: number) {
  return prisma.participant.findUnique({
    where: { id },
    select: {
      id: true,
      name : true, 
      email: true,
      events: {
        select: {
          title: true,
        },
      },
    },
  });
}

    
export function countEvent() {
  return prisma.event.count();
}
  

  