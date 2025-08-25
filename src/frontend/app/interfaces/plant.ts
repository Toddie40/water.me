export interface Plant {
    name: string
    description: string
    moisture_threshold: number
    image?: File
}

export interface PlantsList {
    plants: Plant[]
}
