export type Dictionary = {
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    search: string;
    noResults: string;
  };
  map: {
    searchPlaceholder: string;
    allCategories: string;
    categories: {
      rides: string;
      food: string;
      facility: string;
      gate: string;
    };
    noImage: string;
    directions: string;
    openDetail: string;
  };
  errors: {
    notFound: {
      title: string;
      description: string;
      backHome: string;
    };
    serverError: {
      title: string;
      description: string;
      retry: string;
    };
  };
};

export const en: Dictionary = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Try again',
    close: 'Close',
    search: 'Search',
    noResults: 'No results found',
  },
  map: {
    searchPlaceholder: 'Search locations...',
    allCategories: 'All Categories',
    categories: {
      rides: 'Rides',
      food: 'Food & Beverage',
      facility: 'Facilities',
      gate: 'Gates',
    },
    noImage: 'No image available',
    directions: 'Get Directions',
    openDetail: 'View Details',
  },
  errors: {
    notFound: {
      title: 'Page not found',
      description: "The page you're looking for doesn't exist.",
      backHome: 'Back to home',
    },
    serverError: {
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again.',
      retry: 'Try again',
    },
  },
};
