import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "./redux/users/userSlicer";
import { getUser } from "./redux/users/userDetailSlicer";
import { followUser } from "./redux/users/userFallowSlicer";
import { unfollowUser } from "./redux/users/userUnfallowSlicer";
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

  console.log(unfollowStatus);

  const onLoadMore = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setPage(Number(page) + 1);
    getUserList();
    setInitLoading(false);
  };

  const getUserList = () => {
    dispach(getUsers({ userName, perPage, page }));
    setInitLoading(false);
  };

  const getUserDetail = () => {
    dispach(getUser({ userDetailName }));
  };

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

  useEffect(() => {
    if (userDetailName !== "") {
      getUserDetail();
      setIsModalOpen(true);
    }
  }, [userDetailName]);

  useEffect(() => {
    if (followStatus == "succeeded") {
      setIsFollowed(true);
    }
  }, [followStatus]);

  useEffect(() => {
    if (unfollowStatus == "succeeded") {
      setIsFollowed(false);
    }
  }, [unfollowStatus]);

  const loadMore =
    !initLoading && !loading ? (
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

  // const showModal = (uName) => {
  //   console.log(uName);
  //   setUserDetailName(uName);
  //   getUserDetail();
  //   // console.log(user);
  //   setIsModalOpen(true);
  // };

  return (
    <>
      <Row>
        <Col span={8} offset={8} justijy="center">
          <Search
            placeholder="input search text"
            onSearch={getUserList}
            onChange={(e) => setUserName(e.target.value)}
            style={{ width: 200 }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={8}>
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
                    onClick={() => setUserDetailName(item.login)}
                  >
                    Detay
                  </a>,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta avatar={<Avatar src={item.avatar_url} />} />
                  <div>{item.login}</div>
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
            <Meta title={userDetail.name} description={userDetail.company} />
            {!isFollowed ? (
              <button onClick={userFollowing}>takip et</button>
            ) : (
              <button onClick={userUnfollowing}>takibi bırak</button>
            )}
          </Card>
        )}
      </Modal>
    </>
  );
};

export default Home;
