// Test import resolution
try {
  const { FileText } = require('lucide-react');
  console.log('✅ lucide-react import successful');
} catch (error) {
  console.log('❌ lucide-react import failed:', error.message);
}

try {
  const { motion } = require('framer-motion');
  console.log('✅ framer-motion import successful');
} catch (error) {
  console.log('❌ framer-motion import failed:', error.message);
}
