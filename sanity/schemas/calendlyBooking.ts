import { defineField, defineType } from "sanity";

/**
 * Bookings created via Calendly webhook (invitee.created).
 * Written only by the backend API; editors can view and add notes.
 */
export const calendlyBooking = defineType({
  name: "calendlyBooking",
  title: "Calendly Booking",
  type: "document",
  fields: [
    defineField({
      name: "inviteeName",
      title: "Invitee Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "inviteeEmail",
      title: "Invitee Email",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "eventName",
      title: "Event / Meeting Type",
      type: "string",
      description: "Name of the Calendly event type",
      readOnly: true,
    }),
    defineField({
      name: "startTime",
      title: "Start Time",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "endTime",
      title: "End Time",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Canceled", value: "canceled" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "calendlyInviteeUri",
      title: "Calendly Invitee URI",
      type: "string",
      description: "Used to match cancel events to this booking",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "calendlyEventUri",
      title: "Calendly Event URI",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "notes",
      title: "Internal Notes",
      type: "text",
      description: "Notes for your team (not sent to the invitee)",
    }),
  ],
  preview: {
    select: {
      inviteeName: "inviteeName",
      inviteeEmail: "inviteeEmail",
      eventName: "eventName",
      startTime: "startTime",
      status: "status",
    },
    prepare({ inviteeName, inviteeEmail, eventName, startTime, status }) {
      const date = startTime
        ? new Date(startTime).toLocaleString(undefined, {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "No date";
      const name = inviteeName || inviteeEmail || "Unnamed";
      const statusLabel = status === "canceled" ? "Canceled" : status === "active" ? "Active" : status || "—";
      return {
        title: `${name} (${statusLabel})`,
        subtitle: `${eventName || "Meeting"} — ${date}`,
      };
    },
  },
  orderings: [
    {
      title: "Start time (newest first)",
      name: "startTimeDesc",
      by: [{ field: "startTime", direction: "desc" }],
    },
    {
      title: "Start time (oldest first)",
      name: "startTimeAsc",
      by: [{ field: "startTime", direction: "asc" }],
    },
  ],
});
