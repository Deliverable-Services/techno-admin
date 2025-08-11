// UsersCreateEdit.tsx
import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Dropdown,
} from "react-bootstrap";
import "./UsersCreateEdit.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiPencil } from "react-icons/bi";

const UsersCreateEdit: React.FC = () => {
    const [tags, setTags] = useState<string[]>(["customer"]);
    const [newTag, setNewTag] = useState("");

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTag.trim()) {
            e.preventDefault();
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    return (
        <Container fluid className="p-4 user-page">
            {/* Top Summary */}
            <Row className="mb-3">
                {[
                    { label: "Amount spent", value: "₹0.00" },
                    { label: "Orders", value: "0" },
                    { label: "Customer since", value: "4 days" },
                    { label: "RFM group", value: "Prospects" },
                ].map((item, i) => (
                    <Col key={i} md={3}>
                        <Card className="summary-card">
                            <Card.Body>
                                <div className="summary-label">{item.label}</div>
                                <div className="summary-value">{item.value}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row>
                {/* Left Section */}
                <Col md={8}>
                    {/* Last Order Section */}
                    <Card className="mb-3">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <div className="fw-bold">Last order placed</div>
                                <div className="text-muted small">
                                    This customer hasn’t placed any orders yet
                                </div>
                            </div>
                            <Button variant="primary">Create order</Button>
                        </Card.Body>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <Card.Header className="pb-2">Timeline</Card.Header>
                        <Card.Body>
                            <Form.Control placeholder="Leave a comment..." className="mb-3" />
                            <div className="timeline-item">
                                <div className="timeline-date">August 4</div>
                                <div className="timeline-text">You created this customer.</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Sidebar */}
                <Col md={4}>
                    {/* Customer Info */}
                    <Card className="mb-3">
                        <Card.Header className="d-flex justify-content-between align-items-center pb-3">
                            Customer
                            <Dropdown>
                                <Dropdown.Toggle
                                    as="span"
                                    className="three-dot-menu"
                                    id="dropdown-custom-components"
                                >
                                    <BsThreeDotsVertical size={20} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="wrapper-model">
                                    <Dropdown.Item className="wrapper-model-item">Edit contact information</Dropdown.Item>
                                    <Dropdown.Item className="wrapper-model-item">Manage addresses</Dropdown.Item>
                                    <Dropdown.Item className="wrapper-model-item">Edit marketing settings</Dropdown.Item>
                                    <Dropdown.Item className="wrapper-model-item">Edit tax details</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Card.Header>
                        <Card.Body>
                            <div className="fw-bold wrapper-contact">Contact information</div>
                            <div className="text-primary wrapper-contact">dishat@asd.com</div>
                            <div className="text-muted wrapper-contact">+91 70180 64278</div>
                            <div className="small text-muted mb-3 wrapper-contact">
                                Will receive notifications in English
                            </div>

                            <div className="fw-bold wrapper-contact">Default address</div>
                            <div className="text-muted small pb-2 wrapper-contact">
                                Dishant Customer<br />Abc 24<br />
                                263637 Someshwar Uttarakhand<br />India<br />+9112321334544
                            </div>

                            <hr className="pb-2" />
                            <div className="fw-bold wrapper-contact">Marketing</div>
                            <div className="wrapper-contact">Email: <span>Not subscribed</span></div>
                            <div className="pb-2 wrapper-contact">SMS: <span>Subscribed</span></div>

                            <hr className="pb-2" />
                            <div className="wrapper-contact">Tax details</div>
                            <div className="text-muted small wrapper-contact">Don't collect tax</div>
                        </Card.Body>
                    </Card>

                    {/* Tags */}
                    <Card className="mb-3">
                        <Card.Header className="d-flex justify-content-between align-items-center pb-3">
                            Tags
                            <BiPencil size={16} />
                        </Card.Header>
                        <Card.Body>
                            <Form.Control
                                type="text"
                                placeholder="Add a tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={addTag}
                                className="mb-2"
                            />
                            <div className="tags-container">
                                {tags.map((tag, i) => (
                                    <span key={i} className="tag-pill">
                                        {tag} <span onClick={() => removeTag(tag)}>×</span>
                                    </span>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Notes */}
                    <Card >
                        <Card.Header className="pb-2">Notes</Card.Header>
                        <Card.Body className="text-muted small">My note</Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UsersCreateEdit;
