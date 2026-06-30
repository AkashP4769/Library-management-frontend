export default interface Shelf {
  id: number;
  shelf_code: string;
  office_location: string;
  capacity: number;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}

export const shelves: Shelf[] = [
  {
    id: 1,
    shelf_code: "A1",
    office_location: "Netherland",
    capacity: 100,
    image_url:
      "https://plus.unsplash.com/premium_photo-1703701579660-8481915a7991?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym9vayUyMHNoZWx2ZXMlMjBjYWZlfGVufDB8fDB8fHww",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    shelf_code: "B1",
    office_location: "Netherland",
    capacity: 150,
    image_url:
      "https://images.unsplash.com/photo-1578511161102-485cc0775c6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vayUyMHNoZWx2ZXMlMjBjYWZlfGVufDB8fDB8fHww",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    shelf_code: "C1",
    office_location: "Germany",
    capacity: 200,
    image_url:
      "https://images.unsplash.com/photo-1581091870620-3c7f1e5b8d6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9vayUyMHNoZWx2ZXMlMjBjYWZlfGVufDB8fDB8fHww",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    shelf_code: "D1",
    office_location: "Germany",
    capacity: 250,
    image_url:
      "https://images.unsplash.com/photo-1563538516587-42ae17314ca0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9vayUyMHNoZWx2ZXMlMjBjYWZlfGVufDB8fDB8fHww",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    shelf_code: "E1",
    office_location: "France",
    capacity: 300,
    image_url:
      "https://plus.unsplash.com/premium_photo-1703701578859-e250e7ebb3f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJvb2slMjBzaGVsdmVzJTIwY2FmZXxlbnwwfHwwfHx8MA%3D%3D",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];
