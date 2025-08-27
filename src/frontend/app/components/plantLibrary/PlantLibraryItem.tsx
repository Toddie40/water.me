import { useState } from "react"
import { Accordion, Button} from "react-bootstrap"
import { Plant } from "@/app/interfaces/plant"
import EditableLibraryItem from "./EditableLibraryItem"

interface PlantLibraryEntryProps {
  plant: Plant
  index: number
}

export default function PlantLibraryItem({ plant, index }: PlantLibraryEntryProps) {
  const [editMode, setEditMode] = useState(false)
  const [expanded, setExpanded] = useState(false)

  function toggleEditMode() {
    setEditMode(!editMode)
  }

  function toggleExpanded() {
    setExpanded(!expanded)
  }

  return (
    <Accordion.Item eventKey={String(index)}>
      <Accordion.Header onClick={(e) => { e.preventDefault(); toggleExpanded() }}>
        {plant.name}
      </Accordion.Header>
      <Accordion.Body>
        {expanded ? 
        <>
        <EditableLibraryItem plant={plant} edit={editMode}/> 
          <Button
            variant={!editMode ? "warning" : "secondary"}
            onClick={toggleEditMode}
          >
            {!editMode ? "Edit" : "Cancel"}
          </Button>
          </>
          : null}
      </Accordion.Body>
    </Accordion.Item>
  )
}
