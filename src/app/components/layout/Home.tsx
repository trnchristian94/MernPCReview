import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import { getPosts } from "userLogic/actions/postActions";
import { getUrlDir } from "utils/string";
import req from "utils/request";
import UserPosts from "common/UserPosts";
import SupervisedUserCircle from "@material-ui/icons/SupervisedUserCircle";
import PeopleIcon from "@material-ui/icons/People";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

interface Props {
  auth: any;
  posts: any;
  getPosts: any;
}
function Home({ auth, posts, getPosts }: Props) {
  const { user } = auth;
  const [allPosts, setAllPosts] = useState([]);
  const path = getUrlDir();
  const [tabValue, setTabValue] = useState(path === "home" ? 1 : 0);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [tabValue]);

  const loadPosts = () => {
    if (user.id) {
      if (tabValue === 1) {
        fetchAllPosts();
      } else {
        fetchPosts();
      }
    }
  };

  const fetchPosts = () => {
    getPosts(user);
  };
  const fetchAllPosts = () => {
    req.get("/api/posts/", setAllPosts);
  };

  const renderPosts = () => {
    let ret = [];
    if (user.id) {
      if (posts && posts.length > 0 && tabValue === 0) {
        ret.push(
          <div key={"posts"}>
            <UserPosts posts={posts} fetchPosts={fetchPosts} />
          </div>
        );
      } else if (allPosts && allPosts.length > 0 && tabValue === 1) {
        ret.push(
          <div key={"allposts"}>
            <UserPosts posts={allPosts} fetchPosts={fetchAllPosts} />
          </div>
        );
      } else {
        ret.push(
          <h5 key={"noposts"} className="m-3">
            No posts yet, you can add one by pressing Post on the left sidebar.
          </h5>
        );
      }
    }
    return <div>{ret}</div>;
  };

  const changeTab = (e: any, num: number) => {
    setTabValue(num);
    window.history.pushState("", "", `/${num === 1 ? "home" : ""}`);
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }} className="pr-0 pl-0">
      <div>
        <h2 style={{ textAlign: "center" }}>The PC Review</h2>
        {user.id && (
          <Paper square>
            <Tabs
              value={tabValue}
              onChange={(e: any, nv: number) => changeTab(e, nv)}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab icon={<SupervisedUserCircle />} label="Stalking" />
              <Tab icon={<PeopleIcon />} label="All" />
            </Tabs>
          </Paper>
        )}
        {user.id && renderPosts()}
        {!user.id && (
          <h5 className="m-3">
            You are not logged in, please log in to see the content.
          </h5>
        )}
      </div>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  posts: state.posts.posts
});
export default connect(mapStateToProps, { getPosts })(Home);
