/*
  class Comment:
  This class is the comment component.
*/
// Format current time-date for new comment
function Comment(props) {
  const timeSince = (date) =>  {
      var seconds = Math.floor((new Date() - date) / 1000);

      var interval = Math.floor(seconds / 31536000);

      if (interval >= 1) {
        return interval + " years ago";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        return interval + " months ago";
      }
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        return interval + " days ago";
      }
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) {
        return interval + " hours ago";
      }
      interval = Math.floor(seconds / 60);
      if (interval >= 1) {
        return interval + " minutes ago";
      }
      return Math.floor(seconds) + " seconds ago";
  }
  // Div for each comment
  if (props.user) {
    return (
      <div className={"message"}>
        <img src={props.user.iconUrl} alt="Avatar" />
        <span className="name">{props.user.name}</span> &nbsp;
        <span style={{color: '#9b870c'}}>({props.user.type})</span> &nbsp;
        <span className="time">{timeSince(Date.parse(props.time))}</span>
        <p>
          {props.content}
        </p>
      </div>
    );
  } else {
    return(
      <div className={"message"}>
        <img src={"https://image.flaticon.com/icons/svg/21/21104.svg"} alt="Avatar" />
        <p style={{fontStyle: 'italic'}}>
          {'This user has been deleted/deactivated. Press "F" to pay respects.'}
        </p>
      </div>
    );
  }
}
