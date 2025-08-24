import axios from "axios";

import PlantLibrary from "../components/plantLibrary/PlantLibrary";
import { PlantsList } from "../interfaces/plant";

async function getPlants(): Promise<PlantsList> {
  const response = await axios.get<PlantsList>(`${process.env.API_ENDPOINT}/plant/get/all`);
  return response.data;
}

export default async function Library() {
  const plantsData = await getPlants();

  return (
    <>
      <div className="pageHeading">Plant Library</div>
      <PlantLibrary plantsData={plantsData} />
    </>
  );
}
