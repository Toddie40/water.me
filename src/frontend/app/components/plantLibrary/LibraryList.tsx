// React imports
import { useRouter } from 'next/navigation';
import Accordion from 'react-bootstrap/Accordion';

// Interfaces
import { Plant, PlantsList } from '@/app/interfaces/plant'

// Custom Components
import PlantLibraryItem from './PlantLibraryItem';

interface LibraryListProps {
    plantsData: PlantsList
    searchTerm: string
}

export default function LibraryList({plantsData, searchTerm}: LibraryListProps) {
    // manipulate the plantsData object using the search term
    const filteredData = plantsData.plants.filter(item =>
        item['name'].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const router = useRouter();

    function handleAddPlantButton() {
        router.push('/add-plant');  // navigate to /target-page
    };

    // then generate the component with the manipulated data    
    return (
        <div className='Librarylist'>
            <Accordion>
                <Accordion.Item className="plantListItem addNewPlantButton" eventKey='-1' onClick={handleAddPlantButton}>
                        Add new plant
                </Accordion.Item>
                {filteredData.map((plant: Plant, index: number) => (
                    <PlantLibraryItem key={index} plant={plant} index={index}/>
                ))}
            </Accordion>
        </div>
    )
}