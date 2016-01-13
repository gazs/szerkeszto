import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import { connect } from 'react-redux';

import {changeMeasurement } from './actions'

class MeasurementsForm extends Component {

  render() {
		const { dispatch } = this.props;
    return (
      <form >
        {Object.keys(this.props.meretek).map(name => {
          const field = this.props.meretek[name];
          return (<div key={name}>
            <label>{name}</label>
            <div>
              <input type="text" placeholder={name} value={field} onChange={ e =>
								dispatch(changeMeasurement(name, e.target.value))
							}/>
            </div>
          </div>);
        })}
      </form>
    );
  }
}
function selector(state) {
	return state //.foo;
}

export default connect(selector)(MeasurementsForm)

//export default reduxForm({
//form: 'dynamic',
//},
//state => ({ // mapStateToProps
  //initialValues: state.foo.meretek
//}),
//{load: data => ({type: 'DUNNO_LOL'})} 
												//)(MeasurementsForm);
