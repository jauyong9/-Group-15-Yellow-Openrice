/*
  Class Header:
  This class is the header of the web app, including the title and header image.
*/

class Header extends React.Component {

      render() {
        const headerStyle = {
          /*background: 'url("../images/header_background.jpg") 0 0 / contain'*/
          backgroundColor: 'rgb(248,249,250)'
        };
        const imgSyle = {
          width: '50px',
          height: '50px'
        };
        return (
          <header className="container text-center" style={headerStyle}>
            <img src="images/icon.ico" style={imgSyle}/>
          </header>
        );
      }

    }
