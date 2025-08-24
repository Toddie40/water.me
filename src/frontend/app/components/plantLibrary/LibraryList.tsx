import { Plant, PlantsList } from '@/app/interfaces/plant'
import { Button } from 'react-bootstrap';

import Accordion from 'react-bootstrap/Accordion';

interface LibraryListProps {
    plantsData: PlantsList
    searchTerm: string
}

export default function LibraryList({plantsData, searchTerm}: LibraryListProps) {
    // manipulate the plantsData object using the search term


    // then generate the component with the manipulated data    
    return (
        <div className='Librarylist'>
            <Accordion>
                {plantsData.plants.map((plant: Plant, index: number) => (
                    <Accordion.Item key={index} eventKey={String(index)}>
                        <Accordion.Header>{plant.name}</Accordion.Header>
                        <Accordion.Body>
                            <p>Desc: {plant.description}</p>
                            <p>Threshold: {plant.moisture_threshold}</p>
                            <Button variant='danger'>Delete</Button>
                            <Button>Edit</Button>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    )
}