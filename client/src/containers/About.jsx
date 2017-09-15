import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Swipe, SwipeItem } from 'swipejs/react';
import * as Actions from '../store/actions/tourActions';

const adjustBkgSize = (target) => {
  // expand background size to contain FAQ answers as they are expanded
  const el = target;
  let adjustedHeight = el.clientHeight;
  adjustedHeight = Math.max(el.scrollHeight, adjustedHeight);
  if (adjustedHeight > el.clientHeight) {
    el.style.minHeight = `${adjustedHeight + 60}px`;
  }
};

class About extends React.Component {

  componentDidMount() {
    adjustBkgSize(document.querySelector('.faq'));
    adjustBkgSize(document.querySelector('.tour'));
  }

  componentDidUpdate() {
    adjustBkgSize(document.querySelector('.faq'));
    adjustBkgSize(document.querySelector('.tour'));
  }

  handleClick(e) {
    this.swipe.instance.next();
  }


  render() {
    return (
      <div className="tour">
        <div className="tour__slide">
          <div className="tour__slide-header">
            {this.props.tour.slides[this.props.tour.imageIndex].title}
            {/* Dot-controls for carousel */}
            <button
              className="tour__chevron-left aria-button"
              tabIndex={0}
              aria-label="previous slide"
              onClick={
                () => {
                  let newIndex = this.props.tour.imageIndex - 1;
                  if (newIndex < 0) {
                    newIndex = this.props.tour.slides.length - 1;
                  }
                  this.props.actions.setIndex(newIndex);
                  this.swipe.instance.prev();
                }
              }
              onKeyDown={
                (e) => {
                  if (e.keyCode === 13 || e.which === 13) {
                    let newIndex = this.props.tour.imageIndex - 1;
                    if (newIndex < 0) {
                      newIndex = this.props.tour.slides.length - 1;
                    }
                    this.props.actions.setIndex(newIndex);
                    this.swipe.instance.prev();
                  }
                }
              }
            >
              <i className="fa fa-chevron-left" />
            </button>
            <div className="tour__controls">
              {
                this.props.tour.slides.map((slide, index) => {
                  const active = (this.props.tour.imageIndex === index ? '-active' : '');
                  return (
                    <div
                      className={`tour__dot${active}`}
                      key={slide.slideId}
                      id={index}
                      aria-label={this.props.tour.slides[index].title}
                      tabIndex={0}
                      onClick={(e) => {
                        this.props.actions.setIndex(parseInt(e.target.id, 10));
                        this.swipe.instance.slide(parseInt(e.target.id, 10), 500);
                         }}
                      onKeyDown={
                        (e) => {
                          if (e.keyCode === 13 || e.which === 13) {
                            this.props.actions.setIndex(parseInt(e.target.id, 10));
                            this.swipe.instance.slide(parseInt(e.target.id, 10), 500);
                          }
                        }
                      }
                    >
                      <i className={active ? 'fa fa-circle' : 'fa fa-circle-o'} id={index} />
                    </div>
                  );
                })
              }
            </div>
            <button
              className="tour__chevron-right aria-button"
              tabIndex={0}
              aria-label="next slide"
              onClick={
                  () => {
                    let newIndex = this.props.tour.imageIndex + 1;
                    if (newIndex > this.props.tour.slides.length - 1) {
                      newIndex = 0;
                    }
                    this.props.actions.setIndex(newIndex);
                    this.swipe.instance.next();
                  }
                }
              onKeyDown={
                (e) => {
                  if (e.keyCode === 13 || e.which === 13) {
                    let newIndex = this.props.tour.imageIndex + 1;
                    if (newIndex > this.props.tour.slides.length - 1) {
                      newIndex = 0;
                    }
                    this.props.actions.setIndex(newIndex);
                    this.swipe.instance.next();
                  }
                }
              }
            >
              <i className="fa fa-chevron-right" />
            </button>
          </div>
          <Swipe className='custom-swipe-container-class'
             ref={(instance) => { this.swipe = instance; }}
             startSlide={0}
             speed={500}
             auto={3000}
             draggable={false}
             continuous={true}
             autoRestart={false}
             disableScroll={false}
             stopPropagation={false}
             // callback={this.handleCallback.bind(this)}
             // transitionEnd={this.onTransactionEnd.bind(this)}
             >
             {this.props.tour.slides.map(slide => {
              return (
              <SwipeItem className='swipe-slide' key={slide.title} onClick={this.handleClick.bind(this)}>
                <div className="tour__slide-text" dangerouslySetInnerHTML={{__html: slide.__html}} />
                  <div className="tour__image">
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                    />
                  </div>
              </SwipeItem>
              );
             })}
          </Swipe>
          {this.props.appState.windowSize.height <= 700 &&
            <div className="tour__slide-footer">
              {/* Dot-controls for carousel repeated beneath each slide for short viewports */}
              <button
                className="tour__chevron-left aria-button"
                tabIndex={0}
                aria-label="previous slide"
                onClick={
                  () => {
                    let newIndex = this.props.tour.imageIndex - 1;
                    if (newIndex < 0) {
                      newIndex = this.props.tour.slides.length - 1;
                    }
                    this.props.actions.setIndex(newIndex);
                  }
                }
                onKeyDown={
                  (e) => {
                    if (e.keyCode === 13 || e.which === 13) {
                      let newIndex = this.props.tour.imageIndex - 1;
                      if (newIndex < 0) {
                        newIndex = this.props.tour.slides.length - 1;
                      }
                      this.props.actions.setIndex(newIndex);
                    }
                  }
                }
              >
                <i className="fa fa-chevron-left" />
              </button>
              <div className="tour__controls">
                {
                this.props.tour.slides.map((slide, index) => {
                  const active = (this.props.tour.imageIndex === index ? '-active' : '');
                  return (
                    <div
                      className={`tour__dot${active}`}
                      key={slide.slideId}
                      id={index}
                      aria-label={this.props.tour.slides[index].title}
                      tabIndex={0}
                      onClick={(e) => { this.props.actions.setIndex(parseInt(e.target.id, 10)); }}
                      onKeyDown={
                        (e) => {
                          if (e.keyCode === 13 || e.which === 13) {
                            this.props.actions.setIndex(parseInt(e.target.id, 10));
                          }
                        }
                      }
                    >
                      <i className={active ? 'fa fa-circle' : 'fa fa-circle-o'} id={index} />
                    </div>
                  );
                })
              }
              </div>
              <button
                className="tour__chevron-right aria-button"
                tabIndex={0}
                aria-label="next slide"
                onClick={
                  () => {
                    let newIndex = this.props.tour.imageIndex + 1;
                    if (newIndex > this.props.tour.slides.length - 1) {
                      newIndex = 0;
                    }
                    this.props.actions.setIndex(newIndex);
                  }
                }
                onKeyDown={
                  (e) => {
                    if (e.keyCode === 13 || e.which === 13) {
                      let newIndex = this.props.tour.imageIndex + 1;
                      if (newIndex > this.props.tour.slides.length - 1) {
                        newIndex = 0;
                      }
                      this.props.actions.setIndex(newIndex);
                    }
                  }
                }
              >
                <i className="fa fa-chevron-right" />
              </button>
            </div>
            }
        </div>
        <div className="faq">
          <div className="faq__header">
            FAQ
          </div>
          <div className="faq__content faq__row">
            {this.props.tour.faq.map(question => (
              <div key={question.id} className="faq__card">
                <div
                  className="faq__question"
                  onClick={
                    () => {
                      const el = document.getElementById(`${question.id}-answer`);
                      const classes = el.classList;
                      if (classes.contains('faq__answer-expanded')) {
                        el.classList.remove('faq__answer-expanded');
                        el.style.height = 0;
                        adjustBkgSize(document.querySelector('.faq'));
                        adjustBkgSize(document.querySelector('.tour'));
                      } else {
                        el.classList.add('faq__answer-expanded');
                        el.style.height = `${el.scrollHeight}px`;
                        adjustBkgSize(document.querySelector('.faq'));
                        adjustBkgSize(document.querySelector('.tour'));
                      }
                    }
                  }
                >
                  {question.question}
                </div>
                <div
                  id={`${question.id}-answer`}
                  className="faq__answer "
                  dangerouslySetInnerHTML={question}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

About.propTypes = {
  appState: PropTypes.shape({
    windowSize: PropTypes.object,
  }).isRequired,
  tour: PropTypes.shape({
    imageIndex: PropTypes.Number,
    slides: PropTypes.Array,
    faq: PropTypes.Array,
  }).isRequired,
  actions: PropTypes.shape({
    setIndex: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  tour: state.tour,
  appState: state.appState,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(About);
