import { Plant } from "@/app/interfaces/plant"
import { Button } from "react-bootstrap"
import { deletePlant, updatePlant } from "./LibraryItemServersideActions"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface EditableLibraryItemProps {
    plant: Plant
    edit: boolean
}

export default function EditableLibraryItem({plant, edit}: EditableLibraryItemProps) {

    // state to keep track of whether we've pressed the delete button for checking certainty
    const [tryDelete, setTryDelete] = useState(false);
    const router = useRouter();

    function handleDelete() {
        // perform delete
        if (!tryDelete)
        {
            // first time this button is pressed, we set the tryDelete state to true.
            setTryDelete(true)
            return
        }
        // if we get here then we're sure!
        deletePlant(plant.name).then(() => {
            router.refresh(); // refresh after delete completes
        });
        // refresh the page to get the new list
    }
    

    return (
        <div>
          <img src={`/api/plant-image?plantName=${plant.name}`} alt={`Plant: ${plant.name}`} />
          <p className="plantDescriptionText">{plant.description}</p>
          <p>Threshold: {plant.moisture_threshold}</p>
          {edit ? 
            <div>
            <Button variant="success" >Save</Button>
            <Button variant="danger" onClick={handleDelete}>{tryDelete ? 'Yes, Delete!' : 'Delete?'} </Button> 
            </div>
           : null}
        </div>
    )
}