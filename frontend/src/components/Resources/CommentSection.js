import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './CommentSection.css';

const CommentSection = ({ resourceId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [resourceId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/comments/resource/${resourceId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post('/comments', {
        content: newComment,
        resourceId
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyText.trim()) return;

    try {
      await api.post('/comments', {
        content: replyText,
        resourceId,
        parentCommentId: parentId
      });
      setReplyText('');
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('Failed to post reply');
    }
  };

  const handleLike = async (commentId) => {
    if (!user) {
      alert('Please login to like comments');
      return;
    }

    try {
      await api.post(`/comments/${commentId}/like`);
      fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComment = (comment, isReply = false) => {
    const isOwner = user && comment.author._id === user.id;
    const isLiked = user && comment.likes?.some(likeId => likeId === user.id || (typeof likeId === 'object' && likeId._id === user.id));

    return (
      <div key={comment._id} className={`comment ${isReply ? 'reply' : ''}`}>
        <div className="comment-header">
          <div className="comment-author">
            <strong>{comment.author?.name || 'Unknown'}</strong>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
          </div>
          {isOwner && (
            <button
              onClick={() => handleDelete(comment._id)}
              className="btn-delete"
              title="Delete comment"
            >
              ×
            </button>
          )}
        </div>
        <div className="comment-content">{comment.content}</div>
        <div className="comment-actions">
          <button
            onClick={() => handleLike(comment._id)}
            className={`btn-like ${isLiked ? 'liked' : ''}`}
          >
            {isLiked ? '❤️' : '🤍'} {comment.likes?.length || 0}
          </button>
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
              className="btn-reply"
            >
              Reply
            </button>
          )}
        </div>
        {replyingTo === comment._id && (
          <div className="reply-form">
            <textarea
              className="form-control"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows="3"
            />
            <div className="reply-actions">
              <button
                onClick={() => handleSubmitReply(comment._id)}
                className="btn btn-primary btn-sm"
              >
                Post Reply
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText('');
                }}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const topLevelComments = comments.filter(c => !c.parentComment);
  const replies = comments.filter(c => c.parentComment);

  return (
    <div className="comment-section">
      <h2>Discussion ({comments.length})</h2>

      {user ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            className="form-control"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Join the discussion..."
            rows="4"
            required
          />
          <button type="submit" className="btn btn-primary">
            Post Comment
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          <p>Please <a href="/login">login</a> to join the discussion</p>
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : topLevelComments.length === 0 ? (
        <div className="no-comments">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="comments-list">
          {topLevelComments.map(comment => (
            <div key={comment._id}>
              {renderComment(comment)}
              {replies
                .filter(reply => reply.parentComment === comment._id || reply.parentComment?._id === comment._id)
                .map(reply => renderComment(reply, true))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;

