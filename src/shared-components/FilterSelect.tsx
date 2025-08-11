import React from "react";
import { Form } from "../components/ui/bootstrap-compat";

interface Props {
  onFilterChange: (idx: string, value: any) => void;
  label: string;
  currentValue: string;
  idx: string;
  data: Array<any>;
  valueSelector?: string;
  nameSelector?: string;
  defaultSelectTitle?: string;
  isDefaultDisabled?: boolean;
  width?: string;
  nameSelector2?: string;
}

const FilterSelect = ({
  onFilterChange,
  width = "200px",
  defaultSelectTitle = "All",
  isDefaultDisabled = false,
  label,
  currentValue,
  idx,
  data,
  valueSelector = "id",
  nameSelector = "name",
  nameSelector2 = "phone",
}: Props) => {
  return (
    <Form.Group className="mb-md-0">
      <Form.Label className="text-muted">{label}</Form.Label>
      <Form.Control
        as="select"
        value={currentValue}
        id={idx}
        onChange={(e) => onFilterChange(idx, e.target.value)}
        style={{
          width,
          fontSize: 14,
        }}
      >
        <option value="" disabled={isDefaultDisabled}>
          {defaultSelectTitle}
        </option>
        {data &&
          data.map((item) => (
            <option value={item[valueSelector]}>
              {item[nameSelector] || item[nameSelector2] || item[valueSelector]}
            </option>
          ))}
      </Form.Control>
    </Form.Group>
  );
};

export default FilterSelect;
