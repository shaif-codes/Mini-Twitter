import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaHeart, FaComment } from "react-icons/fa";
import profilePlaceholder from "../assets/images/sampleProfile.png";
import PropTypes from "prop-types";
import axios from "axios";
import Cookie from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const PostContainer = styled.div`
  background-color: #1a1a1a;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  color: white;
  width: 90%;

  @media (max-width: 768px) {
    padding: 15px;
    width: 85%;
  }
`;

const ProfileDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    margin-bottom: 5px;
  }
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const UserName = styled.span`
  font-weight: bold;
  color: white;

  @media (max-width: 768px) {
    font-size: 14px;
    margin: 0px 10px;
  }
`;

const UserHandle = styled.span`
  color: gray;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #1a89d4;
  }
  @media (max-width: 768px) {
    margin-left: 0;
    font-size: 12px;
  }
`;

const PostDate = styled.span`
  color: gray;
  margin-left: 5px;

  @media (max-width: 768px) {
    margin-left: 0;
    font-size: 12px;
  }
`;

const PostContent = styled.div`
  margin: 10px 0;

  @media (max-width: 768px) {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  width: 150px;

  @media (max-width: 768px) {
    width: 120px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.$liked ? "#1a89d4" : "white")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    opacity: 0.7;
  }
  &:focus {
    outline: none;
  }
  &:active {
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ActionCount = styled.span`
  font-size: 14px;
  color: inherit;
`;

const CommentsSection = styled.div`
  margin-top: 10px;
  border-top: 1px solid #253341;

  @media (max-width: 768px) {
    margin-top: 5px;
  }
`;

const CommentList = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #253341;
`;

const CommentItem = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #253341;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const CommentContent = styled.p`
  margin: 5px 0;
  color: #e1e1e1;
`;

const CommentDate = styled.span`
  color: #657786;
  font-size: 0.9em;
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #253341;
  border-radius: 5px;
  background-color: #192734;
  color: white;
  resize: none;
  min-height: 60px;
  &:focus {
    outline: none;
    border-color: #1a89d4;
  }
`;

const CommentButton = styled.button`
  background-color: #1a89d4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #1a7abf;
  }
`;

const PostComponent = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const token = Cookie.get("accessToken");

  // Add profile image URL from post data, fallback to placeholder
  const authorProfileImage = post.tweetBy?.profilePictureUrl || profilePlaceholder;

  useEffect(() => {
    // Fetch initial like status and count
    fetchLikeStatus();
    // Fetch comments if they're shown
    fetchComments();
  }, [post.id]);

  const fetchLikeStatus = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/likeCount/likeCount/${post.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log(response.data);
      setLiked(response.data.liked);
      setLikeCount(response.data.count);
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${API_URL}/comments/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(response.data.data);
    } catch (error) {
      // console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    // console.log("handleLike called");
    try {
      const endpoint = liked ? "/likeCount/unlike" : "/likeCount/like";
      const token = Cookie.get("accessToken");
      // console.log({ endpoint, token, postId: post.id });
      await axios.post(
        `${API_URL}${endpoint}`,
        { tweetId: post.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      // console.error("Error updating like:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `${API_URL}/comments`,
        {
          tweetId: post.id,
          comment: newComment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      fetchComments();
    }
  };

  return (
    <PostContainer>
      <ProfileDetails>
        <ProfileImage src={authorProfileImage} alt="Profile" />
        <UserInfo onClick={() => window.location.href = `/profile/${post.username}`}>
          <UserName>{post.name}</UserName>
          <UserHandle>@{post.username}</UserHandle>
          <PostDate>· {post.date}</PostDate>
        </UserInfo>
      </ProfileDetails>
      <PostContent>{post.content}</PostContent>
      <PostActions>
        <ActionButton $liked={liked} onClick={handleLike}>
          <FaHeart />
          <ActionCount>{likeCount}</ActionCount>
        </ActionButton>
        <ActionButton onClick={toggleComments}>
          <FaComment />
          <ActionCount>{comments.length}</ActionCount>
        </ActionButton>
      </PostActions>
      {showComments && (
        <CommentsSection>
          <form onSubmit={handleComment}>
            <CommentInput
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <CommentButton type="submit">Comment</CommentButton>
          </form>
          <CommentList>
            {comments.map((comment) => (
              <CommentItem key={comment.id}>
                <CommentHeader>
                  <CommentAuthor>{comment.name}</CommentAuthor>
                  <CommentDate>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </CommentDate>
                </CommentHeader>
                <CommentContent>{comment.comment}</CommentContent>
              </CommentItem>
            ))}
          </CommentList>
        </CommentsSection>
      )}
    </PostContainer>
  );
};

PostComponent.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    tweetBy: PropTypes.shape({
      profilePictureUrl: PropTypes.string
    })
  }).isRequired,
};

export default PostComponent;
