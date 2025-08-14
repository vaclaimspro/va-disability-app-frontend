\// src/main.jsx
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
      identityPoolId: awsExports.aws_cognito_identity_pool_id,
      loginWith: { email: true, username: false, phone: false }, // enable email login
    },
  },
  API: {
    REST: {
      StripeApi: {
        endpoint: awsExports.aws_cloud_logic_custom[0].endpoint,
        region: awsExports.aws_cloud_logic_custom[0].region,
      },
    },
  },
  Storage: {
    S3: {
      bucket: awsExports.aws_user_files_s3_bucket,
      region: awsExports.aws_user_files_s3_bucket_region,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
