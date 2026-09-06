const fs = require('fs');

let profile = fs.readFileSync('src/pages/UserProfile.jsx', 'utf8');

// Add toast import
if (!profile.includes('react-hot-toast')) {
  profile = profile.replace(
    /import \{ useNavigate, Link \} from 'react-router-dom';/,
    "import { useNavigate, Link } from 'react-router-dom';\nimport toast from 'react-hot-toast';"
  );
}

// Update Logout
profile = profile.replace(
  /localStorage\.removeItem\('wt_user'\);\n\s*navigate\('\/'\);/,
  "localStorage.removeItem('wt_user');\n    toast.success('Logged out successfully');\n    navigate('/');"
);

// Replace handleSettingUpdate
const newUpdateHandler = `
  const handleSettingUpdate = async (e, type) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (type === 'Password') {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("New passwords do not match!");
        return;
      }
    }

    const loadToast = toast.loading('Updating...');
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify({ type, ...data })
      });
      const result = await res.json();
      
      if (result.success) {
        toast.success(result.message, { id: loadToast });
        if (type === 'Email') {
          const updatedUser = { ...user, email: result.email };
          setUser(updatedUser);
          localStorage.setItem('wt_user', JSON.stringify(updatedUser));
        }
        e.target.reset(); // clear form
      } else {
        toast.error(result.message || 'Update failed', { id: loadToast });
      }
    } catch (err) {
      toast.error('Network error. Try again.', { id: loadToast });
    }
  };
`;

profile = profile.replace(
  /const handleSettingUpdate = \(e, type\) => \{[\s\S]*?\};\n/,
  newUpdateHandler
);

// Add names to email form inputs
profile = profile.replace(
  /<input type="email" placeholder="Enter new email address" required \/>/,
  '<input type="email" name="newEmail" placeholder="Enter new email address" required />'
);

// Add names to password form inputs
profile = profile.replace(
  /<input type="password" placeholder="••••••••" required \/>/g,
  (match, offset, string) => {
    if (string.substring(offset - 40, offset).includes('Current')) {
      return '<input type="password" name="currentPassword" placeholder="••••••••" required />';
    }
    if (string.substring(offset - 40, offset).includes('Confirm')) {
      return '<input type="password" name="confirmPassword" placeholder="••••••••" required />';
    }
    return '<input type="password" name="newPassword" placeholder="••••••••" required />';
  }
);

fs.writeFileSync('src/pages/UserProfile.jsx', profile, 'utf8');
