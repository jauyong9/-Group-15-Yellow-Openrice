/*
  class EditUserModeal:
  This class is the pop up windows for editing user.
*/

class EditUserModeal extends React.Component {

  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.state = {
      userId: '',
      name: '',
      password: ''
    }
  }
  // Set value for selected user for edit
  componentWillReceiveProps(nextProps) {
    this.setState({
      userId: nextProps.userId,
      name: nextProps.name,
      //password: nextProps.password
    });
}
/*
  Setters to set selected user's attributes on admin's input
*/
  nameHandler(e) {
      this.setState({ name: e.target.value });
  }

  passwordHandler(e) {
      this.setState({ password: e.target.value });
  }

  handleSave(userId) {
      const item = this.state;
      this.props.saveModalDetails(userId, item)
  }
// Popup form to edit selected user's info
render() {
    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Edit User</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>
                          <span className="modal-lable">Name:</span>
                          <input className="form-control" value={this.state.name} onChange={(e) => this.nameHandler(e)} /></p>
                        <p>
                          <span className="modal-lable">Password:</span>
                          <input className="form-control" type="password" value={this.state.password} onChange={(e) => this.passwordHandler(e)} /></p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-dismiss="modal"
                                onClick={() => { this.handleSave(this.state.userId) }}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
}
