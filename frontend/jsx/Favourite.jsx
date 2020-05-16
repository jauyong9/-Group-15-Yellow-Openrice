/*
  class Favourite
  This class is the favourite page
*/

class Favourite extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    window.history.pushState({page: 'Favourite'}, null, `?page=favourite`);

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'authorization': this.props.token }
    };
    fetch(this.props.URL + '/favourite', requestOptions)
      .then(data => data.json())
      .then((data) => {
        this.setState({
            data: data
        })
      });

      this.getRests = this.getRests.bind(this);
  }

  getRests() {
    let fav_list = this.state.data;
    if(fav_list.length == 0){
      return <center>No favourite restaurant added.</center>
    } else {
      return fav_list.map((rest) =>
      <tr>
        <td>{rest.name}</td>
      </tr>
    );
    }

  }

  render() {
    return (
      <div>
        <h3>Favourite Restaurants</h3>
        <div id="restlist" className="table-responsive">
          <table className="table table-striped table-bordered table-hover">

          {this.getRests()}
          </table>
          </div>
      </div>
    );
  }
}
