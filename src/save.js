/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */

/**
 * Import PostCard component
 */
import PostCard from './postCard';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */

const save = ( { attributes } ) => {
	const { posts, align } = attributes;

	// Set classes based on alignment
	const classes = align ? `post-list align${ align }` : 'post-list';

	return (
		<ul className={ classes }>
			{ posts?.map( ( post ) => (
				<PostCard post={ post } key={ post.id } />
			) ) }
		</ul>
	);
};

export default save;
