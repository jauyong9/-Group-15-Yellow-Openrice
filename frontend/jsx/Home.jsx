/*
  Class Home:
  This class is the home page.
*/
    class Home extends React.Component {
      constructor(props) {
        super(props)
        this.state = {lon: 0, lat: 0, zoom: 0, userLat: 0, userLon: 0, showDir: 0}
        this.handleChangeMapPos = this.handleChangeMapPos.bind(this);
        this.handleChangeUserPos = this.handleChangeUserPos.bind(this);
        this.handleShowDir = this.handleShowDir.bind(this);
        window.history.replaceState({page: 'Home'}, null, `?page=home`);
      }
      // Handle the center position of the map
      handleChangeMapPos(longitude, latitude, zoom=15) {
        this.setState({lon: longitude, lat: latitude, zoom: zoom, showDir: 0})
      }
      // Set user's geolocation according to gps
      handleChangeUserPos(longitude, latitude) {
        this.setState({userLon: longitude, userLat: latitude})
      }
      // Show route to selected restaurant
      handleShowDir(e) {
        e.stopPropagation();
        console.log(this.state)
        this.setState({showDir: 1}, () => console.log(this.state))

      }
      // List of closest restaurants and a map div to mark all restaurants
      render() {
        return (
            <div className="row">
              <MapItem  lat={this.state.lat}
                        lon={this.state.lon}
                        zoom={this.state.zoom}
                        userLat={this.state.userLat}
                        userLon={this.state.userLon}
                        showDir={this.state.showDir}
                        handleChangeMapPos={this.handleChangeMapPos}
              />
              <ClosestRestaurant URL={this.props.URL}
                                  k={5}
                                  handleChangePage={this.props.handleChangePage}
                                  handleChangeMapPos={this.handleChangeMapPos}
                                  handleChangeUserPos={this.handleChangeUserPos}
                                  handleShowDir={this.handleShowDir}
              />
            </div>
          );
      }
    }
