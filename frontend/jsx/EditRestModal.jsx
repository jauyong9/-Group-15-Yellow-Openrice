/*
  class EditRestModal:
  This class is the pop up windows for editing restaurant.
*/

class EditRestModal extends React.Component {

  constructor(props) {
      super(props);
      this.handleSave = this.handleSave.bind(this);
      this.state = {
          restId: '',
          name: '',
          longitude: '',
          latitude: '',
          description: ''
      }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        restId: nextProps.restId,
        name: nextProps.name,
        longitude: nextProps.longitude,
        latitude: nextProps.latitude,
        description: nextProps.description
    });
  }

  nameHandler(e) {
      this.setState({ name: e.target.value });
  }

  longitudeHandler(e) {
      this.setState({ longitude: e.target.value });
  }

  latitudeHandler(e) {
      this.setState({ latitude: e.target.value });
  }

  descriptionHandler(e) {
      this.setState({ description: e.target.value });
  }

  handleSave(restId) {
      const item = this.state;
      this.props.saveModalDetails(restId, item)
  }

  render() {
      return (
          <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                  <div className="modal-content">
                      <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Edit Restaurant</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div className="modal-body">
                          <p>
                            <span className="modal-lable">Name:</span>
                            <input className="form-control" value={this.state.name} onChange={(e) => this.nameHandler(e)} /></p>
                          <p>
                            <span className="modal-lable">longitude:</span>
                            <input className="form-control" value={this.state.longitude} onChange={(e) => this.longitudeHandler(e)} /></p>
                          <p>
                            <span className="modal-lable">Latitude:</span>
                            <input className="form-control" value={this.state.latitude} onChange={(e) => this.latitudeHandler(e)} /></p>
                          <p>
                            <span className="modal-lable">Description:</span>
                            <textarea className="form-control" value={this.state.description} onChange={(e) => this.descriptionHandler(e)} />
                          </p>
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                          <button type="button" className="btn btn-primary" data-dismiss="modal"
                                  onClick={() => { this.handleSave(this.state.restId) }}>Save Changes</button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }
}
