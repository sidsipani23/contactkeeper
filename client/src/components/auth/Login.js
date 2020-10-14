import React, { useState, useContext, useEffect } from "react";
import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";
const Login = (props) => {
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
		password2: "",
	});

	const authContext = useContext(AuthContext);
	const { error, clearErrors, isAuthenticated, login } = authContext;
	const alertContext = useContext(AlertContext);
	const { setAlert } = alertContext;
	const { email, password } = user;
	const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
	const onSubmit = (e) => {
		e.preventDefault();
		if (email === "" || password === "") {
			setAlert("Please fill in all fields", "danger");
		} else {
			login({ email, password });
		}
	};
	useEffect(() => {
		if (isAuthenticated) {
			props.history.push("/");
		}
		if (
			error === "Invalid credentials: Check the email id!" ||
			error === "Invalid credentials: The password is incorrect"
		) {
			setAlert(error, "danger");
			clearErrors();
		}
		//eslint-disbale-next-line
	}, [error, isAuthenticated, props.history]);
	return (
		<div className='form-container'>
			<h1>
				Account <span className='text-primary'>Login</span>
			</h1>
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<label htmlFor='email'>Email ID</label>
					<input type='email' name='email' value={email} onChange={onChange} />
				</div>
				<div className='form-group'>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						name='password'
						value={password}
						onChange={onChange}
					/>
				</div>

				<input
					type='submit'
					value='Login'
					className='btn btn-primary btn-block'
				/>
			</form>
		</div>
	);
};

export default Login;
