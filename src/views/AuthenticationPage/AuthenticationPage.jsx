import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import './AuthenticationPage.css';

const typeForm = {
    LOGIN: "LOGIN",
    REGISTER: "REGISTER"
}

const AuthenticationPage = () => {
    const navigate = useNavigate();
    const { setIsShowAuthModal, setProfileInfo } = useUser();

    const [isShowing, setIsShowing] = useState(false);
    const [type, setType] = useState(typeForm.LOGIN);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    useEffect(() => {
        setIsShowing(true);
    }, []);

    const handleSubmitLogin = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_CHARACTER_AI_URL}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            const data = await response.json();
            if (data.message === "Auth successful") {
                localStorage.removeItem("token");
                localStorage.setItem("token", data.token);
                setIsShowAuthModal(false);
                setProfileInfo();
                navigate("/");
                // window.location.reload();
            } else {
                alert("Đăng nhập thất bại");
            }
        }
        catch (error) {
            console.log("error", error);
        }
    }

    return (
        <div className="authentication-form-container">
            <div
                className="authentication-form__opacity"
                onClick={() => { setIsShowAuthModal(false) }}
            ></div>
            <div className={"authentication-form__outer" + (isShowing && " isShowing")}>
                {
                    type === typeForm.LOGIN ?
                        (<div className="authentication-form">
                            <div className="authentication-form__title">
                                <h1>Đăng nhập</h1>
                            </div>
                            <div className="authentication-form__input">
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                    placeholder="Tên người dùng"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    placeholder="Mật khẩu"
                                />
                            </div>
                            <div className="authentication-form__btn-forgotPass">
                                <button>Quên mật khẩu?</button>
                            </div>
                            <button
                                className="authentication-form__button"
                                onClick={() => { handleSubmitLogin() }}
                            >Đăng nhập</button>
                            <div className="authentication-form__action">
                                <span>Chưa có tài khoản?</span>
                                <button
                                    onClick={() => {
                                        setUsername("");
                                        setPassword("");
                                        setRePassword("");
                                        setType(typeForm.REGISTER);
                                    }}
                                >Đăng ký</button>
                            </div>
                        </div>) :
                        (<div className="authentication-form">
                            <div className="authentication-form__title">
                                <h1>Đăng ký</h1>
                            </div>
                            <div className="authentication-form__input">
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                    placeholder="Tên người dùng"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}
                                    placeholder="Mật khẩu"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={rePassword}
                                    onChange={(e) => { setRePassword(e.target.value) }}
                                    placeholder="Nhập lại mật khẩu"
                                />
                            </div>
                            <button className="authentication-form__button">Đăng ký</button>
                            <div className="authentication-form__action">
                                <span>Đã có tài khoản?</span>
                                <button
                                    onClick={() => {
                                        setUsername("");
                                        setPassword("");
                                        setRePassword("");
                                        setType(typeForm.LOGIN);
                                    }}
                                >Đăng nhập</button>
                            </div>
                        </div>)
                }
            </div>
        </div>
    );
};

export default AuthenticationPage;