import React, { Fragment } from "react";
import spinner from "./spinner.gif";

const Spinner = () => (
	<Fragment>
		<img
			src={spinner}
			alt='spinner_gif'
			style={{ width: "600px", margin: "auto", display: "block" }}
		/>
	</Fragment>
);
export default Spinner;
