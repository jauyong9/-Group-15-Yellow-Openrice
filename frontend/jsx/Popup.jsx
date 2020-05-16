/*
  This class is the pop up. It shows email successful message to registered users
*/

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    $('#myModal').on('hidden.bs.modal', function () {
      nextProps.handlePopupMsg(''); // change the pop message to empty when dismiss
    })
  }
  componentDidMount() {
    $("#myModal").modal('show');
  }
  render() {
    if (this.props.msg) {
      return (
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <img src="../images/email-banner.jpg" className="img-fluid" style={{height: '175px', width: '100%'}}/>
              </div>
              <div className="modal-body">
                <p>{this.props.msg}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return (<div></div>);
    }
  }
}
