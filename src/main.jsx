// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

// --- Amplify v6 configuration ---
Amplify.configure({
  Auth: {
    Cognito: {
      region: awsExports.aws_cognito_region,
      userPoolId: awsExports.aws_user_pools_id,
      userPoolClientId: awsExports.aws_user_pools_web_client_id,
      identityPoolId: awsExports.aws_cognito_identity_pool_id, // optional but you have one
      // v6 expects a `loginWith` object; enable email since your pool uses EMAIL
      loginWith: { email: true, username: false, phone: false },
    },
  },
  API: {
    REST: awsExports.aws_cloud_logic_custom, // contains your StripeApi entry
  },
  Storage: {
    S3: {
      bucket: awsExports.aws_user_files_s3_bucket,
      region: awsExports.aws_user_files_s3_bucket_region,
    },
  },
  // No DataStore/AppSync right now
  DataStore: { syncExpressions: [] },
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
