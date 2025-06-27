export const updateItemConfigById = (data, idToUpdate, fieldKey, fieldValue) => {
  if (!data.children) return null;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < data.children.length; i++) {
    const child = data.children[i];

    if (child.id === idToUpdate) {
      const updatedChild = {
        ...child,
        config: {
          ...child.config,
          [fieldKey]: fieldValue,
        },
      };

      const updatedChildren = [
        ...data.children.slice(0, i),
        updatedChild,
        ...data.children.slice(i + 1),
      ];

      return {
        id: data.id,
        group: updatedChildren,
      };
    }

    if (child.children) {
      const result = updateItemConfigById(child, idToUpdate, fieldKey, fieldValue);
      if (result) return result;
    }
  }

  return null;
};

export const findItemById = (data, targetId) => {
  if (data.id === targetId) {
    return data;
  }

  if (data.children && data.children.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const child of data.children) {
      const result = findItemById(child, targetId);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

export const showValueHasMinMax = (
  [min, max],
  value,
  valueDefault = '100%',
  typeReturn = 'string'
) => {
  if (!value) {
    return valueDefault;
  }

  let result;

  if (value < min) {
    result = min;
  } else if (value > max) {
    result = max;
  } else {
    result = value;
  }

  return typeReturn === 'string' ? `${result}px` : result;
};
