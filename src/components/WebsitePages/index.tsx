import { useState, useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import PageHeading from "../../shared-components/PageHeading";
import StaticPages from "../StaticPages";
import DynamicPages from "../DynamicPages";

const intitialFilter = {
  q: "",
  page: 1,
  perPage: 25,
  active: "static",
};

const WebsitePages = () => {
  const history = useHistory();
  const location = useLocation();

  // Get tab from query string
  const getTabFromQuery = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    return tab === "dynamic" ? "dynamic" : "static";
  };

  const [filter, setFilter] = useState({
    ...intitialFilter,
    active: getTabFromQuery(),
  });

  // Sync tab with URL query param on mount and when location changes
  useEffect(() => {
    const tab = getTabFromQuery();
    setFilter((prev) => ({
      ...prev,
      active: tab,
    }));
  }, [location.search]);

  const _onFilterChange = (idx: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [idx]: value,
    }));
    if (idx === "active") {
      const params = new URLSearchParams(location.search);
      params.set("tab", value);
      history.replace({ search: params.toString() });
    }
  };

  return (
    <>
      <Container fluid className=" component-wrapper view-padding">
        <PageHeading title="Website Pages" />
        <div className="d-flex justify-content-between pb-3 mt-3">
          <Nav
            className="global-navs"
            variant="tabs"
            activeKey={filter.active}
            onSelect={(selectedKey) => _onFilterChange("active", selectedKey)}
          >
            <Nav.Item>
              <Nav.Link eventKey="static">Static</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="dynamic">Dynamic</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <hr className="mt-2" />
        <Container fluid className="h-100 mt-2 p-0">
          {filter.active === "static" ? <StaticPages /> :  <DynamicPages/>}
        </Container>
      </Container>
    </>
  );
};

export default WebsitePages;