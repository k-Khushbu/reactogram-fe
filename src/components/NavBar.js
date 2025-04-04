import React, { useEffect } from 'react'
import './NavBar.css';
import logo from '../images/logo.PNG';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Card.css';

const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.userReducer);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });
        navigate("/login");
    }
    
    return (
        <div>
            <nav className="navbar navbar-light bg-light shadow">
                <div className="container-fluid px-0">
                    <NavLink className="navbar-brand ms-5" to='/'>
                        <img src={logo} alt='logo' height="45px" />
                    </NavLink>
                    <form className="d-flex me-md-5">
                        <input className="form-control me-2 text-muted searchbox" type="search" placeholder="Search" aria-label="Search" />
                        <a className="nav-link text-dark fs-5" to='#'><i className="fa-solid fa-magnifying-glass searchIcon"></i></a>
                        <NavLink className="nav-link text-dark fs-5" to='/posts'><i className="fa-solid fa-house"></i></NavLink>
                        {localStorage.getItem("token") != null ? <NavLink className="nav-link text-dark fs-5" href='#'><i className="fa-regular fa-heart"></i></NavLink> : ''}

                        <div className="dropdown">
                            {localStorage.getItem("token") != null ? <> <a className="btn" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">
                                <img className='navbar-profile-pic' alt="profile-pic" src='https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
                            </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <NavLink className="dropdown-item mt-0" to='/myprofile'>My Profile</NavLink>
                                    </li>
                                    <li><a className="dropdown-item" href="#" onClick={() => logout()}>Logout</a></li>
                                </ul> </> : ''}
                        </div>
                    </form>
                </div>
            </nav>
        </div>
    )
}

export default NavBar;