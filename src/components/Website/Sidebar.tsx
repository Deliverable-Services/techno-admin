import React from "react";
import { Container } from "react-bootstrap";

const Sidebar = ({ sections, onAdd }) => (
  <>
    {sections.map((section) => (
      <Container
        fluid
        className="card component-wrapper view-padding mb-3 mt-3"
      >
        <img
          src={section.json.variables.featuredImage || "https://via.placeholder.com/80"}
          alt="image"
          className="rounded-lg"
          style={{
            // width: "80px",
            // height: "80px",
          }}
        />
        <div
          key={section.id}
          className="p-2 mb-2 bg-gray-100 cursor-pointer hover:bg-gray-200"
          onClick={() => onAdd(section)}
        >
          {section.name}
        </div>
      </Container>
    ))}
  </>
);

export default Sidebar;
