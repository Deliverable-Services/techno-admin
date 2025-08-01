import React from "react";
import { useDrop } from "react-dnd";
import {
  BiArrowFromBottom,
  BiArrowFromTop,
  BiCopy,
  BiGridVertical,
  BiSave,
  BiTrash,
} from "react-icons/bi";

const PageCanvas = ({
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

  console.log("page- sections", sections);

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
                  <section className="font-bold">{section.name}</section>
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
                    {/* <img
                      src="https://picsum.photos/300/200"
                      alt="Preview"
                      className="w-32"
                      style={{
                        maxHeight: "100px",
                        maxWidth: "150px",
                        borderRadius: "8px",
                      }}
                    /> */}
                  </div>
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
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              updateSectionField(
                                sectionKey,
                                field.name,
                                e.target.files?.[0]
                              )
                            }
                            placeholder={field.placeholder}
                          />
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
