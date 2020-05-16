/*
  This class is the admin page.
*/

class Admin extends React.Component {
  constructor(props) {
    super(props)

    window.history.replaceState({page: 'Admin'}, null, `?page=admin`);
  }

  render() {
    return (
        <div className="row">


        </div>
      );
  }
}
