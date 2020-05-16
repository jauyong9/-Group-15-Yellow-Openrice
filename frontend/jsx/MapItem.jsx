/*
  This class is the map item page. It is only for all users and it displays restaurants in map from datasource
*/

class MapItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickWhereAmI = this.handleClickWhereAmI.bind(this);
  }

  handleClickWhereAmI() {
    console.log(this.props.userLon)
    console.log(this.props.userLat)
    this.props.handleChangeMapPos(this.props.userLon, this.props.userLat)
  }

  render() {
    return (
      <section id="map" className="col-sm col-md-7 col-lg-8 card p-3 mt-3">
        {(this.props.userLat != 0 && this.props.userLon != 0) ? (
          <div>
          <h5>You are currently at (longitude: {Math.floor(this.props.userLon)}  latitude: {Math.floor(this.props.userLat)})</h5>
          <button className="btn btn-warning" onClick={this.handleClickWhereAmI} style={{float: 'right'}}>Where Am I?</button>
          </div>
        ) : <h5><i>Detecting your location...</i></h5>}
        <iframe src={`map.html?lat=${this.props.lat}&lon=${this.props.lon}&zoom=${this.props.zoom}&userLat=${this.props.userLat}&userLon=${this.props.userLon}&showDir=${this.props.showDir}`} height={350}>

        </iframe>
        <a href="map.html"> Detailed Map (beta version)</a>
      </section>
    );
  }
}
