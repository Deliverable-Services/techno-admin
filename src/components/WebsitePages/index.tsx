import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import PageHeading from "../../shared-components/PageHeading";
import StaticPages from "../StaticPages";
import DynamicPages from "../DynamicPages";
import { Globe } from "lucide-react";

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

  // Sync tab with URL query param
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
      <div className="p-4">
        <PageHeading
          icon={<Globe size={24} />}
          title="Website Pages"
          description="Create and manage website pages"
        />
      </div>
      <hr className="border-gray-200" />

      <div className="h-full mt-4">
        {/* Tab Navigation */}
        <div className="px-4 pb-3 mt-3 border-b border-gray-200">
          <div className="flex space-x-6">
            <button
              onClick={() => _onFilterChange("active", "static")}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
                filter.active === "static"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Static
            </button>
            <button
              onClick={() => _onFilterChange("active", "dynamic")}
              className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
                filter.active === "dynamic"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Dynamic
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {filter.active === "static" ? <StaticPages /> : <DynamicPages />}
        </div>
      </div>
    </>
  );
};

export default WebsitePages;
