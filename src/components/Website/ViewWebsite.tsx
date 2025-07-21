import React, { useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Form, Formik } from "formik";

import { prebuiltSections } from "./data/sections";
import { dummyRecord } from "./data/dummyRecord";
import Sidebar from "./Sidebar";
import PageCanvas from "./PageCanvas";
import SeoForm from "./SeoForm";
import BackButton from "../../shared-components/BackButton";
import { InputField } from "../../shared-components/InputFeild";
import Restricted from "../../shared-components/Restricted";
import PageHeading from "../../shared-components/PageHeading";

const ViewWebsite = () => {
  const [activeTab, setActiveTab] = useState("MAIN");
  const [pageData, setPageData] = useState(dummyRecord);

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
    <>
      {/* <Container fluid className="card component-wrapper view-padding">
        <PageHeading title={pageData.name} /> */}
      <div className="card view-padding p-2 d-flex mt-3">
        <BackButton title={pageData.name} />

        <div className="text-primary">
          <div className="d-flex justify-content-between">
            <div
              className="text-black pb-3"
              style={{ cursor: "pointer", fontWeight: 400 }}
            >
              Last Edited On: &nbsp;{pageData.lastEditedOn}
            </div>
          </div>
        </div>

        {/* <hr className="mb-3" /> */}

        <Row className="rounded">
          <Col className="mx-auto">
            {/* <Formik
              enableReinitialize
              initialValues={apiData || {}}
              onSubmit={(values) => {
                const { logo, ...rest } = values;
                const formdata = new FormData();
                for (let k in rest) formdata.append(k, rest[k]);

                if (logo && typeof logo !== "string")
                  formdata.append("logo", logo);

                mutate({ formdata, id });
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="form-container ">
                    <InputField
                      name="name"
                      placeholder="Name"
                      label="Name"
                      required
                    />
                  </div>

                  <Row className="d-flex justify-content-start">
                    <Col md="2">
                      <Restricted to={id ? "update_role" : "create_role"}>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-100"
                        >
                          {isLoading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </Restricted>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik> */}
          </Col>
        </Row>
      </div>

      <div className="">

          <Row>
            <Col sm={3} className="">
              <Container
                fluid
                className="card component-wrapper view-padding mb-3 mt-3"
              >
                <PageHeading title="Sections" />
                 <hr className="mb-3" />

                <Container fluid className="h-100 p-0">
                  <Sidebar sections={prebuiltSections} onAdd={addSection} />
                </Container>
              </Container>{" "}
            </Col>

            <Col sm={9} className="">
              <Container  fluid
                className="card component-wrapper view-padding mb-3 mt-3">
                <div className="flex-1 p-4">
                  <div className="flex gap-4 border-b mb-4">
                    {["MAIN", "SEO"].map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 ${
                          activeTab === tab ? "border-b-2 border-black" : ""
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === "MAIN" ? (
                    <PageCanvas sections={pageData.sections} />
                  ) : (
                    <SeoForm seoDetails={pageData.seoDetails} />
                  )}
                </div>
              </Container>
            </Col>
          </Row>

        <Container
          fluid
          className="card component-wrapper view-padding mb-3 mt-3"
        >
          <PageHeading title="Sections" />

          <Container fluid className="h-100 p-0">
            <Sidebar sections={prebuiltSections} onAdd={addSection} />
          </Container>
        </Container>

        <Container
          fluid
          className="card component-wrapper view-padding mb-3 mt-3"
        >
          <PageHeading title="Sections" />

          <Container fluid className="h-100 p-0">
            <Sidebar sections={prebuiltSections} onAdd={addSection} />
          </Container>
        </Container>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar sections={prebuiltSections} onAdd={addSection} />

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex gap-4 border-b mb-4">
            {["MAIN", "SEO"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 ${
                  activeTab === tab ? "border-b-2 border-black" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "MAIN" ? (
            <PageCanvas sections={pageData.sections} />
          ) : (
            <SeoForm seoDetails={pageData.seoDetails} />
          )}
        </div>
      </div>
      {/* </Container> */}
    </>
  );
};

export default ViewWebsite;
