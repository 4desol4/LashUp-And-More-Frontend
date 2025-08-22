import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

// Currency formatter
export const formatCurrency = (amount, currency = 'NGN', locale = 'en-NG') => {
  if (isNaN(amount)) return '₦0.00';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Number formatter
export const formatNumber = (number, locale = 'en-US') => {
  if (isNaN(number)) return '0';
  
  return new Intl.NumberFormat(locale).format(number);
};

// Date formatters
export const dateFormatters = {
  // Format date to readable string
  toReadable: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, 'MMM dd, yyyy');
  },
  
  // Format date with time
  toDateTime: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, 'MMM dd, yyyy at h:mm a');
  },
  
  // Format time only
  toTime: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, 'h:mm a');
  },
  
  // Format to ISO string for form inputs
  toInputValue: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, 'yyyy-MM-dd');
  },
  
  // Format to time input value
  toTimeInput: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return format(parsedDate, 'HH:mm');
  },
  
  // Format relative time (e.g., "2 hours ago")
  toRelative: (date) => {
    if (!date) return '';
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsedDate)) return '';
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  },
  
  // Format for display in different contexts
  short: (date) => format(date, 'MM/dd/yy'),
  long: (date) => format(date, 'EEEE, MMMM dd, yyyy'),
  compact: (date) => format(date, 'MMM dd'),
};

// Phone number formatter
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format US phone numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format international numbers (basic)
  if (cleaned.length > 10) {
    return `+${cleaned.slice(0, -10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }
  
  return phoneNumber;
};

// Name formatter
export const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  if (!lastName) return firstName;
  if (!firstName) return lastName;
  return `${firstName} ${lastName}`;
};

// Initials generator
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Address formatter
export const formatAddress = (address) => {
  if (!address) return '';
  
  const { street, city, state, zipCode, country } = address;
  const parts = [street, city, state, zipCode, country].filter(Boolean);
  return parts.join(', ');
};

// File size formatter
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Percentage formatter
export const formatPercentage = (value, total, decimals = 1) => {
  if (!total || total === 0) return '0%';
  
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

// Order status formatter
export const formatStatus = (status) => {
  if (!status) return '';
  
  return status
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Text formatters
export const textFormatters = {
  // Convert to title case
  toTitleCase: (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },
  
  // Convert to sentence case
  toSentenceCase: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  // Convert to kebab case
  toKebabCase: (str) => {
    if (!str) return '';
    return str
      .replace(/\s+/g, '-')
      .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
      .replace(/^-/, '')
      .toLowerCase();
  },
  
  // Convert to camel case
  toCamelCase: (str) => {
    if (!str) return '';
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  },
  
  // Remove HTML tags
  stripHtml: (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  },
  
  // Truncate with ellipsis
  truncate: (str, length = 100, ending = '...') => {
    if (!str || str.length <= length) return str || '';
    return str.substring(0, length - ending.length) + ending;
  }
};

// URL slug formatter
export const createSlug = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};