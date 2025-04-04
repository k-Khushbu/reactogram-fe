import React, { useEffect, useState } from 'react'
import './Profile.css'
import { Button, Modal } from 'react-bootstrap'
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import Swal from 'sweetalert2';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
    const user = useSelector(state => state.userReducer);
    const [myallPosts, setMyAllPosts] = useState([]);

    const [postDetail, setPostDetail] = useState({});

    const navigate = useNavigate();
    const [image, setImage] = useState({ preview: '', data: '' })

    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);

    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showPost, setShowPost] = useState(false);
    const handlePostClose = () => setShowPost(false);
    const handlePostShow = () => setShowPost(true);

    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    // console.log(CONFIG_OBJ);

    const handleFileSelect = (event) => {
        const img = {
            preview: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        }
        setImage(img);
    }

    const handleImgUpload = async () => {
        let formData = new FormData();
        formData.append('file', image.data);
        const response = axios.post(`${API_BASE_URL}/uploadFile`, formData);
        return response;
    }

    const getMyPosts = async () => {
        // console.log("getMyPosts");
        const response = await axios.get(`${API_BASE_URL}/myallPosts`, CONFIG_OBJ);

        if (response.status === 200) {
            setMyAllPosts(response.data.post);

        } else {
            Swal.fire({
                icon: 'error',
                title: 'some error occur while getting your posts'
            })
        }
    }

    const addPost = async () => {
        if (image.preview === '') {
            Swal.fire({
                icon: 'error',
                title: 'Post image is mandatory!'
            })
        }
        else if (caption === '') {
            Swal.fire({
                icon: 'error',
                title: 'Post caption is mandatory!'
            })
        }
        else if (location === '') {
            Swal.fire({
                icon: 'error',
                title: 'Location is mandatory!'
            })
        }
        else {
            setLoading(true);
            const imgRes = await handleImgUpload();
            //add validation rule for caption and location
            const request = { description: caption, location: location, image: `${API_BASE_URL}/files/${imgRes.data.fileName}` };
            // console.log(request);
            //write api call to create post
            const postResponse = await axios.post(`${API_BASE_URL}/createpost`, request, CONFIG_OBJ);
            setLoading(false);
            if (postResponse.status === 201) {
                navigate("/posts");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occurs while creating the post'
                })
            }
        }
    }

    const showDetail = (post) => {
        setPostDetail(post);
        // console.log(post);
        // console.log(post._id);
    }

    const deletePost = async (postID) => {
        const response = await axios.delete(`${API_BASE_URL}/deletepost/${postID}`, CONFIG_OBJ);
        if (response.status === 200) {
            getMyPosts();
            handleClose();
        }
    }

    useEffect(() => {
        getMyPosts();
    }, []);

    return (
        <div className='container shadow mt-3 p-4'>
            <div className='row'>
                <div className='col-md-6 d-flex flex-column'>
                    <img className='p-2 profile-pic' alt="profile-pic" src='https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                    <p className='ms-3 fs-5 fw-bold'>{user.user.fullName}</p>
                    <p className='ms-3 fs-5'>{user.user.email}</p>
                    <p className='ms-3 fs-5'>UI/UX Designer @{user.user.fullName} | Follow @{user.user.fullName}</p>
                    <p className='ms-3 fs-5'>My portfolio on <a href="#">www.portfolio.com/{user.user.fullName}</a></p>
                </div>
                <div className='col-md-6 d-flex flex-column justify-content-between mt-3'>
                    <div className='d-flex justify-content-equal text-center fw-bold mx-auto'>
                        <div className='count-section pe-4 pe-md-5'>
                            <h4>{myallPosts.length}</h4>
                            <p>Posts</p>
                        </div>
                        <div className='count-section px-4 px-md-5'>
                            <h4>20</h4>
                            <p>Followers</p>
                        </div>
                        <div className='ps-4 ps-md-5'>
                            <h4>20</h4>
                            <p>Following</p>
                        </div>
                    </div>
                    <div className='mx-auto mt-4 mt-md-0'>
                        <button type="submit" className="custom-btn custom-btn-white me-2 me-md-3 px-4 px-md-5">
                            <span className='fs-6'>Edit Profile</span>
                        </button>
                        <button type="submit" className="custom-btn custom-btn-white px-4 px-md-5" onClick={handlePostShow}>
                            <span className='fs-6'>Upload Post</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='row my-3'>
                <div className='col-12'>
                    <hr />
                </div>
            </div>
            <div className='row'>
                {myallPosts.map((post) => {
                    return (
                        <div className='col-md-4 col-sm-12 mb-3 mb-md-4' key={post._id}>
                            <div className="card" onClick={handleShow}>
                                <img src={post.image} className="card-img-top"
                                    alt={post.description}
                                    onClick={() => showDetail(post)}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>

                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div>
                                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                                    <div className="carousel-indicators">
                                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                    </div>
                                    <div className="carousel-inner">
                                        <div className="carousel-item active">
                                            <img src={postDetail.image} className="d-block w-100" alt="..." />
                                        </div>
                                        <div className="carousel-item">
                                            <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100" alt="..." />
                                        </div>
                                        <div className="carousel-item">
                                            <img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block w-100" alt="..." />
                                        </div>
                                    </div>
                                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div className='row'>
                                <div className='col-6 d-flex'>
                                    <img className='p-2 profile-img' alt="profile-pic" src='https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                                    <div className='mt-2 ms-2'>
                                        <p className='fs-6 fw-bold'>{user.user.fullName}</p>
                                        <p className='location'>{postDetail.location}</p>
                                    </div>
                                </div>
                                <div className='col-6 mt-2'>
                                    <div className="dropdown float-end">
                                        <a className="btn" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">
                                            <span className=''>
                                                <i className="fa-solid fa-ellipsis fs-3"></i>
                                            </span>
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                            <li><a className="dropdown-item" href="#"><i className="fa-regular fa-pen-to-square px-2"></i>Edit Post</a></li>
                                            <li><a className="dropdown-item" onClick={()=>deletePost(postDetail._id)}><i className="fa-regular fa-trash-can px-2"></i>Delete Post</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12'>
                                    <span className='p-2 text-muted'>2 Hours Ago</span>
                                </div>
                            </div>
                            <div className='row mt-2'>
                                <div className='col-12'>
                                    <p>
                                        {postDetail.description}
                                    </p>
                                </div>
                            </div>
                            <div className='row my-3'>
                                <div className='col-6 d-flex'>
                                    <i className="ps-2 fs-4 fa-regular fa-heart"></i>
                                    <i className="ps-3 fs-4 fa-regular fa-comment"></i>
                                    <i className="ps-3 fs-4 fa-solid fa-location-arrow"></i>
                                </div>
                                <div className='col-12 mt-3 ms-2'>
                                    <span className='fs-6 fw-bold'>
                                        200 likes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={showPost} onHide={handlePostClose} size='lg' centered>
                <Modal.Header closeButton>
                    <span className='fw-bold fs-5'>Upload Post</span>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col-md-6 col-sm-12 mb-3'>
                            <div className='upload-box d-flex flex-column justify-content-center align-content-center'>
                                <div className='dropZoneContainer'>
                                    <input type="file" name="file" id='drop_zone' className='FileUpload' accept='.jpg,.png,.gif' onChange={handleFileSelect} />
                                    <div className="dropZoneOverlay d-flex flex-column">
                                        {image.preview && <img src={image.preview} width='150' height='150' />}
                                        <span><i className="fa-solid fa-cloud-arrow-up fs-1 upload-icon"></i></span>
                                        <br />
                                        Upload Photo From Computer
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6 col-sm-12 d-flex flex-column justify-content-between'>
                            <div className='row'>
                                <div className='col-sm-12 mb-3'>
                                    <div className="form-floating">
                                        <textarea onChange={(ev) => setCaption(ev.target.value)} className="form-control" placeholder="Add Caption" id="floatingTextarea"></textarea>
                                        <label htmlFor="floatingTextarea">Add Caption</label>
                                    </div>
                                </div>
                                <div className='col-sm-12'>
                                    <div className="form-floating mb-3">
                                        <input type="text" onChange={(ev) => setLocation(ev.target.value)} className="form-control" placeholder="Add Location" />
                                        <label htmlFor="floatingInput"><i className="fa-solid fa-location-dot px-2"></i>Add Location</label>
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-sm-12'>
                                    {loading ? <div className='col-md-12 mt-3 text-center'>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div> : ''}
                                    <button type="submit" onClick={() => addPost()} className="custom-btn custom-btn-pink px-5 px-md-5 float-end">
                                        <span className='fs-6 fw-600'>Post</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default Profile