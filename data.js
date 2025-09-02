// Mock data for the application
const mockData = {
  // User credentials and roles
  users: {
    'sahaay@gov.in': {
      password: 'sahaay@123',
      role: 'super-admin',
      name: 'Super Admin',
      jurisdiction: 'Jharkhand'
    },
    'ranchi@gov.in': {
      password: 'ranchi@123',
      role: 'municipality-admin',
      name: 'Ranchi Admin',
      jurisdiction: 'Ranchi'
    }
  },

  // Cities, wards, and departments structure
  locations: {
    'Ranchi': {
      wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'],
      departments: {
        'Roads Dept': {
          officers: [
            { name: 'Raj Kumar', email: 'raj.roads@ranchi.gov.in', phone: '+91-9876543210' },
            { name: 'Priya Singh', email: 'priya.roads@ranchi.gov.in', phone: '+91-9876543211' }
          ]
        },
        'Garbage Dept': {
          officers: [
            { name: 'Amit Sharma', email: 'amit.garbage@ranchi.gov.in', phone: '+91-9876543212' },
            { name: 'Sunita Devi', email: 'sunita.garbage@ranchi.gov.in', phone: '+91-9876543213' }
          ]
        },
        'Streetlight Dept': {
          officers: [
            { name: 'Vikash Gupta', email: 'vikash.light@ranchi.gov.in', phone: '+91-9876543214' },
            { name: 'Meera Kumari', email: 'meera.light@ranchi.gov.in', phone: '+91-9876543215' }
          ]
        }
      }
    },
    'Jamshedpur': {
      wards: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'],
      departments: {
        'Roads Dept': {
          officers: [
            { name: 'Ravi Tiwari', email: 'ravi.roads@jsr.gov.in', phone: '+91-9876543216' },
            { name: 'Kavita Jha', email: 'kavita.roads@jsr.gov.in', phone: '+91-9876543217' }
          ]
        },
        'Garbage Dept': {
          officers: [
            { name: 'Suresh Yadav', email: 'suresh.garbage@jsr.gov.in', phone: '+91-9876543218' },
            { name: 'Anita Roy', email: 'anita.garbage@jsr.gov.in', phone: '+91-9876543219' }
          ]
        },
        'Streetlight Dept': {
          officers: [
            { name: 'Deepak Singh', email: 'deepak.light@jsr.gov.in', phone: '+91-9876543220' },
            { name: 'Rekha Devi', email: 'rekha.light@jsr.gov.in', phone: '+91-9876543221' }
          ]
        }
      }
    },
    'Dhanbad': {
      wards: ['Ward A', 'Ward B', 'Ward C'],
      departments: {
        'Roads Dept': {
          officers: [
            { name: 'Manoj Kumar', email: 'manoj.roads@dhanbad.gov.in', phone: '+91-9876543222' },
            { name: 'Sita Kumari', email: 'sita.roads@dhanbad.gov.in', phone: '+91-9876543223' }
          ]
        },
        'Garbage Dept': {
          officers: [
            { name: 'Ramesh Prasad', email: 'ramesh.garbage@dhanbad.gov.in', phone: '+91-9876543224' },
            { name: 'Geeta Singh', email: 'geeta.garbage@dhanbad.gov.in', phone: '+91-9876543225' }
          ]
        },
        'Streetlight Dept': {
          officers: [
            { name: 'Ajay Verma', email: 'ajay.light@dhanbad.gov.in', phone: '+91-9876543226' },
            { name: 'Pooja Devi', email: 'pooja.light@dhanbad.gov.in', phone: '+91-9876543227' }
          ]
        }
      }
    }
  },

  // Sample issues data
  issues: [
    {
      id: 'ISS001',
      title: 'Large pothole on Main Road',
      description: 'There is a large pothole on Main Road near the market that is causing traffic issues and vehicle damage.',
      type: 'pothole',
      city: 'Ranchi',
      ward: 'Ward 5',
      location: 'Main Road, Near Market, Ranchi',
      coordinates: [23.3441, 85.3096],
      status: 'pending',
      reportedDate: '2024-01-15',
      assignedTo: null,
      assignedOfficer: null,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
    },
    {
      id: 'ISS002',
      title: 'Garbage not collected for 3 days',
      description: 'Garbage has not been collected from our locality for the past 3 days. The area is becoming unhygienic.',
      type: 'garbage',
      city: 'Ranchi',
      ward: 'Ward 3',
      location: 'Residential Area, Ward 3, Ranchi',
      coordinates: [23.3521, 85.3240],
      status: 'in-progress',
      reportedDate: '2024-01-14',
      assignedTo: 'Garbage Dept',
      assignedOfficer: 'Amit Sharma',
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop'
    },
    {
      id: 'ISS003',
      title: 'Street light not working',
      description: 'The street light on Park Street has been non-functional for over a week, making the area unsafe at night.',
      type: 'streetlight',
      city: 'Jamshedpur',
      ward: 'Zone 2',
      location: 'Park Street, Zone 2, Jamshedpur',
      coordinates: [22.8046, 86.2029],
      status: 'resolved',
      reportedDate: '2024-01-10',
      assignedTo: 'Streetlight Dept',
      assignedOfficer: 'Deepak Singh',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: 'ISS004',
      title: 'Road damage after construction',
      description: 'Road has been damaged after recent construction work. Multiple potholes and uneven surface.',
      type: 'pothole',
      city: 'Jamshedpur',
      ward: 'Zone 1',
      location: 'Industrial Area, Zone 1, Jamshedpur',
      coordinates: [22.7996, 86.1844],
      status: 'pending',
      reportedDate: '2024-01-16',
      assignedTo: null,
      assignedOfficer: null,
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop'
    },
    {
      id: 'ISS005',
      title: 'Overflowing garbage bins',
      description: 'Public garbage bins are overflowing and creating a mess in the commercial area.',
      type: 'garbage',
      city: 'Dhanbad',
      ward: 'Ward A',
      location: 'Commercial Complex, Ward A, Dhanbad',
      coordinates: [23.7957, 86.4304],
      status: 'in-progress',
      reportedDate: '2024-01-13',
      assignedTo: 'Garbage Dept',
      assignedOfficer: 'Ramesh Prasad',
      image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&h=300&fit=crop'
    },
    {
      id: 'ISS006',
      title: 'Multiple street lights out',
      description: 'Several street lights in the residential colony are not working, affecting safety.',
      type: 'streetlight',
      city: 'Ranchi',
      ward: 'Ward 2',
      location: 'Green Valley Colony, Ward 2, Ranchi',
      coordinates: [23.3629, 85.3346],
      status: 'pending',
      reportedDate: '2024-01-17',
      assignedTo: null,
      assignedOfficer: null,
      image: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deae?w=400&h=300&fit=crop'
    },
    {
      id: 'ISS007',
      title: 'Broken road surface',
      description: 'Road surface is completely broken making it difficult for vehicles to pass.',
      type: 'pothole',
      city: 'Dhanbad',
      ward: 'Ward B',
      location: 'Station Road, Ward B, Dhanbad',
      coordinates: [23.8103, 86.4259],
      status: 'resolved',
      reportedDate: '2024-01-08',
      assignedTo: 'Roads Dept',
      assignedOfficer: 'Manoj Kumar',
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=300&fit=crop'
    },
    {
      id: 'ISS008',
      title: 'Illegal garbage dumping',
      description: 'People are dumping garbage illegally in the open area near the school.',
      type: 'garbage',
      city: 'Jamshedpur',
      ward: 'Zone 3',
      location: 'Near Government School, Zone 3, Jamshedpur',
      coordinates: [22.8156, 86.2025],
      status: 'in-progress',
      reportedDate: '2024-01-12',
      assignedTo: 'Garbage Dept',
      assignedOfficer: 'Suresh Yadav',
      image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop'
    }
  ]
};

// Helper functions for data manipulation
const dataHelpers = {
  // Get issues based on user role and jurisdiction
  getIssuesForUser: (userRole, jurisdiction) => {
    if (userRole === 'super-admin') {
      return mockData.issues;
    } else if (userRole === 'municipality-admin') {
      return mockData.issues.filter(issue => issue.city === jurisdiction);
    }
    return [];
  },

  // Get officers for a specific city and department
  getOfficers: (city, department) => {
    if (mockData.locations[city] && mockData.locations[city].departments[department]) {
      return mockData.locations[city].departments[department].officers;
    }
    return [];
  },

  // Get all officers for a city
  getAllOfficersForCity: (city) => {
    const officers = [];
    if (mockData.locations[city]) {
      Object.keys(mockData.locations[city].departments).forEach(dept => {
        mockData.locations[city].departments[dept].officers.forEach(officer => {
          officers.push({
            ...officer,
            department: dept
          });
        });
      });
    }
    return officers;
  },

  // Update issue status
  updateIssue: (issueId, updates) => {
    const issueIndex = mockData.issues.findIndex(issue => issue.id === issueId);
    if (issueIndex !== -1) {
      mockData.issues[issueIndex] = { ...mockData.issues[issueIndex], ...updates };
      return true;
    }
    return false;
  },

  // Get statistics
  getStats: (issues) => {
    const stats = {
      pending: 0,
      'in-progress': 0,
      resolved: 0,
      total: issues.length
    };

    issues.forEach(issue => {
      stats[issue.status]++;
    });

    return stats;
  },

  // Get city performance data
  getCityPerformance: () => {
    const cities = Object.keys(mockData.locations);
    const performance = {};

    cities.forEach(city => {
      const cityIssues = mockData.issues.filter(issue => issue.city === city);
      const stats = dataHelpers.getStats(cityIssues);
      const resolutionRate = cityIssues.length > 0 ? (stats.resolved / cityIssues.length * 100).toFixed(1) : 0;
      
      performance[city] = {
        total: stats.total,
        resolved: stats.resolved,
        pending: stats.pending,
        inProgress: stats['in-progress'],
        resolutionRate: parseFloat(resolutionRate)
      };
    });

    return performance;
  },

  // Get monthly trend data
  getMonthlyTrends: () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const trends = {
      reported: [12, 19, 15, 25, 22, 18],
      resolved: [8, 15, 12, 20, 18, 15]
    };
    return { months, trends };
  }
};
