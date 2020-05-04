import React from "react";
import { connect } from "react-redux";
const renderStatus = (loadingStatus: number) => {
  if (loadingStatus === 1) {
    return <span></span>;
  } else if (loadingStatus === 2) {
    return <div className="loadingBar"><img src='https://res.cloudinary.com/dz6ogknjd/image/upload/v1588558431/imgs/ZKZg_m1pd9n.gif' title='loading'/></div>;
  }
};
interface Props {
  loadingStatus: any;
}
function LoadingBar({ loadingStatus }: Props) {
  return <div>{renderStatus(loadingStatus.loadingStatus)}</div>;
}
const mapStateToProps = (state: any) => ({
  loadingStatus: state.loadingStatus
});
export default connect(mapStateToProps)(LoadingBar);
