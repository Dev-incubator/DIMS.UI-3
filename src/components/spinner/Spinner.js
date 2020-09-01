import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../../hoc';

const Spinner = ({ theme }) => {
  return (
    <div className={`loadingio-spinner-ripple ${theme}`}>
      <div className='ldio'>
        <div />
        <div />
      </div>
    </div>
  );
};

Spinner.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default withTheme(Spinner);
