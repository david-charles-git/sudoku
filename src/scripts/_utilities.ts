const sudokuPreventDefault: (event: Event) => void = (event) => {
  event.preventDefault();
  event.stopPropagation();
};
