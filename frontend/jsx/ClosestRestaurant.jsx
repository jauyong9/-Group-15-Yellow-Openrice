/*
  This class is the closest restaurants page.
*/

class ClosestRestaurant extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeSelectedRest = this.handleChangeSelectedRest.bind(this);
    this.getRestaurants = this.getRestaurants.bind(this);
    this.fetchKClosestRest = this.fetchKClosestRest.bind(this);
    this.fetchRest = this.fetchRest.bind(this);
    this.setPos = this.setPos.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.filterRestaurant = this.filterRestaurant.bind(this);
    this.state = {
      pos: '',
      isLoading: true,
      k: props.k,
      isBackgroundLoading: false,
      selectedRest: undefined,
      restaurants: '',
      filteredRestaurant: '',
      searchBarValue: ''
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPos, this.fetchRest);
    }
    else {
      this.fetchRest();
    }
  }

  setPos(pos) {
    this.setState({pos: pos})
    console.log(pos)
    this.props.handleChangeUserPos(pos.coords.longitude, pos.coords.latitude)
    this.fetchKClosestRest();
  }

  fetchRest() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    const url = `${this.props.URL}/restaurant`

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {

          if (data.response == 'success') {
              this.setState({restaurants: data.restaurants}, () => {
                this.setState({
                  filteredRestaurants: this.filterRestaurant(this.state.searchBarValue),
                  isLoading: false,
                  isBackgroundLoading: false
                })
              });
          }
        });
  }

  fetchKClosestRest() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    const url = `${this.props.URL}/closest_restaurants/${this.state.k}/${this.state.pos.coords.latitude}/${this.state.pos.coords.longitude}`

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {

          if (data.response == 'success') {
              this.setState({restaurants: data.restaurants}, () => {
                this.setState({
                  filteredRestaurants: this.filterRestaurant(this.state.searchBarValue),
                  isLoading: false,
                  isBackgroundLoading: false
                })
              });
          }
        });
  }
  filterRestaurant(searchText){
    return this.state.restaurants
      .filter(restaurants => {
        if(restaurants.name.toLowerCase().includes(
          searchText.toLowerCase())
        ){
          return true;
        }
        return false;
      });
  }
  handleSearchChange = event => {
    this.setState({
      searchBarValue: event.target.value
    });
    if(event.target.value != ''){
      this.setState({k: Number.MAX_VALUE, isBackgroundLoading: true}, () => {
        if(this.state.pos != '')
          this.fetchKClosestRest();
        this.setState({
          filteredRestaurants: this.filterRestaurant(this.state.searchBarValue),
          isLoading: false,
          isBackgroundLoading: false
        })
      });
    }else{
      this.setState({k: this.props.k, isBackgroundLoading: true}, () => {
        if(this.state.pos != '')
          this.fetchKClosestRest();
        this.setState({
          filteredRestaurants: this.filterRestaurant(this.state.searchBarValue),
          isLoading: false,
          isBackgroundLoading: false
        })
      });
    }
    document.getElementsByClassName("table-responsive")[0].scrollTo(0, 0);
  }

  handleChangeSelectedRest(rest) {
    this.setState({selectedRest: rest})
  }

  getRestaurants() {
    var restaurants = []

    for (let i = 0; i < this.state.filteredRestaurants.length; i++) {
      restaurants.push((
        <tr>
          <td>
            <RestShortInfo  rest={this.state.filteredRestaurants[i]}
                            handleChangePage={this.props.handleChangePage}
                            handleChangeMapPos={this.props.handleChangeMapPos}
                            handleChangeSelectedRest={this.handleChangeSelectedRest}
                            handleShowDir={this.props.handleShowDir}
                            selected={this.state.selectedRest && this.state.selectedRest.restId == this.state.filteredRestaurants[i].restId}
            />
          </td>
        </tr>
      ));
    }

    return restaurants
  }

  loadMore(e) {
    var obj = e.target

    if (obj.scrollTop + obj.clientHeight >= obj.scrollHeight-10 && !this.state.isBackgroundLoading && this.state.pos != '') {
      this.setState({k: this.state.k+3, isBackgroundLoading: true}, () => {
        this.fetchKClosestRest();
      });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <section className="col-sm col-md-5 col-lg-4 card p-3 mt-3">
          <h4 className="text-left px-4 ">Closest Restaurant</h4>
          <input className="form-control" value={this.state.searchBarValue} onChange={this.handleSearchChange} type="search" placeholder="Search" aria-label="Search"/>
          <img src="../images/loading.gif" style={{width: 300, height: 300}}/>
        </section>
      );
    }
    else if (this.state.searchBarValue != '' && this.state.filteredRestaurants.length == 0) {
      return (
        <section className="col-sm col-md-5 col-lg-4 card p-3 mt-3">
          <h4 className="text-left px-4 ">Closest Restaurant</h4>
          <input className="form-control" value={this.state.searchBarValue} onChange={this.handleSearchChange} type="search" placeholder="Search" aria-label="Search"/>
          <p>No Result Found</p>
        </section>
      );
    }
    else {
      return (
        <section id="closet-restaurant" className="col-sm col-md-5 col-lg-4 card p-3 mt-3">
          <h4 className="text-left px-4 ">Closest Restaurant</h4>
          <input className="form-control" value={this.state.searchBarValue} onChange={this.handleSearchChange} type="search" placeholder="Search" aria-label="Search"/>
          <div className="table-responsive" style={{maxHeight: 400, overflow: 'scroll'}} onScroll={this.loadMore}>
            <table id="table-closest-restaurant" className="table table-striped table-bordered table-hover mt-4">
            {this.getRestaurants()}
            </table>
            {this.state.searchBarValue == '' && this.state.isBackgroundLoading && <img src="../images/loading2.gif" style={{width: 50, height: 50}}/>}
          </div>
        </section>
      );
    }
  }
}
