// serverside functions to call from the cllient-side EditableLibraryItem component
'use server'
import axios from "axios";

export async function deletePlant(plantName: string) {
    var res = await axios.delete(`${process.env.API_ENDPOINT}/plant/delete`, {params: {plant_name: plantName}});
    return res.status
}

export async function updatePlant() {
// save button pressed so need to update the plant with the specified changes.
}