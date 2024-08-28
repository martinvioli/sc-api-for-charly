const Exception = ({ message, name, stack }: Error) => ({
  error: { name, message, stack },
});

export default Exception;
