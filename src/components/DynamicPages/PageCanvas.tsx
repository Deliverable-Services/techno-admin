import React from "react";
import { useDrop } from "react-dnd";
import API from "../../utils/API";
import { showMsgToast } from "../../utils/showMsgToast";
import { handleApiError } from "../../hooks/handleApiErrors";
import { useHistory } from "react-router-dom";
import { Hammer } from "../ui/icon";

const PageCanvas = ({
  sections,
  onDrop,
  onDelete,
  onCopy,
  onMoveDown,
  onMoveUp,
  updateSectionField,
  triggerSave,
}) => {
  const history = useHistory();
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

  const handleUploadImage = async (e, sectionKey, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await API.post(`upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        updateSectionField(
          sectionKey,
          field.name,
          response?.data?.data?.full_url
        );
        showMsgToast(response?.data?.message);
        if (typeof triggerSave === "function") {
          triggerSave();
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      handleApiError(error, history);
    }
  };

  return (
    <div
      className=" mb-3 mt-3"
      style={{
        border: "2px dashed rgb(204, 204, 204)",
        borderRadius: "12px",
        overflowY: "auto",
        height: "calc(100vh - 342px)",
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
                  <section className="font-bold">{section.name}</section>
                  <div className="d-flex gap-4">
                    <button
                      className={`bg-white border p-1 rounded-lg ${
                        idx === 0 && "cursor-na"
                      }`}
                      onClick={() => onMoveUp(idx)}
                      disabled={idx === 0} // Disable for first section
                    >
                      <Hammer size={18} />
                    </button>
                    <button
                      className={`bg-white border p-1 rounded-lg ${
                        idx === sections.length - 1 && "cursor-na"
                      }`}
                      onClick={() => onMoveDown(idx)}
                      disabled={idx === sections.length - 1} // Disable for last section
                    >
                      <Hammer size={18} />
                    </button>
                    <button
                      className="bg-white border p-1 rounded-lg"
                      onClick={() => onCopy(section?.id)}
                    >
                      <Hammer size={18} />
                    </button>
                    <button
                      className="bg-white border p-1 rounded-lg"
                      onClick={() => onDelete(section?.id)}
                    >
                      <Hammer size={18} />
                    </button>
                  </div>
                </div>
                <div className="d-flex gap-10 p-2 mt-1 rounded-bottom bg-white">
                  {/* <div>
                    {(() => {
                      const imageField =
                        section.configuration?.editable_fields?.find(
                          (f) => f.type === "image"
                        );
                      const imageValue =
                        imageField && section.variables?.[imageField.name];
                      // If imageValue is a File object (from input), create a URL for preview
                      let imageUrl = "";
                      if (imageValue instanceof File) {
                        imageUrl = URL.createObjectURL(imageValue);
                      } else if (typeof imageValue === "string" && imageValue) {
                        imageUrl = imageValue;
                      }
                      return imageField ? (
                        <img
                          src={"https://picsum.photos/300/200"}
                          alt="Preview"
                          className="w-32"
                          style={{
                            maxHeight: "100px",
                            maxWidth: "150px",
                            borderRadius: "8px",
                          }}
                        />
                      ) : null;
                    })()}
                  </div> */}
                  <div className="w-100">
                    {section.configuration?.editable_fields?.map((field) => (
                      <div
                        key={field.name}
                        style={{ marginBottom: "1rem" }}
                        className="editable-field form-group"
                      >
                        <label className="text-muted">
                          {field.label ||
                            field.name.charAt(0).toUpperCase() +
                              field.name.slice(1)}
                        </label>
                        {field.type === "image" ? (
                          <div className="align-items-start d-flex gap-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleUploadImage(e, sectionKey, field)
                              }
                              placeholder={field.placeholder}
                            />
                            <img
                              src={section.variables?.[field.name]}
                              alt={field.label}
                              className="rounded w-25"
                            />
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            value={section.variables?.[field.name] || ""}
                            onChange={(e) =>
                              updateSectionField(
                                sectionKey,
                                field.name,
                                e.target.value
                              )
                            }
                            placeholder={
                              field.placeholder ||
                              `Enter ${field.label || field.name}`
                            }
                          />
                        )}
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

export default PageCanvas;
