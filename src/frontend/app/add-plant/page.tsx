import axios from "axios";
import { Plant } from "../interfaces/plant";
import AddPlant from "./AddPlant";
import './addPlant.css'

async function addPlant(plantData: Plant) {
    'use server'
    //make request to api and add the new plant
    const payload: Plant = {
        name: plantData.name,
        description: plantData.description,
        moisture_threshold: plantData.moisture_threshold,
    }
    if (plantData.image) {
        payload.image = plantData.image
    }

    const {status} = await axios.post(`${process.env.API_ENDPOINT}/plant/add`, payload, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    })

    return status
}

export default async function addPlantPage() {

  return (
    <>
      <div className="pageHeading">Add Plant</div>
      <AddPlant callback={addPlant}/>
    </>
  );
}
