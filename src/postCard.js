import placeholder from './images/placeholder.jpg';

const PostCard = ( { post, edit } ) => {
	// Convert post date to a more readable format
	const formattedDate = new Date( post.date ).toLocaleString( 'fi', {
		day: 'numeric',
		month: 'numeric',
		year: 'numeric',
	} );

	// Create a list of categories
	const categories = post.categories
		.filter( ( category ) => category.name !== 'Uncategorized' )
		.map( ( category ) => category.name )
		.join( ', ' );

	return (
		<li className="post-list__item">
			<a
				href={ ! edit && post.link }
				id={ post.id }
				className="post-list__item__wrapper"
			>
				<figure className="post-list__item__image">
					<img
						src={
							post.featured_image_src
								? post.featured_image_src
								: placeholder
						}
						alt={ post.title.rendered }
					/>
				</figure>
				<div className="post-list__item__content">
					<h2 className="post-list__item__content__title">
						{ post.title.rendered }
					</h2>
					<span className="post-list__item__content__date">
						{ formattedDate }
					</span>
					{ categories && (
						<span className="post-list__item__content__categories">
							{ categories }
						</span>
					) }
					<span className="post-list__item__content__link">
						<span className="text-content">Read More</span>
					</span>
				</div>
			</a>
		</li>
	);
};

export default PostCard;
