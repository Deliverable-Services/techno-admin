import { Form } from "../components/ui/bootstrap-compat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

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
  className?: string;
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
  className,
}: Props) => {
  return (
    <Form.Group className="mb-md-0">
      <Form.Label className="text-muted">{label}</Form.Label>
      {/*   <Form.Group className="mb-md-0">
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
          </Form.Group> */}

      <Select
        value={currentValue}
        onValueChange={(value: any) => onFilterChange(idx, value)}
      >
        <SelectTrigger className={`w-[180px] ${className}`}>
          <SelectValue placeholder={defaultSelectTitle} />
        </SelectTrigger>
        <SelectContent>
          {data &&
            data.map((item) => (
              <SelectItem
                value={item[valueSelector]}
                disabled={isDefaultDisabled}
              >
                {item[nameSelector] ||
                  item[nameSelector2] ||
                  item[valueSelector]}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </Form.Group>
  );
};

export default FilterSelect;
