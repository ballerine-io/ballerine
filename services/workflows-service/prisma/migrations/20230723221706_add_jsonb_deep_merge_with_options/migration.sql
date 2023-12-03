CREATE OR REPLACE FUNCTION jsonb_deep_merge_with_options(obj1 jsonb, obj2 jsonb, array_merge_option text DEFAULT 'concat')
RETURNS jsonb AS $$
  const mergeObjects = (obj1, obj2) => {
    const result = { ...obj1 };

    for (let key in obj2) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key]) && key in result) {
        result[key] = mergeObjects(result[key], obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }

    return result;
  };

  const mergeArraysById = (arr1, arr2) => {
    const combined = [...arr1, ...arr2];
    const ids = Array.from(new Set(combined.map(item => item.id)));

    return ids.map(id => {
      const sameIdItems = combined.filter(item => item.id === id);
      return sameIdItems.reduce(mergeObjects, {});
    });
  };

 const mergeArraysByIndex = (arr1, arr2) => {
    const maxLength = Math.max(arr1.length, arr2.length);
    const result = new Array(maxLength);

    for (let i = 0; i < maxLength; i++) {
      if (i < arr1.length && i < arr2.length) {
        // Change here: Check if the elements are basic values or JSON objects
        if (typeof arr1[i] !== 'object' && typeof arr2[i] !== 'object') {
          result[i] = arr2[i];
        } else {
          result[i] = mergeObjects(arr1[i], arr2[i]);
        }
      } else {
        result[i] = arr1[i] || arr2[i];
      }
    }

    return result;
  };

  const deepMergeWithOptions = (val1, val2, array_merge_option = 'concat') => {
    // Handle array inputs
     if (Array.isArray(val1) && Array.isArray(val2)) {
      if (array_merge_option === 'replace') {
        return val2;
      } else {
        switch (array_merge_option) {
          case 'by_id':
            return mergeArraysById(val1, val2);
          case 'by_index':
            return mergeArraysByIndex(val1, val2);
          case 'concat':
          default:
            return [...val1, ...val2];
        }
      }
    }
    // Handle object inputs
    else if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
      const result = { ...val1 };

      for (let key in val2) {
        if (Array.isArray(val2[key])) {
          if (array_merge_option === 'replace') {
            result[key] = val2[key];
          } else {
              switch (array_merge_option) {
                case 'by_id':
                  result[key] = mergeArraysById(val1[key] || [], val2[key]);
                  break;
                case 'by_index':
                  result[key] = mergeArraysByIndex(val1[key] || [], val2[key]);
                  break;
                case 'concat':
                default:
                  result[key] = [...(val1[key] || []), ...(val2[key])];
              }
          }
        } else if (typeof val2[key] === 'object' && val2[key] !== null && !Array.isArray(val2[key]) && key in result) {
          result[key] = deepMergeWithOptions(result[key], val2[key], array_merge_option);
        } else {
          result[key] = val2[key];
        }
      }

      return result;
    }
    // For all other types of inputs, return the second value
    else {
      return val2;
    }
  };

  return deepMergeWithOptions(obj1, obj2, array_merge_option);
$$ LANGUAGE plv8 IMMUTABLE STRICT;
