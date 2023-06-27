/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

import { PanelBody, SelectControl } from '@wordpress/components';

/**
 * Import PostCard component
 */
import PostCard from './postCard';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */

const Edit = ( { attributes, setAttributes } ) => {
	const { useSelect } = wp.data;
	const { posts = [] } = attributes;

	// Get all posts
	const postsArray = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'postType', 'post', {
			status: 'publish',
			per_page: -1,
			order: 'asc',
			order_by: 'menu_order',
		} );
	} );

	// Get all categories
	const categories = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'taxonomy', 'category', {
			per_page: -1,
		} );
	} );

	// Get all media
	const media = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'postType', 'attachment', {
			per_page: -1,
		} );
	} );

	// Create an array of options for the select field
	const selectOptions = [];

	if ( postsArray ) {
		selectOptions.push( { value: null, label: 'None', disabled: true } );
		postsArray.forEach( ( post ) => {
			selectOptions.push( {
				value: post.id,
				label: post.title.rendered,
			} );
		} );
	} else {
		selectOptions.push( { value: 0, label: 'Loading...' } );
	}

	// Set attributes from select field
	const setAttributesFromSelect = ( value ) => {
		// convert value to integer
		value = parseInt( value );

		// if value is found in object.id in posts array, remove it
		if ( posts.find( ( post ) => post.id === value ) ) {
			setAttributes( {
				posts: posts.filter( ( post ) => post.id !== value ),
			} );
		}
		// if object with value is not in the array, find the post by id and add it
		else {
			// find post
			const foundPost = postsArray.find( ( post ) => post.id === value );
			// set categories
			foundPost.categories = foundPost.categories.map( ( category ) =>
				categories.find( ( cat ) => cat.id === category )
			);
			// set featured image
			foundPost.featured_image_src = media.find(
				( image ) => image.id === foundPost.featured_media
			)?.source_url;

			setAttributes( { posts: [ ...posts, foundPost ] } );
		}
	};

	// Render the block components
	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title="Selected Posts" initialOpen={ true }>
					<SelectControl
						multiple
						label={ __( 'Select Posts:' ) }
						value={ posts.map( ( post ) => post.id ) }
						options={ selectOptions }
						onChange={ setAttributesFromSelect }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls />
			{ posts.length === 0 ? (
				<p className="post-list__message">Select posts to display</p>
			) : (
				<ul className="post-list">
					{ posts?.map( ( post ) => (
						<PostCard post={ post } key={ post.id } edit />
					) ) }
				</ul>
			) }
		</div>
	);
};

export default Edit;
