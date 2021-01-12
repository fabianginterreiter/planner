import React, { Component } from 'react';
import './InputSelectForm.css';

class InputSelectForm extends Component {
    state = {
        text: '',
        width: 0,
        selected: -1,
        values: [],
        focus: false
    }

    ref = null;

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.setState({
            width: this.ref.current.clientWidth
        }, () => this.setText((this.props.value) ? this.props.value.name : ''))
    }

    setText(text) {
        this.props.values(text).then((values) => {
            const selected = values.findIndex((value) => value.name.toLowerCase() === text.toLowerCase());
            const target = selected >= 0 ? values[selected] : null;

            this.setState({
                text,
                values,
                target,
                selected,
            }, () => this.debug());
        });
    }

    debug() {
        // console.log(`Text: ${this.state.text} Selected: ${this.state.selected} Number of Values: ${this.state.values.length}`)
    }

    handleKeyUp(e) {
        if (e.key === 'ArrowDown' && this.state.selected < this.state.values.length - 1) {
            e.preventDefault();
            const selected = this.state.selected + 1;
            this.setState({
                selected: selected,
                target: this.state.values[selected]
            }, () => this.debug())
        } else if (e.key === 'ArrowUp' && this.state.selected >= 0) {
            e.preventDefault();
            const selected = this.state.selected - 1;
            this.setState({
                selected,
                target: selected < 0 ? null : this.state.values[selected]
            }, () => this.debug())
        } else if (e.key === 'Escape') {
            // console.log("ESC");
            e.preventDefault();

            this.setText((this.props.value) ? this.props.value.name : '');
        }
        
        else {
             // console.log(e.key);
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Tab') {
            this.submit(e);
        }  else if (e.key === 'Enter') {
            e.preventDefault();
            console.log("submit");
            this.submit();
        }
    }

    handleBlur() {
        this.setState({
            focus:false
        });

       // console.log("blur");
    }

    submit() {
        if (this.state.selected < 0) {
            if (this.state.text.length > 0) {
              //  console.log("Create: " + this.state.text);
                this.props.onSubmit({name:this.state.text})
                
            } else {
               // console.log("onReset");
            }
        } else {
           // console.log("Use: " + this.state.target.name);
            this.setState({
                text: this.state.target.name
            }, () => this.props.onSubmit(this.state.target));
        }

        if (this.props.clearOnSubmit || this.props.clearOnCancel) {
          //  console.log("CLEAAN!");
            this.setText('');
        }
    }

    cancel() {

    }

    render() {
        return <div className="InputSelectForm" ref={this.ref}>
          <input type="text" value={this.state.text} 
            onChange={(e) => this.setText(e.target.value)} 
            onFocus={() => this.setState({focus:true})} 
            onBlur={() => this.handleBlur()} 
            onKeyUp={(e) => this.handleKeyUp(e)}
            onKeyDown={(e) => this.handleKeyDown(e)}
            placeholder={this.props.placeholder} />
            {(this.state.focus && this.state.text.length > 0 ) && <div style={{width: this.state.width}}>
                {this.state.text.length > 0 && <div className={this.state.selected < 0 ? 'selected' : ''}>Create: {this.state.text}</div>}
                {this.state.values.map((value, idx) => <div key={value.id} className={this.state.selected === idx ? 'selected' : ''}>{value.name}</div>)}                
            </div>}
        </div>;
    }
}


export default InputSelectForm