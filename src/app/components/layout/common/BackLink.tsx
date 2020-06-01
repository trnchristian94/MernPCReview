import React from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

interface Props {
  callback: any;
}
function BackLink({ callback }: Props) {
  return (
    <div className="goBackLink mb-3" onClick={() => callback()}>
      <ArrowBackIcon className="arrowBack" />
      <span>Return</span>
    </div>
  );
}

export default BackLink;
