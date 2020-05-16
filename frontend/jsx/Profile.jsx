/*
  class Profile
  This class is the profile page. It shows profile pic, name, etc. for the logged user
*/
    class Profile extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          password: '',
          againPassword: '',
          passwordError: '',
          againPasswordError: '',
          changeResult: ''
        };
        window.history.pushState({page: 'Profile'}, null, `?page=profile`);
        this.cancel = this.cancel.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.generateError = this.generateError.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.ClickChangePassword = this.ClickChangePassword.bind(this);
        this.handleChangeIcon = this.handleChangeIcon.bind(this);
        this.handleUploadIcon = this.handleUploadIcon.bind(this);
      }

      componentDidMount() {
        // Hide change password form
        $(".form2").hide();
      }

      ClickChangePassword() {
        $("#changePasswordForm").fadeIn();
      }

      cancel() {
        $("#changePasswordForm").slideUp();
        $("#newPassword").val('');
        $("#newRePassword").val('');
      }

      handleChangePassword() {
        console.log(this.props.token)
        var hasError = this.generateError();
        var password = this.state.password;
        if (hasError == false){
          if (password != null && password != '') {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'authorization': this.props.token },
                body: JSON.stringify({ password: password })
            };

            fetch(this.props.URL + '/password/', requestOptions)
                .then(response => response.json())
                .then(data => {
                  if (data.response == 'success') {
                      toastada.success('You have successfully changed your password');
                      this.props.reloadUser();

                  }
                  else {
                      toastada.error('Failed: ' + data.message)
                  }
                });
            this.cancel();
          }
        }
      }

      generateError() {
        let hasError = false;

        if (this.state.password != this.state.againPassword) {
          this.setState({
            passwordError: 'Two passwords must be equal.',
            againPasswordError: 'Two passwords must be equal.'
          });
          hasError = true;
        }
        else if (this.state.password == '') {
          this.setState({
            passwordError: 'Password cannot be empty.',
            againPasswordError: 'Password cannot be empty.'
          });
          hasError = true;
        }
        else {
          this.setState({
            passwordError: '',
            againPasswordError: ''
          });
        }

        return hasError;
      }

      handleInputChange(e){
          const target = e.target;
          const value = target.type === 'checkbox' ? target.checked : target.value;
          const name = target.name;
          this.setState({
              [name]: value
          });
      }

      handleUploadIcon() {

      }

      handleChangeIcon() {
        var iconUrl = prompt('Please enter the image url of your icon');

        if (iconUrl != null && iconUrl != '') {
          // Simple POST request with a JSON body using fetch
          const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'authorization': this.props.token },
              body: JSON.stringify({  iconUrl: iconUrl })
          };

          fetch(this.props.URL + '/icon/', requestOptions)
              .then(response => response.json())
              .then(data => {
                if (data.response == 'success') {
                    toastada.success('You have successfully updated your icon');
                    this.props.reloadUser();

                }
                else {
                    toastada.error('Failed: ' + data.message)
                }
              });
        }
      }

      handleClickUploadIcon() {
        document.getElementById('iconImg').click();
      }

      handleUploadIcon(event) {
        let photo = event.target.files[0];

        let formData = new FormData();

        formData.append("iconImg", photo);

        event.target.value = '';

        fetch(this.props.URL + '/upload-icon', {method: "POST", headers: { 'authorization': this.props.token }, body: formData})
        .then(response => response.json())
        .then(data => {
          console.log(data)
          toastada.success('You have successfully uploaded your icon');
          this.props.reloadUser();
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      }

      render() {
        if (this.props.user != null) {
          let inputError = {
            fontSize: 'small',
            color: 'red',
            paddingLeft: '20px'
          };
          return (
            <div className="mt-3">
              <div className="card px-4 pt-3">
                <center>
                <img src={this.props.user.iconUrl} style={{width: '150', height: '150', borderRadius: '50%', objectFit: 'cover'}} />
                <h1>{this.props.user.name}</h1>
                <p className="title">({this.props.user.type})</p>
                <p>{this.props.user.email}</p>
                <p>Join Date: {this.props.user.joinDate}</p>
                </center>

                <p><button type="submit" className="btn btn-warning btn-block" onClick={this.ClickChangePassword}>Change Password</button></p>

                    <center>
                  <div className="form2 col-8" id="changePasswordForm">
                    <section id="inner-wrapper" className="mb-2 mt-2">
                      <article>
                        <form id="passwordChangeForm">
                          <div className="form-group">
                            <div className="input-group">
                              <input
                                id="newPassword"
                                type="password"
                                className="form-control"
                                placeholder="New Password"
                                name="password"
                                onChange={this.handleInputChange}
                                value={this.state.password}
                              />
                            </div>
                            <p style={inputError}>{this.state.againPasswordError}</p>
                          </div>
                          <div className="form-group">
                            <div className="input-group">
                              <input
                                id="newRePassword"
                                type="password"
                                name="againPassword"
                                className="form-control"
                                placeholder="Enter New Password Again"
                                onChange={this.handleInputChange}
                                value={this.state.againPassword}
                              />
                            </div>
                            <p style={inputError}>{this.state.passwordError}</p>
                          </div>
                        </form>
                        <div>
                            <button className="btn btn-sm btn-outline-dark float-left mb-3" onClick={this.cancel}>Cancel</button>
                            <button className="btn btn-outline-success btn-sm float-right mb-3" onClick={this.handleChangePassword}>Submit</button>
                        </div>
                        <p style={this.state.changeResultStyle}>{this.state.changeResult}</p>
                      </article>
                    </section>
                  </div>
                  </center>
              <p><button type="submit" className="btn btn-warning btn-block" onClick={this.handleChangeIcon}>Change Icon by URL</button></p>
              <p><button type="submit" className="btn btn-warning btn-block" onClick={this.handleClickUploadIcon}>Upload Icon</button></p>
              <input type="file"
               id="iconImg" name="iconImg"
               accept="image/png, image/jpeg"
               onChange={this.handleUploadIcon}
               hidden/>
              </div>
              </div>
          );
        }
        else {
          return (
            <img src="../images/loading.gif" style={{width: 300, height: 300}}/>
          );
        }
      }
    }
