// Popular colleges in India with their coordinates
// This is a starter list - can be expanded or moved to database seeding

export const popularColleges = [
  // VIT Campuses
  {
    name: "Vellore Institute of Technology, Vellore",
    shortName: "VIT Vellore",
    location: {
      type: "Point",
      coordinates: [79.1591, 12.9698], // [longitude, latitude]
    },
    address: {
      city: "Vellore",
      state: "Tamil Nadu",
      pincode: "632014",
    },
    type: "Engineering",
  },
  {
    name: "Vellore Institute of Technology, Bhopal",
    shortName: "VIT Bhopal",
    location: {
      type: "Point",
      coordinates: [77.6858, 23.0893],
    },
    address: {
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "466114",
    },
    type: "Engineering",
  },
  {
    name: "Vellore Institute of Technology, Chennai",
    shortName: "VIT Chennai",
    location: {
      type: "Point",
      coordinates: [80.1548, 12.8407],
    },
    address: {
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600127",
    },
    type: "Engineering",
  },

  // SRM Campuses
  {
    name: "SRM Institute of Science and Technology",
    shortName: "SRM University",
    location: {
      type: "Point",
      coordinates: [80.0414, 12.8230],
    },
    address: {
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "603203",
    },
    type: "Engineering",
  },

  // IIT Campuses
  {
    name: "Indian Institute of Technology Delhi",
    shortName: "IIT Delhi",
    location: {
      type: "Point",
      coordinates: [77.1925, 28.5450],
    },
    address: {
      city: "New Delhi",
      state: "Delhi",
      pincode: "110016",
    },
    type: "Engineering",
  },
  {
    name: "Indian Institute of Technology Bombay",
    shortName: "IIT Bombay",
    location: {
      type: "Point",
      coordinates: [72.9128, 19.1334],
    },
    address: {
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400076",
    },
    type: "Engineering",
  },
  {
    name: "Indian Institute of Technology Madras",
    shortName: "IIT Madras",
    location: {
      type: "Point",
      coordinates: [80.2331, 12.9916],
    },
    address: {
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600036",
    },
    type: "Engineering",
  },
  {
    name: "Indian Institute of Technology Kanpur",
    shortName: "IIT Kanpur",
    location: {
      type: "Point",
      coordinates: [80.2329, 26.5123],
    },
    address: {
      city: "Kanpur",
      state: "Uttar Pradesh",
      pincode: "208016",
    },
    type: "Engineering",
  },
  {
    name: "Indian Institute of Technology Kharagpur",
    shortName: "IIT Kharagpur",
    location: {
      type: "Point",
      coordinates: [87.3119, 22.3149],
    },
    address: {
      city: "Kharagpur",
      state: "West Bengal",
      pincode: "721302",
    },
    type: "Engineering",
  },
  {
    name: "Indian Institute of Technology Roorkee",
    shortName: "IIT Roorkee",
    location: {
      type: "Point",
      coordinates: [77.8958, 29.8670],
    },
    address: {
      city: "Roorkee",
      state: "Uttarakhand",
      pincode: "247667",
    },
    type: "Engineering",
  },

  // NIT Campuses
  {
    name: "National Institute of Technology Trichy",
    shortName: "NIT Trichy",
    location: {
      type: "Point",
      coordinates: [78.8150, 10.7554],
    },
    address: {
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      pincode: "620015",
    },
    type: "Engineering",
  },
  {
    name: "National Institute of Technology Kurukshetra",
    shortName: "NIT Kurukshetra",
    location: {
      type: "Point",
      coordinates: [76.8172, 29.9457],
    },
    address: {
      city: "Kurukshetra",
      state: "Haryana",
      pincode: "136119",
    },
    type: "Engineering",
  },
  {
    name: "National Institute of Technology Warangal",
    shortName: "NIT Warangal",
    location: {
      type: "Point",
      coordinates: [79.5305, 17.9869],
    },
    address: {
      city: "Warangal",
      state: "Telangana",
      pincode: "506004",
    },
    type: "Engineering",
  },

  // BITS Campuses
  {
    name: "Birla Institute of Technology and Science Pilani",
    shortName: "BITS Pilani",
    location: {
      type: "Point",
      coordinates: [75.5870, 28.3636],
    },
    address: {
      city: "Pilani",
      state: "Rajasthan",
      pincode: "333031",
    },
    type: "Engineering",
  },
  {
    name: "Birla Institute of Technology and Science Goa",
    shortName: "BITS Goa",
    location: {
      type: "Point",
      coordinates: [73.9122, 15.3806],
    },
    address: {
      city: "Goa",
      state: "Goa",
      pincode: "403726",
    },
    type: "Engineering",
  },

  // Delhi University Campuses
  {
    name: "Delhi University North Campus",
    shortName: "DU North Campus",
    location: {
      type: "Point",
      coordinates: [77.2090, 28.6889],
    },
    address: {
      city: "New Delhi",
      state: "Delhi",
      pincode: "110007",
    },
    type: "University",
  },
  {
    name: "Delhi University South Campus",
    shortName: "DU South Campus",
    location: {
      type: "Point",
      coordinates: [77.2167, 28.5245],
    },
    address: {
      city: "New Delhi",
      state: "Delhi",
      pincode: "110021",
    },
    type: "University",
  },

  // Other Major Institutes
  {
    name: "Manipal Institute of Technology",
    shortName: "Manipal University",
    location: {
      type: "Point",
      coordinates: [74.7833, 13.3500],
    },
    address: {
      city: "Manipal",
      state: "Karnataka",
      pincode: "576104",
    },
    type: "Engineering",
  },
  {
    name: "Anna University",
    shortName: "Anna University",
    location: {
      type: "Point",
      coordinates: [80.2331, 13.0115],
    },
    address: {
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600025",
    },
    type: "Engineering",
  },
  {
    name: "Jadavpur University",
    shortName: "Jadavpur University",
    location: {
      type: "Point",
      coordinates: [88.3707, 22.4987],
    },
    address: {
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700032",
    },
    type: "University",
  },
  {
    name: "Banaras Hindu University",
    shortName: "BHU",
    location: {
      type: "Point",
      coordinates: [82.9916, 25.2677],
    },
    address: {
      city: "Varanasi",
      state: "Uttar Pradesh",
      pincode: "221005",
    },
    type: "University",
  },
  {
    name: "Aligarh Muslim University",
    shortName: "AMU",
    location: {
      type: "Point",
      coordinates: [78.0880, 27.8974],
    },
    address: {
      city: "Aligarh",
      state: "Uttar Pradesh",
      pincode: "202002",
    },
    type: "University",
  },
  {
    name: "Jamia Millia Islamia",
    shortName: "Jamia",
    location: {
      type: "Point",
      coordinates: [77.2800, 28.5615],
    },
    address: {
      city: "New Delhi",
      state: "Delhi",
      pincode: "110025",
    },
    type: "University",
  },
];

// Function to search colleges by name
export const searchColleges = (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  
  return popularColleges.filter(
    (college) =>
      college.name.toLowerCase().includes(searchTerm) ||
      college.shortName.toLowerCase().includes(searchTerm) ||
      college.address.city.toLowerCase().includes(searchTerm)
  );
};

// Function to get college by exact name match
export const getCollegeByName = (name) => {
  const searchTerm = name.toLowerCase().trim();
  
  return popularColleges.find(
    (college) =>
      college.name.toLowerCase() === searchTerm ||
      college.shortName.toLowerCase() === searchTerm
  );
};
