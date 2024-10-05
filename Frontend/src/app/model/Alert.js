export const Alert = ({ children, className = '', ...props }) => {
    return (
      <div 
        className={`bg-black/55 border border-white rounded-lg shadow-lg ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  };
  
  export const AlertTitle = ({ children, className = '', ...props }) => {
    return (
      <h3 
        className={`text-lg font-semibold text-white mb-1 ${className}`}
        {...props}
      >
        {children}
      </h3>
    );
  };
  
  export const AlertDescription = ({ children, className = '', ...props }) => {
    return (
      <div 
        className={`text-sm text-gray-300 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  };