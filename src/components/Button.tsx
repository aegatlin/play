export const Button = ({ children, onClick }) => {
  return (
    <button
      className="rounded-lg border-2 border-purple-900 bg-purple-100 p-4 text-purple-900 hover:bg-purple-200"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
