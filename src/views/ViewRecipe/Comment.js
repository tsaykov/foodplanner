import React from 'react';
import Rating from 'material-ui-rating';


class Comment extends React.Component {


	render() {
  	    const comment = this.props;

        var postTime = new Date(0); // The 0 there is the key, which sets the date to the epoch
        postTime.setUTCSeconds(comment._ts);

        return (  
        <div className="comment">
                    <Rating 
                        name="read-only"
                        value={comment.rating}
                        size="small"
                        readOnly 
                    />
                <span><strong>{comment.author}</strong>&nbsp; on {postTime.toLocaleString()}</span>
                <div className="commentText">
                    {comment.text}
                </div>

        </div>  );
        }
}

export default Comment;
  