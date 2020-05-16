/*
  class ManageRest
  This class is the manage restaurant page. It is only for admin and it handles CRUD on restaurant
*/
    class ManageRest extends React.Component {

      constructor(props) {
        super(props);
        this.state = {
          requiredItem: 0,
          data: [],
          nameError: '',
          longError: '',
          latError: '',
          name: '',
          longitude: '',
          latitude: '',
          description: '',
          edit_restId: '',
          edit_name: '',
          edit_longitude: '',
          edit_latitude: '',
          edit_description: ''
        };
        window.history.pushState({page: 'ManageRest'}, null, `?page=managerest`);
        this.handleDelete = this.handleDelete.bind(this);
        this.getRests = this.getRests.bind(this);
        this.addRest = this.addRest.bind(this);
        this.generateError = this.generateError.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.ClickAddRest = this.ClickAddRest.bind(this);
        this.cancel = this.cancel.bind(this);
        this.getForm = this.getForm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.replaceModalItem = this.replaceModalItem.bind(this);
        this.saveModalDetails = this.saveModalDetails.bind(this);

        const url = this.props.URL + '/rests';
        const requestOptions = {method: 'GET'};
        fetch(url, requestOptions)
          .then(data => data.json())
          .then((data) => {
            this.setState({
                data: data
            })
          });
      }

      componentDidMount() {
        // Hide add rest form
        $(".form2").hide();
      }

      ClickAddRest() {
        $("#addRestForm").fadeIn();
      }

      cancel() {
        $("#addRestForm").fadeOut();
      }

      handleInputChange(e){
          const target = e.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.setState({
              [name]: value
          });
      }

      generateError() {
        let hasError = false;

        // Name Error
        if (this.state.name == '') {
          this.setState({nameError: 'Restaurant name must not be empty'});
          hasError = true;
        }
        else {
          this.setState({nameError: ''});
        }

        // longitude Error
        if (this.state.longitude == '') {
          this.setState({longError: 'Longitude cannot be empty.'});
          hasError = true;
        }
        else {
          this.setState({longError: ''});
        }

        //Latitude Error
        if (this.state.latitude == '') {
          this.setState({
            latError: 'Latitude cannot be empty.',
          });
          hasError = true;
        }
        else {
          this.setState({latError: ''});
        }

        return hasError;
      }

      addRest() {

        var hasError = this.generateError();

        if (hasError == false) {
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({  name: this.state.name,
                                      longitude: this.state.longitude,
                                      latitude: this.state.latitude,
                                      description: this.state.description
                                    })
          };
          fetch(this.props.URL + '/restaurant/', requestOptions)
                .then(response => response.json())
                .then(data => {
                  if (data.response == 'success') {
                      toastada.success('You have successfully add a new restaurant.');
                      //this.props.reloadUser();
                      this.setState({
                        nameError: '',
                        longError: '',
                        latError: '',
                        name: '',
                        longitude: '',
                        latitude: '',
                        description: ''
                      });

                  }
                  else {
                      toastada.error('Failed: ' + data.message)
                  }
                });

          this.cancel();

          window.location.reload();
        }
      }

      handleInputChange(e){
          const target = e.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.setState({
              [name]: value
          });
      }

      getForm() {
        return <div id="newRestTab" className="">
                <form>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span class="input-group-text">Name</span>
                      </div>
                      <input
                        id="restName"
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter restaurant name"
                        onChange={this.handleInputChange}
                        value={this.state.name}
                      />
                    </div>
                </form>
              </div>
      }

      replaceModalItem(index, rest) {
        this.setState({
          requiredItem: index,
          edit_restId: rest.restId,
          edit_name: rest.name,
          edit_longitude: rest.longitude,
          edit_latitude: rest.latitude,
          edit_description: rest.description
        });
      }

      saveModalDetails(restId, item) {

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'authorization': this.props.token },
            body: JSON.stringify({
              name: item.name,
              longitude: item.longitude,
              latitude: item.latitude,
              description: item.description
            })
        };

        fetch(this.props.URL + '/restaurant/' + restId, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.response == 'success') {
                toastada.success('You have successfully updated the restaurant details.');

                window.location.reload();
              }
              else {
                  toastada.error('Failed: ' + data.message)
              }
            });
      }

      getRests() {
        return this.state.data.map((rest, index) =>
          <tr>
            <td>{rest.restId}</td>
            <td>{rest.name}</td>
            <td>{rest.likes.length}</td>
            <td>{rest.dislikes.length}</td>
            <td>{rest.views}</td>
            <td>{rest.comments.length}</td>
            <td>
              <button className="btn pull-left" data-toggle="modal" data-target="#exampleModal"
                onClick={() => this.replaceModalItem(index, rest)}>
                <i className="fa fa-edit" style={{color: "#007bff"}} > </i>
              </button>
              <button
                className="btn pull-right"
                value={rest.restId}
                onClick={() => { if(window.confirm('Are you sure to delete?')) this.handleDelete(rest.restId) }}>
                <i className="fa fa-trash-o" style={{color: "#dc3545"}} > </i>
              </button>
            </td>
          </tr>
        );
    }

      handleDelete(id) {
        var restId = id;
        const url = this.props.URL + '/rest/' + restId;
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.response == 'success') {
                  toastada.success('You have successfully deleted a restaurant!');
                  this.setSate({data: data});
              }
              else {
                  toastada.error('Failed: ' + data.message)
              }
            });
        window.location.reload();
      }

      render() {
        let inputError = {
          fontSize: 'small',
          color: 'red',
          paddingLeft: '20px'
        };

        return (
          <div>
            <h3>Manage Restaurant</h3>
            <button className="float-leftx btn btn-outline-success mb-3" onClick={this.ClickAddRest}>Add Restaurant</button>
            <div className="form2 col-md-6" id="addRestForm">
                    <section id="inner-wrapper" className="mb-2">
                      <article>
                        <form>
                          <div className="form-group">
                            <div className="input-group">
                              <input
                                id="name"
                                type="text"
                                className="form-control"
                                placeholder="Restaurant Name"
                                name="name"
                                onChange={this.handleInputChange}
                                value={this.state.name}
                              />
                            </div>
                            <p style={inputError}>{this.state.nameError}</p>
                          </div>
                          <div className="form-group">
                            <div className="input-group">
                              <input
                                id="longitude"
                                type="text"
                                name="longitude"
                                className="form-control"
                                placeholder="Longitude"
                                onChange={this.handleInputChange}
                                value={this.state.longitude}
                              />
                            </div>
                            <p style={inputError}>{this.state.longError}</p>
                          </div>
                          <div className="form-group">
                            <div className="input-group">
                              <input
                                id="latitude"
                                type="text"
                                name="latitude"
                                className="form-control"
                                placeholder="Latitude"
                                onChange={this.handleInputChange}
                                value={this.state.latitude}
                              />
                            </div>
                            <p style={inputError}>{this.state.latError}</p>
                          </div>
                          <div className="form-group">
                            <div className="input-group">
                              <input
                                id="description"
                                type="text"
                                name="description"
                                className="form-control"
                                placeholder="Description"
                                onChange={this.handleInputChange}
                                value={this.state.description}
                              />
                            </div>
                          </div>
                        </form>
                        <div>
                            <button className="btn btn-sm btn-outline-dark float-left mb-3" onClick={this.cancel}>Cancel</button>
                            <button className="btn btn-outline-success btn-sm float-right mb-3" onClick={this.addRest}>Submit</button>
                        </div>
                      </article>
                    </section>
                  </div>
             <div id="restlist" className="table-responsive">

              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Likes</th><th>Dislikes</th><th>Views</th><th>Comments</th><th></th>
                  </tr>
                </thead>
                <tbody>{this.getRests()}</tbody>
              </table>
              <EditRestModal
                restId={this.state.edit_restId}
                name={this.state.edit_name}
                longitude={this.state.edit_longitude}
                latitude={this.state.edit_latitude}
                description={this.state.edit_description}
                saveModalDetails={this.saveModalDetails}
              />
              </div>
          </div>
        );
      }
    }
