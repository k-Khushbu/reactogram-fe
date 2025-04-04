import React, { useEffect, useState } from 'react'
import Card from '../components/Card';
import axios from 'axios'
import { API_BASE_URL } from '../../src/config';
import Swal from 'sweetalert2';

const PostOverview = () => {

  const [allPosts, setAllPosts] = useState([]);

  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  }

  const getAllPosts = async () => {
    // console.log("getAllPosts");
    const response = await axios.get(`${API_BASE_URL}/allposts`);

    if (response.status === 200) {
      setAllPosts(response.data.post);

    } else {
      Swal.fire({
        icon: 'error',
        title: 'some error occur while getting all posts'
      })
    }
  }

  const deletePost = async (postID) => {
    const response = await axios.delete(`${API_BASE_URL}/deletepost/${postID}`, CONFIG_OBJ);
    if (response.status === 200) {
      getAllPosts();
    }
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className='container mt-md-5 mt-3'>
      <div className='row'>
        {allPosts.map((post) => {
          return (
            <div className='col-md-4 mb-2'>
              <Card postData={post} deletePost={deletePost} getAllPosts={getAllPosts} key={post._id}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PostOverview