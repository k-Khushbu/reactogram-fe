import React, { useState } from 'react'
import './Signup.css';
import socialDesktop from '../images/social-desktop.PNG';
import socialMobile from '../images/social-mobile.PNG';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { API_BASE_URL } from '../../src/config'
import Swal from 'sweetalert2'

export const Signup = () => {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const Signup = (event) => {
        event.preventDefault();
        setLoading(true);
        // debugger;
        const requestData = {fullName: fullName, email, password};
        axios.post(`${API_BASE_URL}/signup`, requestData)
        .then((result)=>{
            // debugger;
            if(result.status === 201){
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'User sccessfully registered'
                })
            }
            setFullName('');
            setEmail('');
            setPassword('');
        })
        .catch((error)=>{
            console.log(error);
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Some error occured. Please, try again later!'
            })
        })
    }

    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-7 col-sm-12 d-flex justify-content-center align-items-center">
                    <img className='socialDesktop' style={{ height: '85%' }} src={socialDesktop} alt="socialDesktop" />
                    <img className='socialMobile' src={socialMobile} alt="socialMobile" />
                </div>
                <div className="col-md-5 col-sm-12">
                    <div className="card shadow">
                        { loading ? <div className='col-md-12 mt-3 text-center'>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div> : ''}
                        <div className="card-body px-5">
                            <h4 className="card-title text-center mt-3 fw-bold">Sign Up</h4>
                            <form onSubmit={(e) => Signup(e)}>
                                <div className="mb-3">
                                    <input type="text" className="form-control input-bg p-2" id="text" placeholder='Phone' />
                                </div>
                                <div className="mb-3">
                                    <input type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} className="form-control input-bg p-2" id="text" placeholder='Email' />
                                </div>
                                <div className="mb-3">
                                    <input type="text" value={fullName} onChange={(ev) => setFullName(ev.target.value)} className="form-control input-bg p-2" id="text" placeholder='Full Name' />
                                </div>
                                <div className="mb-3">
                                    <input type="password" value={password} onChange={(ev) => setPassword(ev.target.value)} className="form-control input-bg p-2" id="password" placeholder="Password" />
                                </div>
                                <div className='d-grid mt-3'>
                                    <button type="submit" className="custom-btn custom-btn-blue">Sign Up</button>
                                </div>
                                <div className='my-4'>
                                    <hr className='text-muted' />
                                    <h5 className='text-muted text-center'>OR</h5>
                                    <hr className='text-muted' />
                                </div>
                                <div className='mt-3 mb-5 d-grid'>
                                    <button type="submit" className="custom-btn custom-btn-white">
                                        <span className='text-muted fs-6'>Already have an account?</span>
                                        <Link to="/login" className='ms-1 text-info fw-bold'>Log In</Link>
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;