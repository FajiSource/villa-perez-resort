import { Room } from "../types/booking";
import roomImage from "../assets/room.jpg";
import videokeImage from "../assets/videoke.jpg";
import parkingImage from "../assets/parking.jpg";

export const rooms: Room[] = [
  {
    id: "room-1",
    name: "Rooms",
    type: "room",
    description:
      "Rooms villa perez offer 2 room both room has 2 bedroom and comfort room and toilet and shower.",
    price: 2600,
    image: roomImage,
    maxGuests: 4,
    amenities: ["2 Bedrooms", "Comfort Room", "Toilet", "Shower", "WiFi"],
  },
  {
    id: "cottage-1",
    name: "Cottage",
    type: "cottage",
    description:
      "Villa Perez have 6 cottage available to rent and videoke",
    price: 500,
    image: videokeImage,
    maxGuests: 8,
    amenities: ["Videoke", "Outdoor Space", "Tables & Chairs"],
  },
  {
    id: "party-space-1",
    name: "Party Space",
    type: "party-space",
    description:
      "Whatever you're celebrating, we've got the perfect space for it. Birthdays, reunions, or just because—every occasion fits here!",
    price: 3000,
    image: parkingImage,
    maxGuests: 50,
    amenities: ["Large Space", "Parking", "Tables & Chairs", "Sound System"],
  },
];

export const getRoomById = (id: string): Room | undefined => {
  return rooms.find((room) => room.id === id);
};

