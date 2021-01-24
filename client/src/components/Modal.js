import React, { Component } from 'react';

class Modal extends Component {
  listener = (e) => {
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  }

  componentDidMount() {
    document.addEventListener('keyup', this.listener);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.listener);
  }

  renderContent() {
    return "Empty!";
  }

  render() {
    return <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => this.props.onClose()}>&times;</span>
        {this.renderContent()}
      </div>
    </div>
  }
}

export default Modal;