// import mongoose from 'mongoose';

// const navHistorySchema = new mongoose.Schema({
//   schemeCode: String,
//   schemeName: String,
//   date: String,
//   nav: Number,
// });

// export default mongoose.model('NavHistory', navHistorySchema);


import mongoose from 'mongoose';

const navHistorySchema = new mongoose.Schema({
  schemeCode: String,
  schemeName: String,
  date: String,
  nav: Number,
});

const NavHistory = mongoose.model('NavHistory', navHistorySchema);

export default NavHistory;
