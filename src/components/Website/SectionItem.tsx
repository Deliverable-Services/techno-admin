import { useDrag } from "react-dnd";
import { BiGridVertical } from "react-icons/bi";

const SectionItem = ({ section }) => {
  const [, drag] = useDrag(() => ({
    type: "SECTION",
    item: section,
  }));

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

export default SectionItem;
