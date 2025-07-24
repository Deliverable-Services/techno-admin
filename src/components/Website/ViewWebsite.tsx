import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import SeoForm from "./SeoForm";
import BackButton from "../../shared-components/BackButton";
import PageHeading from "../../shared-components/PageHeading";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory, useParams } from "react-router-dom";
import {
  BiArrowFromBottom,
  BiArrowFromTop,
  BiCopy,
  BiGridVertical,
  BiSave,
  BiTrash,
} from "react-icons/bi";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import moment from "moment";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";

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

const DropCanvas = ({
  sections,
  onDrop,
  onDelete,
  onCopy,
  onMoveDown,
  onMoveUp,
  updateSectionField,
}) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "SECTION",
      drop: (item) => onDrop(item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onDrop]
  );

  return (
    <div
      className=" mb-3 mt-3"
      style={{
        border: "2px dashed rgb(204, 204, 204)",
        borderRadius: "12px",
      }}
    >
      <div
        className="space-y-4 view-padding page-sections drop-canvas"
        style={{
          gap: "10px",
          display: "flex",
          flexDirection: "column",
          minHeight: "50vh",
          borderRadius: "8px",
          backgroundColor: isOver ? "rgb(22 60 117 / 31%)" : "#fff",
        }}
        ref={drop}
      >
        {sections?.length ? (
          sections.map((section, idx) => {
            const sectionKey = `${section.section_id}-${idx}`;
            return (
              <div key={sectionKey} className="border rounded-lg">
                <div className="d-flex justify-content-between align-items-center rounded-top p-2 bg-select">
                  <section className="font-bold">
                    Section #{section.section_id}
                  </section>
                  <div className="d-flex gap-4">
                    <button
                      className={`bg-white border p-1 rounded-lg ${
                        idx === 0 && "cursor-na"
                      }`}
                      onClick={() => onMoveUp(idx)}
                      disabled={idx === 0} // Disable for first section
                    >
                      <BiArrowFromBottom size={18} />
                    </button>
                    <button
                      className={`bg-white border p-1 rounded-lg ${
                        idx === sections.length - 1 && "cursor-na"
                      }`}
                      onClick={() => onMoveDown(idx)}
                      disabled={idx === sections.length - 1} // Disable for last section
                    >
                      <BiArrowFromTop size={18} />
                    </button>
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
                <div className="d-flex gap-10 p-2 mt-1 rounded-bottom bg-white">
                  <div>
                    <img
                      src="https://picsum.photos/300/200"
                      alt="Preview"
                      className="w-32"
                      style={{
                        maxHeight: "100px",
                        maxWidth: "150px",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div className="w-100">
                    {Object.keys(section.variables || {}).map((field) => (
                      <div
                        key={field}
                        style={{ marginBottom: "1rem" }}
                        className="editable-field form-group"
                      >
                        <label className="text-muted">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type="text"
                          value={section.variables?.[field] || ""}
                          onChange={(e) =>
                            updateSectionField(
                              sectionKey,
                              field,
                              e.target.value
                            )
                          }
                          placeholder={`Enter ${field}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
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
    </div>
  );
};

const ViewWebsite = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("MAIN");
  // const [pageData, setPageData] = useState([]);
  const [currentPageSectionsData, setCurrentPageSectionData] = useState([]);
  const shouldTriggerSaveRef = useRef(false);

  const { data: sectionsData } = useQuery<any>([sectionsKey, ,], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { data: currentPageData } = useQuery<any>([`${pagesKey}/${id}`, ,], {
    onError: (error: AxiosError) => {
      handleApiError(error, history);
    },
  });

  const { data: pageSectionsData } = useQuery<any>(
    [`${pagesKey}/${id}/sections`, ,],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );
  // console.log("pageSectionsData", pageSectionsData);

  useEffect(() => {
    const simplifiedSections = pageSectionsData?.data?.map((section) => {
      const allowedKeys = section.configurations?.editable_fields || [];
      const filteredVariables = Object.fromEntries(
        Object.entries(section.variables || {}).filter(([key]) =>
          allowedKeys.includes(key)
        )
      );

      return {
        id: section.id,
        section_id: section.section_id,
        order: section.order,
        variables: filteredVariables,
      };
    });

    setCurrentPageSectionData(simplifiedSections || []);
  }, [currentPageData, pageSectionsData, sectionsData]);

  useEffect(() => {
    if (shouldTriggerSaveRef.current) {
      _onSavePageSection(currentPageSectionsData);
      shouldTriggerSaveRef.current = false;
    }
  }, [currentPageSectionsData]);

  // console.log("currentPageSectionsData", currentPageSectionsData);

  const addSection = (section) => {
    const uniqueId = `${section.id}-${Date.now()}`;
    const editableFields = section.configuration?.editable_fields || [];
    const defaultData = section.default_data || {};

    const variables = editableFields.reduce((acc, key) => {
      acc[key] = defaultData[key] ?? ""; // fallback to empty string if not present
      return acc;
    }, {});

    setCurrentPageSectionData((prev) => [
      ...prev,
      {
        id: uniqueId,
        section_id: section.id,
        order: prev.length + 1,
        variables,
      },
    ]);
  };

  const _onDeleteClick = async (sectionId) => {
    if (!sectionId) return;

    const sectionToDelete = currentPageSectionsData.find(
      (s) => s.id === sectionId
    );

    if (!sectionToDelete) return;

    const isFromDatabase = typeof sectionToDelete.id === "number";

    if (isFromDatabase) {
      try {
        if (!id) return; // page ID
        const res = await API.delete(`${pagesKey}/${id}/sections/${sectionId}`);
        const data = res;
        if (data) {
          setCurrentPageSectionData((prev) =>
            prev.filter((section) => section.id !== sectionId)
          );
          showMsgToast("Section Deleted Successfully");
        }
      } catch (error) {
        handleApiError(error, history);
      }
    } else {
      setCurrentPageSectionData((prev) =>
        prev.filter((section) => section.id !== sectionId)
      );
      showMsgToast("Section Deleted Successfully");
    }
  };

  const _onCopyClick = (sectionId) => {
    const sectionToCopy = currentPageSectionsData.find(
      (section) => section.id === sectionId
    );

    if (sectionToCopy) {
      const newSection = {
        ...sectionToCopy,
        id: `${sectionToCopy.section_id}-${Date.now()}`,
        order: currentPageSectionsData.length + 1,
      };

      setCurrentPageSectionData((prev) => [...prev, newSection]);
    }
  };

  // const _onCopyClick = async (sectionId) => {
  //   const sectionToCopy = currentPageSectionsData.find(
  //     (section) => section.id === sectionId
  //   );

  //   if (!sectionToCopy) return;

  //   const isFromDatabase = typeof sectionToCopy.id === "number";

  //   if (isFromDatabase) {
  //     try {
  //       const payload = {
  //         section_id: sectionToCopy.section_id,
  //         variables: {
  //           ...sectionToCopy.variables,
  //           title: sectionToCopy.variables?.title
  //             ? `${sectionToCopy.variables.title} - copy`
  //             : undefined,
  //         },
  //         order: currentPageSectionsData.length + 1,
  //       };

  //       const res = await API.post(
  //         `${pagesKey}/${id}/sections/${sectionId}/duplicate`,
  //         payload
  //       );
  //       const data = res?.data;
  //       if (data) {
  //         setCurrentPageSectionData((prev) => [...prev, data]);
  //         showMsgToast("Section copied successfully");
  //       }
  //     } catch (error) {
  //       handleApiError(error, history);
  //     }
  //   } else {
  //     const newSection = {
  //       // ...sectionToCopy,
  //       id: `${sectionToCopy.section_id}-${Date.now()}`,
  //       order: currentPageSectionsData.length + 1,
  //       variables: {
  //         ...sectionToCopy.variables,
  //         title: sectionToCopy.variables?.title
  //           ? `${sectionToCopy.variables.title} - copy`
  //           : undefined,
  //       },
  //     };

  //     setCurrentPageSectionData((prev) => [...prev, newSection]);
  //     showMsgToast("Unsaved section copied");
  //   }
  // };

  const _onSavePageSection = async (sectionData) => {
    console.log("onsave");
    try {
      if (!id) return;
      const res = await API.post(
        `${pagesKey}/${id}/sections/replace`,
        {
          sections: sectionData || [],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = res;
      if (data) console.log({ data });
      showMsgToast("Sections Updated Successfully");
    } catch (error) {
      handleApiError(error, history);
    }
  };

  const onMoveUp = (idx) => {
    console.log("onmoveup", idx);
    setCurrentPageSectionData((prevSections) => {
      if (idx === 0) return prevSections;
      const updated = [...prevSections];
      // Swap orders
      const tempOrder = updated[idx - 1].order;
      console.log("temoprder", tempOrder);
      updated[idx - 1].order = updated[idx].order;
      updated[idx].order = tempOrder;

      console.log("temoprder", JSON.parse(JSON.stringify(updated)));
      // Swap positions in array
      [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
      shouldTriggerSaveRef.current = true;

      return updated;
    });
  };

  const onMoveDown = (idx) => {
    console.log("onmovedown", idx);

    setCurrentPageSectionData((prevSections) => {
      if (idx === prevSections.length - 1) return prevSections;
      const updated = [...prevSections];
      // Swap orders
      const tempOrder = updated[idx + 1].order;
      updated[idx + 1].order = updated[idx].order;
      updated[idx].order = tempOrder;
      // Swap positions in array
      [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
      shouldTriggerSaveRef.current = true;

      return updated;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="card view-padding p-2 d-flex mt-3">
        <BackButton title={currentPageData?.data?.name} />

        <div
          className="text-primary"
          style={{ marginTop: "-25px", background: "#fff" }}
        >
          <div className="d-flex justify-content-between">
            <small className="text-mutes">
              Last Edited On:{" "}
              {formattedDate(currentPageData?.data?.last_edited_on)}
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
            <Button
              variant="primary"
              size="sm"
              onClick={() => _onSavePageSection(currentPageSectionsData)}
            >
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

                <Container
                  fluid
                  className=""
                  style={{ height: "80vh", overflowY: "auto" }}
                >
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
              <DropCanvas
                sections={currentPageSectionsData}
                onDrop={addSection}
                onDelete={_onDeleteClick}
                onCopy={_onCopyClick}
                onMoveDown={onMoveDown}
                onMoveUp={onMoveUp}
                updateSectionField={(sectionKey, field, value) => {
                  setCurrentPageSectionData((prev) =>
                    prev.map((section, idx) => {
                      const key = `${section.section_id}-${idx}`;
                      if (key === sectionKey) {
                        return {
                          ...section,
                          variables: {
                            ...section.variables,
                            [field]: value,
                          },
                        };
                      }
                      return section;
                    })
                  );
                }}
              />
            </Col>
          </Row>
        ) : (
          <SeoForm seoDetails={currentPageData?.data?.seo_details} />
        )}
      </div>
    </DndProvider>
  );
};

export default ViewWebsite;
