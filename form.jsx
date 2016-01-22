import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect} from 'react-redux';

import * as actionCreators from './actions'

class MeasurementsForm extends Component {

  render() {
    return (
      <form >
        {Object.keys(this.props.pattern.meretek).map(name => {
          const field = this.props.pattern.meretek[name];
          return (<div key={name}>
            <label>{name}</label>
            <div>
              <input type="text" placeholder={name} value={field} onChange={ e =>
								this.props.actions.changeMeasurement(name, e.target.value)
							}/>
            </div>
          </div>);
        })}
				<label>name of measures:<input type="text" value={this.props.name} onChange={ e => this.props.actions.changeCurrentName(e.target.value)}/></label>
				<button onClick={e => this.props.actions.saveCurrentPattern(this.props.pattern)}>💾 save</button>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({pattern: state.currentPattern});


const mapDispatchToProps = (dispatch) => ({
	 actions : bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MeasurementsForm);
