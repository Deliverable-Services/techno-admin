import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import SeoForm from "./SeoForm";
import BackButton from "../../shared-components/BackButton";
import PageHeading from "../../shared-components/PageHeading";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory, useParams } from "react-router-dom";
import {
  BiCopy,
  BiGridVertical,
  BiMove,
  BiSave,
  BiTrash,
} from "react-icons/bi";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import moment from "moment";

const sectionsKey = "sections";
const pagesKey = "pages";

const formattedDate = (date) => {
  return (
    <>
      {date ? (
        <>
          <span>{date ? moment(date).format("DD MMMM YY") : "NA"}</span>
          &nbsp;<span>({date ? moment(date).format("hh:mm a") : "NA"})</span>
        </>
      ) : (
        <span>NA</span>
      )}
    </>
  );
};

const SectionItem = ({ section }) => {
  const [, drag] = useDrag(() => ({
    type: "SECTION",
    item: section,
  }));

  // console.log("section", section);

  return (
    <>
      <div ref={drag} className="mb-2" key={section?.id}>
        <div className="d-flex align-items-center">
          <img
            src={section?.featured_image_url || "https://picsum.photos/300/200"}
            alt="image"
            className="rounded-lg"
          />
          <div className="text-black-50">
            <BiGridVertical size={16} />
          </div>
        </div>

        <div className="bg-gray-100 cursor-pointer font-weight-bold hover:bg-gray-200 pt-2 text-black-50">
          {section?.name}
        </div>
        <div className="text-muted small" style={{ marginTop: "-0.2rem" }}>
          {section?.category_name || "Uncategorized"}
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
      {sections?.length ? (
        sections.map((section, idx) => (
          <div key={section?.id} className="border rounded-lg">
            <div className="d-flex justify-content-between align-items-center rounded-top p-2 bg-select">
              <section className="font-bold">{section?.name}</section>
              <div className="d-flex gap-4">
                {/* <button className="bg-white border p-1 rounded-lg">
                  <BiMove size={18} />
                </button> */}
                <button
                  className="bg-white border p-1 rounded-lg"
                  onClick={() => onCopy(section?.id)}
                >
                  <BiCopy size={18} />
                </button>
                <button
                  className="bg-white border p-1 rounded-lg"
                  onClick={() => onDelete(section?.id)}
                >
                  <BiTrash size={18} />
                </button>
              </div>
            </div>
            <div className="d-flex gap-10 p-2 rounded-bottom  bg-white">
              <div>
                {section?.json?.variables?.featuredImage && (
                  <img
                    src={
                      section?.json?.variables?.featuredImage ||
                      "https://picsum.photos/300/200"
                    }
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
                <h5 className="font-bold">{section?.name}</h5>
                <p className="my-0">{section?.json?.variables?.title}</p>
                <p className="my-0">{section?.json?.variables?.description}</p>
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
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("MAIN");
  const [pageData, setPageData] = useState([]);

  const {
    data: sectionsData,
    // isLoading,
    // isFetching,
    // error,
  } = useQuery<any>([sectionsKey, ,], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const {
    data: currentPageData,
    // isLoading,
    // isFetching,
    // error,
  } = useQuery<any>([`${pagesKey}/${id}`, ,], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });
  console.log("PageData", pageData);
  console.log("sectionsData", sectionsData);

  useEffect(() => {
    if (currentPageData) {
      currentPageData.data.sections = [];
      setPageData(currentPageData?.data);
    }
  }, [currentPageData]);

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
    const sectionToCopy = pageData.sections.find(
      (section) => section.id === id
    );
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
              Last Edited On: {formattedDate(pageData?.last_edited_on)}
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
                  {sectionsData?.data?.map((section, index) => (
                    <div key={section.id}>
                      <SectionItem section={section} />
                      {index < sectionsData?.data?.length - 1 && (
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
          <SeoForm seoDetails={pageData.seo_details} />
        )}
      </div>
    </DndProvider>
  );
};

export default ViewWebsite;
