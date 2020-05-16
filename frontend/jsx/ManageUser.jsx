/*
  This class is the manage user page. It is only for admin and it handles CRUD on users
*/
    class ManageUser extends React.Component {

      constructor(props) {
        super(props);
        this.state = {
          requiredItem: 0,
          data: [],
          nameError: '',
          emailError: '',
          passwordError: '',
          email: '',
          name: '',
          password: '',
          edit_userId: '',
          edit_name: '',
          edit_password: ''
        };
        window.history.pushState({page: 'ManageUser'}, null, `?page=manageuser`);
        this.handleDelete = this.handleDelete.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.addUser = this.addUser.bind(this);
        this.generateError = this.generateError.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.replaceModalItem = this.replaceModalItem.bind(this);
        this.saveModalDetails = this.saveModalDetails.bind(this);

        const requestOptions = {method: 'GET'};
        fetch(this.props.URL + '/users', requestOptions)
          .then(data => data.json())
          .then((data) => {
            this.setState({
                data: data
            })
          });
      }

      replaceModalItem(index, user) {
        this.setState({
          requiredItem: index,
          edit_userId: user.userId,
          edit_name: user.name,
          edit_password: user.password
        });
      }

      saveModalDetails(userId, item) {
        const requestOptions = {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'authorization': this.props.token },
              body: JSON.stringify({
                name: item.name,
                password: item.password
              })
          };

        fetch(this.props.URL + '/user/' + userId, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.response == 'success') {
                toastada.success('You have successfully updated the user information.');

                window.location.reload();
              }
              else {
                  toastada.error('Failed: ' + data.message)
              }
            });

      }


      getUsers() {
        let user_list = this.state.data;
        return user_list.map((user, index) =>
          <tr>
            <td>{user.userId}</td>
            <td>{user.type}</td>
            <td>{user.email}</td>
            <td>{user.name}</td>
            <td>{user.joinDate}</td>
            <td>
              <button className="btn" data-toggle="modal" data-target="#exampleModal"
                onClick={() => this.replaceModalItem(index, user)}>
                <i className="fa fa-edit" style={{color: "#007bff"}} > </i>
              </button>
              <button
                className="btn"
                value={user.userId}
                onClick={() => { if(window.confirm('Are you sure to delete?')) this.handleDelete(user.userId) }}>
                <i className="fa fa-trash-o" style={{color: "#dc3545"}} > </i>
              </button>
            </td>
          </tr>
        );
      }

      addUser() {

        var hasError = this.generateError();
        var password = this.state.password;

        if (hasError == false) {
          // Simple POST request with a JSON body using fetch
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({  email: this.state.email,
                                      name: this.state.name,
                                      password: this.state.password})
          };
          fetch(this.props.URL + '/register/', requestOptions)
                .then(response => response.json())
                .then(data => {
                  if (data.response == 'success') {
                      toastada.success('You have successfully add a new user.');
                      //this.props.reloadUser();
                      this.setState({
                        nameError: '',
                        emailError: '',
                        passwordError: '',
                        email: '',
                        name: '',
                        password: ''
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

      handleDelete(id) {
        var userId = id;
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch(this.props.URL + '/user/' + userId, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.response == 'success') {
                  toastada.success('You have successfully deleted a user!');
                  this.setSate({data: data});
              }
              else {
                  toastada.error('Failed: ' + data.message)
              }
            });
        window.location.reload();
      }

      componentDidMount() {
        // Hide add user form
        $(".form2").hide();
      }

      ClickAddUser() {
        $("#addUserForm").fadeIn();
      }

      cancel() {
        $("#addUserForm").fadeOut();
      }

      handleInputChange(e){
          const target = e.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.setState({
              [name]: value
          });
      }

      isEmail(mail) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return mail.match(mailformat) != null;
      }

      generateError() {
        let hasError = false;

        if (this.state.name == '') {
          this.setState({nameError: 'User name must not be empty'});
          hasError = true;
        }
        else {
          this.setState({nameError: ''});
        }

        if (!this.isEmail(this.state.email)) {
          this.setState({emailError: 'Email format incorrect!'});
          hasError = true;
        }
        else {
          this.setState({emailError: ''});
        }

        if (this.state.password == '') {
          this.setState({
            passwordError: 'Password cannot be empty.',
          });
          hasError = true;
        }
        else {
          this.setState({
            passwordError: ''
          });
        }

        return hasError;
      }

      render() {
        let inputError = {
          fontSize: 'small',
          color: 'red',
          paddingLeft: '20px'
        };
        return(
          <div>
            <h3>Manage Users</h3>
            <button className="float-leftx btn btn-outline-success mb-3" onClick={this.ClickAddUser}>Add User</button>
            <div className="form2 col-md-6" id="addUserForm">
                    <section id="inner-wrapper" className="mb-2">
                      <article>
                        <form>
                          <div className="form-group">
                            <div className="input-group">
                              <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Email Adress"
                                name="email"
                                onChange={this.handleInputChange}
                                value={this.state.email}
                              />
                            </div>
                            <p style={inputError}>{this.state.emailError}</p>
                          </div>
                          <div className="form-group">
                            <div className="input-group">
                              <input
                                id="name"
                                type="text"
                                className="form-control"
                                placeholder="User Name"
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
                                id="password"
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="User Password"
                                onChange={this.handleInputChange}
                                value={this.state.password}
                              />
                            </div>
                            <p style={inputError}>{this.state.passwordError}</p>
                          </div>
                        </form>
                        <div>
                            <button className="btn btn-sm btn-outline-dark float-left mb-3" onClick={this.cancel}>Cancel</button>
                            <button className="btn btn-outline-success btn-sm float-right mb-3" onClick={this.addUser}>Submit</button>
                        </div>
                      </article>
                    </section>
                  </div>

            <div id="userlist" className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <tr><th>User ID</th><th>User Type</th><th>Email</th><th>Name</th><th>Join Date</th><th></th></tr>
              {this.getUsers()}
              </table>
              <EditUserModeal
                userId={this.state.edit_userId}
                name={this.state.edit_name}
                password={this.state.edit_password}
                saveModalDetails={this.saveModalDetails}
              />
              </div>
          </div>
        );
      }
    }
