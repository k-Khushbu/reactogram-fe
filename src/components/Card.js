import React, { useState } from 'react'
import './Card.css';
import { useSelector } from 'react-redux';
import axios from 'axios'
import { API_BASE_URL } from '../../src/config';

const Card = (props) => {
  const user = useSelector(state => state.userReducer);
  const [commentBox, setCommentBox] = useState(false);
  const [comment, setComment] = useState("");

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  }

  const submitComment = async (postId) => {
    // console.log(comment);
    setCommentBox(false);

    const request = { "postId": postId, "commentText": comment };
    const response = await axios.put(`${API_BASE_URL}/comment`, request, CONFIG_OBJ);
    if (response.status === 200) {
      props.getAllPosts();
    }
  }

  const likeDislikePost = async (postId, type) => {
    const request = { "postId": postId };
    console.log("type::", type);
    if(localStorage.getItem("token")){
      const response = await axios.put(`${API_BASE_URL}/${type}`, request, CONFIG_OBJ);
      if (response.status === 200) {
        props.getAllPosts();
      }
    }
  }

  // console.log(user);
  // console.log(user.user._id);
  // console.log(props.postData.author._id);

  return (
    <div className='h-100'>
      <div className='card shadow-sm h-100'>
        <div className='card-body px-2 h-100'>
          <div className='row'>
            <div className='col-6 d-flex'>
              <img className='p-2 profile-img' alt="profile-pic" src='https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
              <div className='mt-2'>
                <p className='fs-6 fw-bold'>{props.postData.author.fullName}</p>
                <p className='location'>{props.postData.location}</p>
              </div>
            </div>
            {/* <div className='col-6'>
              <span className='float-end'>
                <i className="fa-solid fa-ellipsis-vertical fs-3 p-2 mt-3"></i>
              </span>
            </div> */}
            {props.postData.author._id === user.user._id ? <div className='col-6'>
              <span onClick={() => props.deletePost(props.postData._id)} style={{ cursor: 'pointer' }} className='float-end'>
                <i className="fa-solid fa-ellipsis-vertical fs-3 p-2 mt-3"></i>
              </span>
            </div> : ""}
          </div>
          <div className='row'>
            <div className='col-12'>
              <img style={{ borderRadius: '15px' }} className='p-2 img-fluid' alt={props.postData.description} src={props.postData.image} />
            </div>
          </div>
          <div className='row'>
            <div className='col-12 mx-2'>
              {props.postData.description}
            </div>
          </div>
          <div className='row my-3'>
            <div className='col-6 d-flex'>
              <i onClick={() => likeDislikePost(props.postData._id, 'like')}
                onDoubleClick={() => likeDislikePost(props.postData._id, 'unlike')}
                on
                className="ps-2 fs-4 fa-regular fa-heart"></i>
              {/* <i onClick={() => likeDislikePost(props.postData._id, 'unlike')} className="ps-2 fs-4 fa-regular fa-thumbs-down"></i> */}
              <i onClick={() => setCommentBox(true)} className="ps-3 fs-4 fa-regular fa-comment"></i>
              <i className="ps-3 fs-4 fa-solid fa-location-arrow"></i>
            </div>
            <div className='col-6'>
              <span className='pe-2 fs-6 fw-bold float-end'>
                {props.postData.likes.length} likes
              </span>
            </div>
          </div>
          {commentBox ? <div className='row'>
            <div className='col-8'>
              <textarea onChange={(e) => setComment(e.target.value)} className='form-control' />
            </div>
            <div className='col-4'>
              <button className='btn btn btn-outline-dark' onClick={() => submitComment(props.postData._id)}>Submit</button>
            </div>
          </div> : ""}
          {props.postData.comments.map((comment) => {
            return (<div className='row'>
              <div className='col-12'>
                <p><b>{comment.commentedBy.fullName}</b> {comment.commentText}</p>
              </div>
            </div>)
          })}
          <div className='row'>
            <div className='col-12'>
              <span className='p-2 text-muted'>2 Hours Ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card