import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import SeoForm from "./SeoForm";
import BackButton from "../../shared-components/BackButton";
import PageHeading from "../../shared-components/PageHeading";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory, useParams } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import moment from "moment";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import PageCanvas from "./PageCanvas";
import SectionItem from "./SectionItem";
import { queryClient } from "../../utils/queryClient";

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

const deleteSection = ({ id, sectionId }: { id: string; sectionId: any }) => {
  return API.delete(`${pagesKey}/${id}/sections/${sectionId}`);
};

const copySection = ({
  id,
  sectionId,
  payload,
}: {
  id: string;
  sectionId: string;
  payload: any;
}) => {
  return API.post(
    `${pagesKey}/${id}/sections/${sectionId}/duplicate`,
    payload,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const saveSections = ({
  id,
  sectionData,
}: {
  id: string;
  sectionData: any;
}) => {
  return API.post(
    `${pagesKey}/${id}/sections/replace`,
    {
      sections: sectionData || [],
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

const ViewWebsite = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("MAIN");
  const [currentPageSectionsData, setCurrentPageSectionData] = useState([]);
  const [pendingImageSave, setPendingImageSave] = useState(false);

  const { mutate: mutateDelete, isLoading: isDeleteLoading } = useMutation(
    deleteSection,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${pagesKey}/${id}/sections`);
        showMsgToast("Section Deleted Successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );
  const { mutate: mutateSave, isLoading: isSaveLoading } = useMutation(
    saveSections,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${pagesKey}/${id}/sections`);
        showMsgToast("Sections Updated Successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );
  const { mutate: mutateCopy, isLoading: isCopyLoading } = useMutation(
    copySection,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`${pagesKey}/${id}/sections`);
        showMsgToast("Sections Duplicated Successfully");
      },
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

  const { data: sectionsData } = useQuery<any>(
    [`${sectionsKey}?per_page=50`, ,],
    {
      onError: (error: AxiosError) => {
        handleApiError(error, history);
      },
    }
  );

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

  useEffect(() => {
    if (pageSectionsData?.data && sectionsData?.data) {
      const mergedSections = pageSectionsData.data.map((section, idx) => {
        // Find the section template by id
        const template = sectionsData.data.find(
          (tpl) => tpl.id === section.section_id || tpl.id === section.id
        );
        const editableFields = template?.configuration?.editable_fields || [];
        const defaultData = template?.default_data || {};

        // Build variables using field.name
        const variables = editableFields.reduce((acc, field) => {
          acc[field.name] =
            section.variables?.[field.name] ?? defaultData[field.name] ?? "";
          return acc;
        }, {});

        return {
          ...section,
          name: template?.name || section.name,
          configuration: template?.configuration,
          order: section.order ?? idx + 1,
          variables,
        };
      });

      setCurrentPageSectionData(mergedSections);
    }
  }, [pageSectionsData, sectionsData]);

  useEffect(() => {
    if (pendingImageSave) {
      _onSavePageSection(currentPageSectionsData);
      setPendingImageSave(false);
    }
  }, [pendingImageSave, currentPageSectionsData]);

  const addSection = (section) => {
    const uniqueId = `${section.id}-${Date.now()}`;
    const editableFields = section.configuration?.editable_fields || [];
    const defaultData = section.default_data || {};

    // Use field.name for keys
    const variables = editableFields.reduce((acc, field) => {
      acc[field.name] = defaultData[field.name] ?? "";
      return acc;
    }, {});

    setCurrentPageSectionData((prev) => [
      ...prev,
      {
        id: uniqueId,
        name: section.name,
        section_id: section.id,
        order: prev.length + 1,
        configuration: section.configuration, // <-- Add this line!
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
      if (!id) return; // page ID
      mutateDelete({ id, sectionId });
    } else {
      setCurrentPageSectionData((prev) =>
        prev.filter((section) => section.id !== sectionId)
      );
      showMsgToast("Section Deleted Successfully");
    }
  };

  const _onCopyClick = async (sectionId) => {
    const sectionToCopy = currentPageSectionsData.find(
      (section) => section.id === sectionId
    );

    if (!sectionToCopy) return;

    const isFromDatabase = typeof sectionToCopy.id === "number";
    if (isFromDatabase) {
      const payload = {
        section_id: sectionToCopy.section_id,
        variables: {
          ...sectionToCopy.variables,
          title: sectionToCopy.variables?.title
            ? `${sectionToCopy.variables.title} - copy`
            : undefined,
        },
        order: currentPageSectionsData.length + 1,
      };

      mutateCopy({ id, sectionId, payload });
    } else {
      const newSection = {
        // ...sectionToCopy,
        id: `${sectionToCopy.section_id}-${Date.now()}`,
        order: currentPageSectionsData.length + 1,
        variables: {
          ...sectionToCopy.variables,
          title: sectionToCopy.variables?.title
            ? `${sectionToCopy.variables.title} - copy`
            : undefined,
        },
      };

      setCurrentPageSectionData((prev) => [...prev, newSection]);
      showMsgToast("Unsaved section copied");
    }
  };

  const _onSavePageSection = async (sectionData) => {
    // Filter variables to only those in editable_fields
    const filteredSections = sectionData.map((section) => {
      const editableFields =
        section.configuration?.editable_fields?.map((f) => f.name) || [];
      const filteredVariables = Object.fromEntries(
        Object.entries(section.variables || {}).filter(([key]) =>
          editableFields.includes(key)
        )
      );
      return {
        ...section,
        variables: filteredVariables,
      };
    });

    await mutateSave({
      id,
      sectionData: filteredSections,
    });
  };

  const triggerSave = () => {
    setPendingImageSave(true);
  };

  const onMoveUp = (idx) => {
    if (idx === 0) return;

    const updated = [...currentPageSectionsData];

    // Swap order
    const tempOrder = updated[idx - 1].order;
    updated[idx - 1].order = updated[idx].order;
    updated[idx].order = tempOrder;

    // Swap positions
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];

    setCurrentPageSectionData(updated);
    _onSavePageSection(updated);
  };

  const onMoveDown = (idx) => {
    if (idx === currentPageSectionsData.length - 1) return;

    const updated = [...currentPageSectionsData];

    // Swap order
    const tempOrder = updated[idx + 1].order;
    updated[idx + 1].order = updated[idx].order;
    updated[idx].order = tempOrder;

    // Swap positions
    [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]];

    setCurrentPageSectionData(updated);
    _onSavePageSection(updated);
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
                  style={{ height: "calc(100vh - 342px)", overflowY: "auto" }}
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
              <PageCanvas
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
                triggerSave={triggerSave}
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
