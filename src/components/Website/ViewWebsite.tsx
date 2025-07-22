import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { prebuiltSections } from "./data/sections";
import { dummyRecord } from "./data/dummyRecord";
import SeoForm from "./SeoForm";
import BackButton from "../../shared-components/BackButton";
import PageHeading from "../../shared-components/PageHeading";
import API from "../../utils/API";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory } from "react-router-dom";
import { BiCopy, BiGridVertical, BiMove, BiSave, BiTrash } from "react-icons/bi";

const key = "sections";

const SectionItem = ({ section }) => {
  const [, drag] = useDrag(() => ({
    type: "SECTION",
    item: section,
  }));

  return (
    <>
      <div ref={drag} className="mb-2" key={section.id}>
        <div className="d-flex align-items-center">
          <img
            src={
              section.json.variables.featuredImage ||
              "https://via.placeholder.com/80"
            }
            alt="image"
            className="rounded-lg"
          />
          <div className="text-black-50">
            <BiGridVertical size={16} />
          </div>
        </div>

        <div className="bg-gray-100 cursor-pointer font-weight-bold hover:bg-gray-200 pt-2 text-black-50">
          {section.name}
        </div>
        <div className="text-muted small" style={{ marginTop: "-0.2rem" }}>
          {section.category || "Uncategorized"}
        </div>
      </div>
    </>
  );
};

const DropCanvas = ({ sections, onDrop, onDelete, onCopy }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "SECTION",
      drop: (item) => onDrop(item),
      collect: (monitor) => ({
        isOver: monitor.isOver(), // Check if an item is currently over this dropzone
      }),
    }),
    [onDrop]
  );

  return (
    <div
      className="space-y-4"
      style={{
        gap: "10px",
        display: "flex",
        flexDirection: "column",
        minHeight: "50vh",
        borderRadius: "8px",
        backgroundColor: isOver ? "#e0ffe0" : "#fff", // Change color if isOver is true
      }}
      ref={drop}
    >
      {sections.length ? (
        sections.map((section, idx) => (
          <div key={section.id} className="border rounded-lg">
            <div className="d-flex justify-content-between align-items-center rounded-top p-2 bg-select">
              <section className="font-bold">{section.name}</section>
              <div className="d-flex gap-4">
                {/* <button className="bg-white border p-1 rounded-lg">
                  <BiMove size={18} />
                </button> */}
                <button
                  className="bg-white border p-1 rounded-lg"
                  onClick={() => onCopy(section.id)}
                >
                  <BiCopy size={18} />
                </button>
                <button
                  className="bg-white border p-1 rounded-lg"
                  onClick={() => onDelete(section.id)}
                >
                  <BiTrash size={18} />
                </button>
              </div>
            </div>
            <div className="d-flex gap-10 p-2 rounded-bottom  bg-white">
              <div>
                {section.json.variables?.featuredImage && (
                  <img
                    src={section.json.variables.featuredImage}
                    alt="Preview"
                    className="w-32"
                    style={{
                      maxHeight: "100px",
                      maxWidth: "150px",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>
              <div>
                <h5 className="font-bold">{section.name}</h5>
                <p className="my-0">{section.json.variables?.title}</p>
                <p className="my-0">{section.json.variables?.description}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>
          <div
            className="align-items-center d-flex justify-content-center text-muted"
            style={{ minHeight: "50vh" }}
          >
            Add sections to start building
          </div>
        </div>
      )}
    </div>
  );
};

const ViewWebsite = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("MAIN");
  const [pageData, setPageData] = useState(dummyRecord);

  useEffect(() => {
    const getSelection = async () => {
      try {
        const res = await API.post(
          `${key}`,
          {
            name: "Some section name testt",
            type: "pricing_basic",
            featuredImage: "https:////",
            section_category_id: 1,
            html_content: "<sadasd />",
            configuration: {
              editable_fields: ["title", "price", "features"],
            },
            default_data: {
              title: "some section title",
              price: "$price",
            },
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = res;
        if (data) console.log({ data });
      } catch (error) {
        handleApiError(error, history);
      }
    };
    getSelection();
  }, []);

  const addSection = (section) => {
    setPageData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { ...section, id: `${section.name}-${Date.now()}` },
      ],
    }));
  };

  const _onDeleteClick = (id) => {
    setPageData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== id),
    }));
  };

  const _onCopyClick = (id) => {
    const sectionToCopy = pageData.sections.find((section) => section.id === id);
    if (sectionToCopy) {
      setPageData((prev) => ({
        ...prev,
        sections: [
          ...prev.sections,
          { ...sectionToCopy, id: `${sectionToCopy.name}-${Date.now()}` },
        ],
      }));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="card view-padding p-2 d-flex mt-3">
        <BackButton title={pageData.name} />

        <div
          className="text-primary"
          style={{ marginTop: "-25px", background: "#fff" }}
        >
          <div className="d-flex justify-content-between">
            <small className="text-mutes">
              Last Edited On: &nbsp;{pageData.lastEditedOn}
            </small>
          </div>
        </div>

        <div className="d-flex justify-content-between gap-4 border-b mt-2">
          <div className="d-flex gap-3">
            {["MAIN", "SEO"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 cursor-pointer border rounded-lg ${
                  activeTab === tab ? "border-b-2 border-black bg-select" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          {activeTab === "MAIN" && (
            <Button variant="primary" size="sm">
              <div className="text-white d-flex align-items-center">
                <BiSave size={18} /> <p className="mb-0">Save</p>
              </div>
            </Button>
          )}
        </div>

        <Row className="rounded">
          <Col className="mx-auto"></Col>
        </Row>
      </div>

      <div className="">
        {activeTab === "MAIN" ? (
          <Row>
            <Col sm={3} className="">
              <Container
                fluid
                className="card component-wrapper view-padding mb-3 mt-3"
              >
                <PageHeading title="Sections" />
                <hr className="mb-3" />

                <Container fluid className="h-100 p-0">
                  {prebuiltSections.map((section, index) => (
                    <div key={section.id}>
                      <SectionItem section={section} />
                      {index < prebuiltSections.length - 1 && (
                        <hr className="mb-3" />
                      )}
                    </div>
                  ))}
                </Container>
              </Container>
            </Col>

            <Col sm={9} className="">
              <Container
                fluid
                className="card component-wrapper view-padding mb-3 mt-3"
              >
                <PageHeading title="Create your page using pre-built sections" />
              </Container>
              <div
                className=" view-padding mb-3 mt-3"
                style={{
                  border: "2px dashed rgb(204, 204, 204)",
                  borderRadius: "12px",
                }}
              >
                <DropCanvas
                  sections={pageData.sections}
                  onDrop={addSection}
                  onDelete={_onDeleteClick}
                  onCopy={_onCopyClick}
                />
              </div>
            </Col>
          </Row>
        ) : (
          <SeoForm seoDetails={pageData.seoDetails} />
        )}
      </div>
    </DndProvider>
  );
};

export default ViewWebsite;
