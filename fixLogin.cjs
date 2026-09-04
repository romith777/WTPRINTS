const fs = require('fs');
let content = fs.readFileSync('src/pages/Login.jsx', 'utf8');

// 1. Add missing imports
if (!content.includes('useNavigate')) {
  content = content.replace("import React, { useState } from 'react';", "import React, { useState, useContext } from 'react';\nimport { useNavigate } from 'react-router-dom';\nimport { StoreContext } from '../context/StoreContext';");
}

// 2. Add handleAuth logic
const authLogic = `
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { setToken } = useContext(StoreContext);

  const handleAuth = (e) => {
    e.preventDefault();
    // Simulate API call for now (since there is no /api/login endpoint in Vercel yet)
    setToken("mock-jwt-token-123");
    navigate('/');
  };
`;
content = content.replace("const [isLogin, setIsLogin] = useState(true);", authLogic);

// 3. Attach handleAuth to forms
content = content.replace(/onSubmit=\{\(e\) => e\.preventDefault\(\)\}/g, "onSubmit={handleAuth}");

fs.writeFileSync('src/pages/Login.jsx', content, 'utf8');
