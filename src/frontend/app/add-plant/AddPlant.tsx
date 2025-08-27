'use client'

import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Plant } from "../interfaces/plant";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

type AddPlantProps = {callback: Function}

export default function AddPlant({callback}:AddPlantProps) {
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [addPlantFailure, setAddPlantFailure] = useState('')
    const [moistureInputValue, setMoistureInputValue] = useState(1.2);
    
    const router = useRouter();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        setFormSubmitted(true)
        event.preventDefault();
        const form = event.currentTarget;

        const plantData: Plant & { image?: File } = {
            name: (form.elements.namedItem("plantName") as HTMLInputElement).value,
            description: (form.elements.namedItem("description") as HTMLInputElement).value,
            moisture_threshold: parseFloat((form.elements.namedItem("moistureThreshold") as HTMLInputElement).value),
        };

        const imageInput = form.elements.namedItem("image") as HTMLInputElement;
        
        if (imageInput.files && imageInput.files.length > 0) {
            plantData.image = imageInput.files[0];
        }

        callback(plantData)
            .then((status: number) => {
                if (status === 200) {
                    router.push('/library');
                } else {
                    throw new Error("Unexpected status code: " + status);
                }
            })
            .catch((error: Error) => {
                setAddPlantFailure(error.message);
            });
        
    }

    return (
        <Container className="addPlant">
            <Row>
                <Col xs={12} md={12} lg={12}>
                    <Form onSubmit={handleSubmit} onChange={() => {setAddPlantFailure('')}}>
                        <Form.Group className="addPlantFormGroup">
                        <Form.Control name="plantName" type="text" placeholder="Plant Name"/>
                        </Form.Group>
                        <Form.Group className="addPlantFormGroup">
                        <Form.Control name="description" type="textarea" placeholder="Description"/>
                        </Form.Group>
                        <Form.Group className="addPlantFormGroup">
                            <Form.Label>Moisture Threshold: {moistureInputValue}</Form.Label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: 8 }}>Dry</span>
                                <Form.Range
                                name="moistureThreshold"
                                max={3.3}
                                min={0}
                                step={0.01}
                                value={moistureInputValue ?? 0}
                                onChange={(e) => setMoistureInputValue(parseFloat(e.target.value))}
                                style={{ flex: 1 }} // make range input take remaining space
                                />
                                <span style={{ marginLeft: 8 }}>Wet</span>
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="addPlantFormGroup">
                            <Form.Label>Upload Image (Optional)</Form.Label>
                            <Form.Control name="image" type="file" />
                        </Form.Group>
                        <Form.Group className="addPlantFormGroup d-flex justify-content-between">
                        <Button variant="warning" href="/library">Back to Library</Button>
                        <Button type="submit">Add Plant</Button>
                        </Form.Group>
                    </Form>
                    {formSubmitted ? (
                        addPlantFailure ? (
                            <div className="addPlantFailure">Failed to add plant. Error: {addPlantFailure}</div>
                        ) : (
                            null
                        )
                        ) : null}
                </Col>
            </Row>
        </Container>
    )
}