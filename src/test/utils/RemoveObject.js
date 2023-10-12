const removeObjectById = (idToRemove, data, newUpdatedObject) => {
    // Create a new array with the object removed
    const updatedData = data.filter((item) => item.id !== idToRemove);
    updatedData.push(newUpdatedObject);
    return updatedData;
  };

  export default removeObjectById;