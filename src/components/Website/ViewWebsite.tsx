import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Form, Formik } from "formik";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { prebuiltSections } from "./data/sections";
import { dummyRecord } from "./data/dummyRecord";
import Sidebar from "./Sidebar";
import PageCanvas from "./PageCanvas";
import SeoForm from "./SeoForm";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import Restricted from "../../shared-components/Restricted";
import PageHeading from "../../shared-components/PageHeading";
import API from "../../utils/API";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory } from "react-router-dom";

const key = "sections";

const SectionItem = ({ section }) => {
  const [, drag] = useDrag(() => ({
    type: "SECTION",
    item: section,
  }));

  return (
    <>
      <Container
        fluid
        className="card component-wrapper view-padding mb-3 mt-3"
        ref={drag}
      >
        <img
          src={
            section.json.variables.featuredImage ||
            "https://via.placeholder.com/80"
          }
          alt="image"
          className="rounded-lg"
        />
        <div
          key={section.id}
          className="p-2 mb-2 bg-gray-100 cursor-pointer hover:bg-gray-200"
        >
          {section.name}
        </div>
      </Container>
    </>
  );
};

const DropCanvas = ({ sections, onDrop }) => {
  const [, drop] = useDrop(
    () => ({
      accept: "SECTION",
      drop: (item) => onDrop(item),
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
      }}
      ref={drop}
    >
      {sections.length ? (
        sections.map((section, idx) => (
          <div key={section.id} className="p-4 border rounded bg-white">
            <h4 className="font-bold">{section.name}</h4>
            <p>{section.json.variables?.title}</p>
            <p>{section.json.variables?.description}</p>
            {section.json.variables?.featuredImage && (
              <img
                src={section.json.variables.featuredImage}
                alt="Preview"
                className="w-32 mt-2"
              />
            )}
          </div>
        ))
      ) : (
        <div className="h-full">
          <div className="text-center text-muted">
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
    // getSelection();
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

        <div className="flex gap-4 border-b mb-4 mt-2">
          {["MAIN", "SEO"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-black bg-light rounded-lg"
                  : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
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
                  {prebuiltSections.map((section) => (
                    <SectionItem key={section.name} section={section} />
                  ))}

                  {/* <Sidebar sections={prebuiltSections} onAdd={addSection} /> */}
                </Container>
              </Container>
            </Col>

            <Col sm={9} className="">
              <Container
                fluid
                className="card component-wrapper view-padding mb-3 mt-3"
              >
                <PageHeading title="Create your page using pre-built sections" />
                <hr className="mb-3" />
                <DropCanvas sections={pageData.sections} onDrop={addSection} />
              </Container>
            </Col>
          </Row>
        ) : (
          <Container
            fluid
            className="card component-wrapper view-padding mb-3 mt-3"
          >
            <SeoForm seoDetails={pageData.seoDetails} />
          </Container>
        )}
      </div>
    </DndProvider>
  );
};

export default ViewWebsite;
