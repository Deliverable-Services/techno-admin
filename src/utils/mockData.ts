import image from '../assets/logo.jpg'

interface IMockData {
    id: string;
    imageScr: string;
    created_by: string;
    name: string;
}

export const mockData: Array<IMockData> = [{
    "id": "1",
    "imageScr": image,
    "created_by": "Hillier",
    "name": "Prius"
}, {
    "id": "2",
    "imageScr": image,
    "created_by": "Pascale",
    "name": "Outlook"
}, {
    "id": "3",
    "imageScr": image,
    "created_by": "Etienne",
    "name": "RDX"
}, {
    "id": "4",
    "imageScr": image,
    "created_by": "Jeddy",
    "name": "MPV"
}, {
    "id": "5",
    "imageScr": image,
    "created_by": "Avigdor",
    "name": "Mark LT"
}, {
    "id": "6",
    "imageScr": image,
    "created_by": "Grover",
    "name": "Cayenne"
}]