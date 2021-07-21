import React from "react";
import { baseUploadUrl } from "../utils/constants";

interface Props {
  folder: string;
  file: string;
}

const TableImage = ({ file, folder }: Props) => {
  if (!file) return <p className="text-muted text-center m-0">NA</p>;
  return (
    <div className="table-image">
      <img src={`${baseUploadUrl}${folder}/${file}`} alt={file} />
    </div>
  );
};

export default TableImage;
