import React       from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link        from "@material-ui/core/Link";

function handleClick(event){
	event.preventDefault();
}

const ActiveLastBreadcrumb = props => {
	
	let breadcrumbs = props.breadcrumbs;
	
	return (
		<Breadcrumbs separator="›" aria-label="breadcrumb">
			{
				breadcrumbs.map((breadcrumb, index) => (
					<span
						key={breadcrumb.title}
						color={(breadcrumbs.length - 1) === index ? "textPrimary" : "inherit"}
						href={breadcrumb.href}
						onClick={handleClick}
						aria-current="page">
						{breadcrumb.title}
					</span>
				))
			}
		</Breadcrumbs>
	);
};

export default ActiveLastBreadcrumb;
