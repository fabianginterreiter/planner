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
        const text = (this.props.value) ? this.props.value.name : '';

        const values = this.props.values.filter(value => value.name.toLowerCase().startsWith(text.toLowerCase()));
        const target = this.props.values.find((value) => value.name.toLowerCase() === text.toLowerCase());
        const selected = target ? 0 : -1;
        
        this.setState({
            text,
            values,
            target,
            selected,
            width: this.ref.current.clientWidth
        })
    }

    handleKeyUp(e) {
        if (e.key === 'ArrowDown' && this.state.selected < this.state.values.length - 1) {
            e.preventDefault();
            const selected = this.state.selected + 1;
            this.setState({
                selected: selected,
                target: this.state.values[selected]
            })
        } else if (e.key === 'ArrowUp' && this.state.selected >= 0) {
            e.preventDefault();
            const selected = this.state.selected - 1;
            this.setState({
                selected,
                target: selected < 0 ? null : this.state.values[selected]
            })
        } else if (e.key === 'Enter') {
            const text = this.state.values[this.state.selected].name;
            const values = this.props.values.filter(value => value.name.toLowerCase().startsWith(text.toLowerCase()));
            const target = this.props.values.find((value) => value.name.toLowerCase() === text.toLowerCase());

            this.setState({
                text, values, target
            })

        } else if (e.key === 'Escape') {
            console.log("ESC");
            e.preventDefault();
            const values = this.props.values.filter(value => value.name.toLowerCase().startsWith(this.props.value.name.toLowerCase()));
            const target = this.props.values.find((value) => value.name.toLowerCase() === this.props.value.name.toLowerCase());
            const selected = target ? 0 : -1;

            this.setState({
                text: this.props.value.name,
                values,
                target,
                selected
            })
        } else {
            // console.log(e.key);
        }
    }

    handleInputChange(e) {
        const text = e.target.value;
        const values = this.props.values.filter(value => value.name.toLowerCase().startsWith(e.target.value.toLowerCase()));
        const target = this.props.values.find((value) => value.name.toLowerCase() === e.target.value.toLowerCase());

        this.setState({
            text,
            values,
            target,
            selected: target ? 0 : -1
        })
    }

    handleBlur() {
        this.setState({
            focus:false
        });

        if (this.state.selected < 0) {
            if (this.state.text.length === 0) {
                this.props.onChange(null);
            } else {
                this.props.onChange({name: this.state.text});
            }
        } else {
            if (!this.props.value && (this.props.value.id !== this.state.target.id)) {
                this.props.onChange(this.state.target);
            }
            
            this.setState({
                text: this.state.target.name
            })
        }
    }

    render() {
        return <div className="InputSelectForm" ref={this.ref}>
          <input type="text" value={this.state.text} 
            onChange={(e) => this.handleInputChange(e)} 
            onFocus={() => this.setState({focus:true})} 
            onBlur={() => this.handleBlur()} 
            onKeyUp={(e) => this.handleKeyUp(e)} />
            {this.state.focus && <div style={{width: this.state.width}}>
                {!this.state.target && this.state.text.length > 0 && <div className={this.state.selected < 0 ? 'selected' : ''}>Create: {this.state.text}</div>}
                {this.state.values.map((value, idx) => <div key={value.id} className={this.state.selected === idx ? 'selected' : ''}>{value.name}</div>)}                
            </div>}
        </div>;
    }
}


export default InputSelectForm