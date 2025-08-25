'use client'

import { useState } from "react"
import SearchInput from "./SearchInput";
import LibraryList from "./LibraryList";

import './plantLibrary.css'

import { Plant, PlantsList } from "@/app/interfaces/plant";

interface PlantLibraryProps {
  plantsData: PlantsList
}

export default function PlantLibrary({plantsData}: PlantLibraryProps) {
    const [searchTerm, setSearchTerm] = useState(''); // we'll have a search term which we'll use to downselect the plants library 
    
    return (
        <div>
            <SearchInput searchCallback={setSearchTerm}/>
            <LibraryList plantsData={plantsData} searchTerm={searchTerm} />
        </div>
    )
}