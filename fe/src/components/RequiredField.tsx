import React from 'react';
import styles from './RequiredField.module.scss';

interface RequiredFieldProps {
  label: string;
  htmlFor: string;
}

const RequiredField: React.FC<RequiredFieldProps> = ({ label, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className={styles.label}>
      {label}
      <span className={styles.required}>*</span>
    </label>
  );
};

export default RequiredField; 