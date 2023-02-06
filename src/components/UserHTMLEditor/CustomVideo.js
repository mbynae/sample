import Quill from "quill";

const Video = Quill.import("formats/video");

const ATTRIBUTES = [
	"alt",
	"height",
	"width",
	"class",
	"style" // Had to add this line because the style was inlined
];

class CustomVideo extends Video {
	static create(props){
		let node = super.create();
		
		node.setAttribute("src", props);
		ATTRIBUTES.forEach(attr => {
			props[attr] && node.setAttribute(attr, props[attr]);
		});
		
		// Set non-format related attributes with static values
		node.setAttribute("frameborder", "0");
		node.setAttribute("allowfullscreen", true);
		
		return node;
	}
	
	static formats(domNode){
		return ATTRIBUTES.reduce((formats, attribute) => {
			const copy = { ...formats };
			
			if ( domNode.hasAttribute(attribute) ) {
				copy[attribute] = domNode.getAttribute(attribute);
			}
			
			return copy;
		}, {});
	}
	
	static value(node){
		return ATTRIBUTES.reduce(
			(attrs, attribute) => {
				const copy = { ...attrs };
				
				if ( node.hasAttribute(attribute) ) {
					copy[attribute] = node.getAttribute(attribute);
				}
				
				return copy;
			},
			{ src: node.getAttribute("src") }
		);
	}
	
	format(name, value){
		if ( ATTRIBUTES.indexOf(name) > -1 ) {
			if ( value ) {
				this.domNode.setAttribute(name, value);
			} else {
				this.domNode.removeAttribute(name);
			}
		} else {
			super.format(name, value);
		}
	}
}

export default CustomVideo;
