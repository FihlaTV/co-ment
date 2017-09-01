import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router'


class Nav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menu: 'closed',
      width: window.innerWidth,
    };
  }

  componentWillMount() {
    this.updateDimensions();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setState({ menu: 'closing' });
        setTimeout(() => {
          this.setState({ menu: 'closed' });
        }, 300);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
    if (this.state.width > 650 && this.state.menu === 'open') {
      this.setState({ menu: 'closed' });
    }
  }

  navToggle = () => {
    if (this.state.width < 650) {
      if (this.state.menu === 'closed') {
        this.setState({ menu: 'open' });
      } else {
        this.setState({ menu: 'closing' });
        setTimeout(() => {
          this.setState({ menu: 'closed' });
        }, 300);
      }
    }
  }

  render() {
      const classObj = {
        closed: {
          nav: 'h-nav__nav',
          ul: 'h-nav',
          bar1: 'h-nav__bar h-nav__bar--top',
          bar2: 'h-nav__bar h-nav__bar--mid',
          bar3: 'h-nav__bar h-nav__bar--bot',
          ariaE: false,
        },

        open: {
          nav: 'h-nav__nav--side',
          ul: 'h-nav__side',
          bar1: 'h-nav__bar h-nav__bar--top h-nav__bar--top-active',
          bar2: 'h-nav__bar h-nav__bar--mid h-nav__bar--mid-active',
          bar3: 'h-nav__bar h-nav__bar--bot h-nav__bar--bot-active',
          ariaE: true,
        },

        closing: {
          nav: 'h-nav__nav h-nav__nav--hidden',
          ul: 'h-nav',
          bar1: 'h-nav__bar h-nav__bar--top',
          bar2: 'h-nav__bar h-nav__bar--mid',
          bar3: 'h-nav__bar h-nav__bar--bot',
          ariaE: false,
        },
      };
  return (
    <div className="h-nav__side-bkg">
    <button className="h-nav__icon" aria-expanded={classObj[this.state.menu].ariaE} aria-controls="nav" onClick={this.navToggle} >
      <span className="sr-only">Toggle navigation</span>
      <div className={classObj[this.state.menu].bar1} />
      <div className={classObj[this.state.menu].bar2} />
      <div className={classObj[this.state.menu].bar3} />
    </button>
    <nav className={classObj[this.state.menu].nav}>
      <ul className={classObj[this.state.menu].ul}>
            <li className="h-nav__item">
                <NavLink
                  to="/"
                  className="h-nav__item-link"
                  activeClassName="h-nav__item-link--active">
                  Home
                </NavLink>
            </li>
            <li className="h-nav__item">
                <NavLink
                  to="/about"
                  className="h-nav__item-link h-nav__item-link"
                  activeClassName="h-nav__item-link--active">
                  About
                </NavLink>
            </li>
          {this.props.links.map((item) => {
            let classes;
            if (item === 'login' || item === 'logout')
              { classes = "h-nav__item-link h-nav__item-link--login" }
            else { classes = "h-nav__item-link h-nav__item-link" }
              return (
            <li className="h-nav__item" key={item}>
                <NavLink
                  to={`/${item}`}
                  className={classes}
                  activeClassName="h-nav__item-link--active">
                  {item}
                </NavLink>
            </li>
          );
        })
        }
      </ul>
    </nav>
    </div>
      );
    }
}
const HeaderNav = withRouter(Nav);
export default HeaderNav;
