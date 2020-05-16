/*
  class Restaurant
  This class is the restaurant page. It shows details info about the restaurant such as latitude, longitude and comments
*/
    class Restaurant extends React.Component {
      constructor(props) {
        super(props);

        const requestOptions = {
            method: 'GET'
        };

        this.state = {rest: null, liveReload: true}

        // Add 1 More View
        fetch(props.URL + '/view/restaurant/' + props.restId, requestOptions)
          .then(response => response.json())
          .then(data => {
            // Get Restaurant Object
            fetch(props.URL + '/restaurant/' + props.restId, requestOptions)
              .then(response => response.json())
              .then(data => {
                this.setState({rest: data.restaurant[0]})
              });
          });


        window.history.pushState({page: 'Restaurant'}, null, `?page=restaurant&restId=${props.restId}`);

        this.handleLike = this.handleLike.bind(this)

        this.handleDislike = this.handleDislike.bind(this)

        this.handleAddFavourtieRest = this.handleAddFavourtieRest.bind(this)

        this.reloadRest = this.reloadRest.bind(this)

        this.reloadComment = this.reloadComment.bind(this)
      }

      componentDidMount() {
        setInterval(this.reloadComment, 1500);
      }

      reloadComment() {
        // Reload Restaurant Object
        var _this = this;
        if (this.state.liveReload) {
          const requestOptions = {
              method: 'GET'
          };
          fetch(this.props.URL + '/restaurant/' + this.state.rest.restId, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.restaurant[0].comments.length != this.state.rest.comments.length) {
                  this.setState({rest: data.restaurant[0]})
              }
            }).catch(function(err) {_this.setState({liveReload: false})});
        }
      }

      reloadRest() {
        // Reload Restaurant Object
        const requestOptions = {
            method: 'GET'
        };
        fetch(this.props.URL + '/restaurant/' + this.state.rest.restId, requestOptions)
          .then(response => response.json())
          .then(data => {
            this.setState({rest: data.restaurant[0]})
          });
      }

      handleDislike() {
        // Dislike the restaurant
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'authorization': this.props.token }
        };

        fetch(this.props.URL + '/dislike/' + this.state.rest.restId, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.message == 'you have already rated this restaurant'){
                toastada.warning(data.message);
            }
            else if (data.response == 'fail') {
                toastada.error('Failed. You must login before rating');
            }
            else {
                this.reloadRest();
            }
          });
      }

      handleLike() {
        // Like the restaurant
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'authorization': this.props.token }
        };
        fetch(this.props.URL + '/like/' + this.state.rest.restId, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.message == 'you have already rated this restaurant'){
                toastada.warning(data.message);
            }
            else if (data.response == 'fail') {
                toastada.error('Failed. You must login before rating');
            }
            else {
                this.reloadRest();
            }
          });
      }

      handleAddFavourtieRest() {
        // Add restaurant to favourites
        const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'authorization': this.props.token }
        };
        fetch(this.props.URL + '/favourite/' + this.state.rest.restId, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.response == 'warn') {
                toastada.warning(data.message);
            }
            else if (data.response == 'fail') {
                toastada.error('Failed. You must login before add to favourites!');
            }
            else if (data.response == 'success') {
                toastada.success('You have added the restaurant to your favourites.');
                this.props.reloadUser();
            }
            else {
                this.reloadRest();
            }
          });

      }

      getComments() {
        let comments = [];
        let n = this.state.rest.comments.length;

        const sorted = this.state.rest.comments.reverse();

        for (let i = 0; i < n; i++) {
            comments.push(
              (<Comment user={sorted[i].postBy}
                        content={sorted[i].content}
                        time={sorted[i].time}
                        reloadComment={this.reloadComment}/>)
            );
        }

        return comments;
      }

      render() {
        if (this.state.rest == null) {
          return (
            <img src="../images/loading.gif" style={{width: 300, height: 300}}/>
          );
        }
        else {
          const liked = this.props.user && this.state.rest.likes.indexOf(this.props.user._id) != -1;
          const disliked = this.props.user && this.state.rest.dislikes.indexOf(this.props.user._id) != -1;
          const faved = this.props.user && this.props.user.favouriteRest.indexOf(this.state.rest._id) != -1;
          const likeImg = liked ? "../images/liked.png" : "../images/like.png"
          const dislikeImg = disliked ? "../images/disliked.png" : "../images/dislike.png"
          const favouriteImg = faved ? "../images/faved.png" : "../images/fav.png"
          const mapUrl = `https://maps.google.com/maps?q=${this.state.rest.latitude},${this.state.rest.longitude}&z=14&output=embed`;
          const commentInput = (
              <CommentInput user={this.props.user}
                            restId={this.state.rest.restId}
                            token={this.props.token}
                            URL={this.props.URL}
                            reloadComment={this.reloadComment}
              />
          )
          return (
            <div>
              <div className="row mt-3">
                <div className="col-12 col-sm-6 col-md-8">
                  <h2 className="d-inline mr-3">{this.state.rest.name}</h2>
                  <input className="d-inline" type="image" src={favouriteImg} style={{width: 25, height: 25}} onClick={this.handleAddFavourtieRest} />
                </div>
                <div className="col-6 col-md-4">
                  <div className="float-right">
                    <img src="../images/view.png" style={{width: 30, height: 40, paddingBottom: 10}}/> &nbsp;
                    {this.state.rest.views} &nbsp; &nbsp;
                    <input type="image" src={likeImg} style={{width: 20, height: 20}} onClick={this.handleLike}/> &nbsp;
                    {this.state.rest.likes.length} &nbsp; &nbsp;
                    <input type="image" src={dislikeImg} style={{width: 20, height: 20}} onClick={this.handleDislike}/> &nbsp;
                    {this.state.rest.dislikes.length} &nbsp; &nbsp;
                  </div>

                </div>
              </div>

            <iframe scrolling="no" marginHeight={0} marginWidth={0} src={mapUrl} width={'100%'} height={300} frameBorder={0}>
            </iframe>
              <hr />
              <div className="text-secondary" dangerouslySetInnerHTML={{ __html: this.state.rest.description }} />
              <hr />
              <h5>{this.state.rest.comments.length} Comments</h5>
              {this.props.user && commentInput}
              {this.getComments()}
            </div>
          );
        }
      }


    }
