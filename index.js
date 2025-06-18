// // import fetch from 'node-fetch';

// // async function getNav() {
// //   const schemeCode = '119721'; // HDFC Small Cap Fund - Direct Growth
// //   const url = `https://api.mfapi.in/mf/${schemeCode}`;

// //   try {
// //     const response = await fetch(url);
// //     const data = await response.json();

// //     const latestNAV = data.data[0]; // Latest NAV
// //     console.log(`Scheme Name: ${data.meta.scheme_name}`);
// //     console.log(`Date: ${latestNAV.date}`);
// //     console.log(`NAV: ₹${latestNAV.nav}`);
// //   } catch (error) {
// //     console.error('Error fetching NAV:', error);
// //   }
// // }

// // getNav();


// // import fetch from 'node-fetch';
// // import { isinToSchemeCode } from './isin_to_scheme.js'; // import mapping

// // async function getNavFromIsin(isin) {
// //   const schemeCode = isinToSchemeCode[isin];

// //   if (!schemeCode) {
// //     console.error('Invalid ISIN or mapping not available.');
// //     return;
// //   }

// //   const url = `https://api.mfapi.in/mf/${schemeCode}`;

// //   try {
// //     const response = await fetch(url);
// //     const data = await response.json();

// //     const latestNAV = data.data[0];
// //     console.log(`Scheme Name: ${data.meta.scheme_name}`);
// //     console.log(`Date: ${latestNAV.date}`);
// //     console.log(`NAV: ₹${latestNAV.nav}`);
// //   } catch (error) {
// //     console.error('Error fetching NAV:', error);
// //   }
// // }

// // // Example usage
// // getNavFromIsin('INF179KA1RW5'); // Parag Parikh Flexi Cap Fund




// import fetch from 'node-fetch';
// import cron from 'node-cron';

// async function getNav() {
//   const schemeCode = '119721';
//   const url = `https://api.mfapi.in/mf/${schemeCode}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     const latestNAV = data.data[0]; // Latest NAV
//     console.log(`\n--- NAV Fetched at ${new Date().toLocaleTimeString()} ---`);
//     console.log(`Scheme Name: ${data.meta.scheme_name}`);
//     console.log(`Date: ${latestNAV.date}`);
//     console.log(`NAV: ₹${latestNAV.nav}`);
//   } catch (error) {
//     console.error('Error fetching NAV:', error);
//   }
// }

// // Run every 1 minute
// // cron.schedule('* * * * *', () => {
// //   getNav();
// // });


// // Schedule at 10:00 AM every day
// cron.schedule('0 10 * * *', () => {
//   console.log('⏱️ Running NAV fetch job...');
//   getNavAndSave();
// });


// // cron.schedule('0 10 * * *', () => {
// //   console.log(`[${new Date().toLocaleTimeString()}] ⏱️ Running scheduled NAV fetch...`);
// //   getNav();
// // });



// import dotenv from 'dotenv';
// dotenv.config();
// import mongoose from 'mongoose';
// import cron from 'node-cron';
// import fetch from 'node-fetch';
// import NavHistory from './models/NavHistory.js'; 

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('✅ MongoDB connected for NAV cron job');
// }).catch((err) => {
//   console.error('❌ MongoDB connection error:', err);
// });

// async function getNavAndSave() {
//   const schemeCode = '119721';
//   const url = `https://api.mfapi.in/mf/${schemeCode}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     const latestNAV = data.data[0];

//     await NavHistory.findOneAndUpdate(
//       { schemeCode, date: latestNAV.date },
//       {
//         schemeCode,
//         schemeName: data.meta.scheme_name,
//         date: latestNAV.date,
//         nav: parseFloat(latestNAV.nav),
//       },
//       { upsert: true, new: true }
//     );

//     console.log(`[${new Date().toLocaleTimeString()}] ✅ NAV Saved: ₹${latestNAV.nav}`);
//   } catch (error) {
//     console.error('❌ Error saving NAV:', error.message);
//   }
// }

// // Schedule at 10:00 AM every day
// cron.schedule('0 10 * * *', () => {
//   console.log('⏱️ Running NAV fetch job...');
//   getNavAndSave();
// });


// // Run every 1 minute
// cron.schedule('* * * * *', () => {
//   getNavAndSave();
// });



import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import cron from 'node-cron';
import fetch from 'node-fetch';
import NavHistory from './models/NavHistory.js';
import express from 'express'; // added

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected for NAV cron job');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

async function getNavAndSave() {
  const schemeCode = '119721';
  const url = `https://api.mfapi.in/mf/${schemeCode}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const latestNAV = data.data[0];

    await NavHistory.findOneAndUpdate(
      { schemeCode, date: latestNAV.date },
      {
        schemeCode,
        schemeName: data.meta.scheme_name,
        date: latestNAV.date,
        nav: parseFloat(latestNAV.nav),
      },
      { upsert: true, new: true }
    );

    console.log(`[${new Date().toLocaleTimeString()}] ✅ NAV Saved: ₹${latestNAV.nav}`);
  } catch (error) {
    console.error('❌ Error saving NAV:', error.message);
  }
}

// Schedule at 10:00 AM every day
cron.schedule('0 10 * * *', () => {
  console.log('⏱️ Running NAV fetch job...');
  getNavAndSave();
});

// 🔽 Add this to keep Render happy
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ NAV Cron Job Service is Running');
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});
