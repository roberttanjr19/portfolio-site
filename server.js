const path = require('path');
const dns = require('dns');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Some Windows setups (VPNs, VirtualBox/Android virtual adapters) hand Node's
// resolver a DNS server that can't answer the SRV lookup mongodb+srv:// needs,
// even though the OS's own nslookup succeeds. Forcing a public resolver here
// avoids the querySrv ECONNREFUSED failures that causes.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://project-ncfkz.vercel.app'
];

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Welcome to My Portfolio application.' });
});

app.use('/api/contacts', require('./server/routes/contact.routes'));
app.use('/api/projects', require('./server/routes/project.routes'));
app.use('/api/qualifications', require('./server/routes/qualification.routes'));
app.use('/api/users', require('./server/routes/user.routes'));
app.use('/auth', require('./server/routes/auth.routes'));

if (process.env.NODE_ENV === 'production') {
  // Serve the built React app and hand off any non-API route to it so
  // client-side routing (React Router) survives a hard refresh/deep link.
  const clientBuildPath = path.join(__dirname, 'client', 'dist');
  app.use(express.static(clientBuildPath));
  app.get(/^\/(?!api\/|auth\/).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`App running in port ${PORT}`);
});
