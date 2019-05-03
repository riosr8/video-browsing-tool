/* eslint-disable */
// disabling eslint to enfore not using prefer-default-export rule

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};
