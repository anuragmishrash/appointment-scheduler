/**
 * Utility functions for handling component props
 */

/**
 * Converts React boolean props to data attributes for HTML elements that don't accept them
 * This helps avoid React warnings about invalid DOM properties
 * 
 * @param {Object} props - The component props
 * @param {Array} propNames - Array of prop names to convert to data attributes
 * @returns {Object} - New props object with converted data attributes
 */
export const convertBoolPropsToDataAttrs = (props, propNames = []) => {
  const newProps = { ...props };
  
  propNames.forEach(propName => {
    if (propName in newProps) {
      // Add a data attribute version
      newProps[`data-${propName}`] = newProps[propName];
      // Remove the original prop
      delete newProps[propName];
    }
  });
  
  return newProps;
};

/**
 * Safe forwarding of props to DOM elements
 * Filters out props that would cause React warnings
 * 
 * @param {Object} props - Original props
 * @param {Array} propsToRemove - Array of prop names to remove
 * @returns {Object} - Filtered props
 */
export const filterDOMProps = (props, propsToRemove = []) => {
  const filteredProps = { ...props };
  
  // Common props that cause warnings
  const defaultPropsToRemove = [
    'fullScreen',
    'component',
    'elevation'
  ];
  
  // Combine default props to remove with any additional ones
  const allPropsToRemove = [...defaultPropsToRemove, ...propsToRemove];
  
  allPropsToRemove.forEach(prop => {
    if (prop in filteredProps) {
      delete filteredProps[prop];
    }
  });
  
  return filteredProps;
}; 