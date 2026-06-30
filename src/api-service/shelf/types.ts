import type Shelf from "@/models/shelf";
import { BASE_URL } from "@/api-service/api";



export default interface ShelfResponse {
    id: number;
    shelf_code: string;
    office_location: string;
    capacity: number;
    image_url: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateShelfPayload = {
    shelf_code: string;
    office_location: string;
    capacity: number;
    image?: File | null;
};


export function shelfResponseToShelf(shelfResponse: ShelfResponse): Shelf {
    return {
        id: shelfResponse.id,
        shelf_code: shelfResponse.shelf_code,
        office_location: shelfResponse.office_location,
        capacity: shelfResponse.capacity,
        image_url:  shelfResponse.image_url ? shelfResponse.image_url.startsWith('/uploads/') ? BASE_URL + shelfResponse.image_url : shelfResponse.image_url : "https://img.magnific.com/premium-vector/file-folder-mascot-character-design-vector_166742-4413.jpg?semt=ais_hybrid&w=740&q=80",
        createdAt: shelfResponse.createdAt,
        updatedAt: shelfResponse.updatedAt
    };
}