export const formatErrors = (errorObject, setError) => {
  if (!errorObject) return null;
  return Object.keys(errorObject).forEach((key) => {
    setError(key, {
      type: 'manual',
      message: errorObject[key][0],
    });
  });
};

export const formatErrorsV2 = (errorObject, setError) => {
  if (!errorObject) return null;
  return Object.keys(errorObject).forEach((key) => {
    setError(errorObject[key]);
  });
};
