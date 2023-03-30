import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "./redux/users/userSlicer";
import { getUser } from "./redux/users/userDetailSlicer";
import { followUser } from "./redux/users/userFallowSlicer";
import { unfollowUser } from "./redux/users/userUnfallowSlicer";
import { getFollows } from "./redux/followers/followerListSlicer";
import {
  Avatar,
  Button,
  Col,
  List,
  Row,
  Skeleton,
  Input,
  Modal,
  Card,
} from "antd";

const { Meta } = Card;
const { Search } = Input;

const Home = () => {
  const [userName, setUserName] = useState("");
  const [userList, setUserList] = useState([]);
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDetail, setUserDetail] = useState();
  const [userDetailName, setUserDetailName] = useState("");
  const [isFollowed, setIsFollowed] = useState(false);
  const [listfollow, setFollowList] = useState([]);

  const dispach = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);
  const { user, detailStatus, detailError } = useSelector(
    (state) => state.user
  );
  const { followedUser, followStatus, followError } = useSelector(
    (state) => state.userFollowing
  );
  const { unfollowedUser, unfollowStatus, unfollowError } = useSelector(
    (state) => state.userUnfollowing
  );
  const { followList, followListStatus, followListError } = useSelector(
    (state) => state.follows
  );

  useEffect(() => {
    getUserList();
    setInitLoading(false);
    setLoading(false);
  }, [page]);

  const onLoadMore = (event) => {
    if (loading) {
      return;
    }
    setLoading(true);
    event.preventDefault();
    setPage((prevPage) => prevPage + 1);
    setPerPage((prevPerPage) => prevPerPage + 5);
  };

  const getUserList = () => {
    if (userName !== "") {
      dispach(getUsers({ userName, perPage, page }));
      getFollows_();
      setInitLoading(false);
    }
  };

  const getUserDetail = (userDetailName) => {
    dispach(getUser({ userDetailName }));
    setUserDetailName(userDetailName);
    //console.log(followList);
  };
  //console.log(isFollowed);
  useEffect(() => {
    if (status == "succeeded") {
      setUserList(users);
    }
  }, [status]);

  useEffect(() => {
    if (detailStatus == "succeeded") {
      setUserDetail(user);
    }
  }, [detailStatus]);

  const btnUserDetailName = (userDetailName) => {
    findUser(listfollow, userDetailName);
    getUserDetail(userDetailName);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (followStatus == "succeeded") {
      setIsFollowed(true);
      getFollows_();
    }
  }, [followStatus]);

  useEffect(() => {
    if (unfollowStatus == "succeeded") {
      setIsFollowed(false);
      getFollows_();
    }
  }, [unfollowStatus]);

  useEffect(() => {
    if (followListStatus == "succeeded") {
      setFollowList(followList);
      //console.log(listfollow);
    }
  }, [followListStatus]);

  const loadMore =
    !initLoading && !loading && userName !== "" ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const userFollowing = () => {
    dispach(followUser({ userDetailName }));
  };

  const userUnfollowing = () => {
    dispach(unfollowUser({ userDetailName }));
  };

  const findUser = (array, username) => {
    var retVal =
      array.find((user) => user.login === username) !== undefined
        ? true
        : false;
    setIsFollowed(retVal);
  };

  const getFollows_ = () => {
    dispach(getFollows());
  };
  // const showModal = (uName) => {
  //   //console.log(uName);
  //   setUserDetailName(uName);
  //   getUserDetail();
  //   // //console.log(user);
  //   setIsModalOpen(true);
  // };

  return (
    <>
      <Row>
        <Col
          span={8}
          offset={8}
          justijy="center"
          style={{
            boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)",
            marginTop: "100px",
            padding: "10px",
          }}
        >
          <Row>
            <Col
              justijy="center"
              col={24}
              style={{ width: "100%", marginTop: "10px" }}
            >
              <Search
                placeholder="input search text"
                onSearch={getUserList}
                onChange={(e) => setUserName(e.target.value)}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
          <Row>
            <Col
              justijy="center"
              col={24}
              style={{ width: "100%", marginTop: "10px" }}
            >
              <List
                className="demo-loadmore-list"
                loading={initLoading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={userList}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <a
                        key="list-loadmore-edit"
                        onClick={() => btnUserDetailName(item.login)}
                      >
                        Detay
                      </a>,
                    ]}
                  >
                    <Skeleton
                      avatar
                      title={false}
                      loading={item.loading}
                      active
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar_url} />}
                        title={item.login}
                        description={<a src={item.html_url}>{item.html_url}</a>}
                      />
                      <div></div>
                    </Skeleton>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            style={{ display: "flex" }}
          >
            {userDetail && userDetail.avatar_url && (
              <Card
                hoverable
                style={{
                  width: 240,
                }}
                justify="center"
                cover={<img alt="example" src={userDetail.avatar_url} />}
              >
                <Meta
                  title={userDetail.name}
                  description={userDetail.company}
                />
                {!isFollowed ? (
                  <Button
                    onClick={userFollowing}
                    style={{ marginTop: "10px" }}
                    block
                  >
                    takip et
                  </Button>
                ) : (
                  <Button
                    onClick={userUnfollowing}
                    style={{ marginTop: "10px" }}
                    block
                  >
                    takibi bırak
                  </Button>
                )}
              </Card>
            )}
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default Home;
