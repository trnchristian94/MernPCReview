import React from "react";
import { connect } from "react-redux";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import req from "utils/request";
import { useToasts } from "react-toast-notifications";
import "./LikeBar.scss";

interface Props {
  auth: any;
  fetchHardware: any;
  hardware: any;
}
function LikeBar({ auth, fetchHardware, hardware }: Props) {
  const { user } = auth;
  const { addToast } = useToasts();
  const likePost = (like: boolean, hardwareId: string) => {
    req.put(`/api/hardware/${like?"like":"dislike"}/${user.id}`, {hardwareId}, null, addToast)
    fetchHardware();
  }

  const renderLikeBar = () => {
    let likes = hardware.likes.length > 0 ? hardware.likes.length : 0;
    let dislikes = hardware.dislikes.length > 0 ? hardware.dislikes.length : 0;
    let totalLikes = likes + dislikes;
    let likePerc = (likes * 100) / totalLikes;
    likePerc = totalLikes === 0 ? 0 : likePerc;
    return <div id="likeBar" style={{ width: `${likePerc}%` }} />;
  };

  return (
    <div className="likeComponent">
      <div className="thumbs">
        <div className="likes">
          <ThumbUp onClick={() => likePost(true, hardware._id)} />
          {hardware.likes.length}
        </div>

        <div className="dislikes">
          <ThumbDown onClick={() => likePost(false, hardware._id)} />
          {hardware.dislikes.length}
        </div>
      </div>

      <div className="likingBar">{renderLikeBar()}</div>
    </div>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth
});
export default connect(mapStateToProps)(LikeBar);
