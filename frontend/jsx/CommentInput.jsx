/*
  This class is the comment input component i.e. the input box of the comment area.
*/
    class CommentInput extends React.Component {

      constructor(props) {
        super(props)
        this.state = {content: ''}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handlePostComment = this.handlePostComment.bind(this)
      }

      handlePostComment() {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'authorization': this.props.token },
            body: JSON.stringify({  content: this.state.content })
        };
        fetch(this.props.URL + '/comment/' + this.props.restId, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.response == 'success') {
                  toastada.success('You have successfully left a comment!');
                  this.setState({content: ''});
                  this.props.reloadComment();
              }
              else {
                  toastada.error('Failed: ' + data.message)
              }
            });

      }

      handleInputChange(e){
          const target = e.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.setState({
              [name]: value
          });
      }

      render() {
        return (
          <div className={"message"}>
            <div style={{display: 'flex'}}>
            <img src={this.props.user.iconUrl} alt="Avatar"/>
            <textarea
              placeholder={`Commenting publicly as ${this.props.user.name}`}
              name="content"
              style={{flexGrow: 100, resize: 'none'}}
              value={this.state.content}
              onChange={this.handleInputChange}
            />
            </div>
            <br />
            <button className="btn btn-warning" style={{float: 'right'}} onClick={this.handlePostComment}>COMMENT</button>
          </div>
        );
      }
    }
