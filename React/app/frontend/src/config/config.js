const config = {
    apiUrl: process.env.REACT_APP_API_URL,
    uploadUrl: process.env.REACT_APP_UPLOAD_URL,
    outputUrl: process.env.REACT_APP_OUTPUT_URL,
    routes: {
      home: '/',
      login: '/login',
      register: '/register',
      dashboard: '/dashboard',
      contact: '/contact',
    },
  };
  
  export default config;